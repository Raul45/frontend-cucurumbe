/**
 * Smoke test del panel admin con Chrome headless + CDP (sin dependencias).
 * Uso: node scripts/admin-smoke.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? "http://localhost:3000";
const CDP_PORT = 9333;

const { spawn, spawnSync, execSync } = await import("node:child_process");
const fs = await import("node:fs");
const os = await import("node:os");
const path = await import("node:path");

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-admin-"));

// Si una corrida anterior quedó colgada, su Chrome seguiría ocupando el puerto.
try {
  spawnSync("pkill", ["-f", `chrome-admin-`], { stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 500));
} catch {}

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targetWs() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("No se pudo conectar con Chrome");
}

let id = 0;
function rpc(ws, method, params = {}, sessionId) {
  const msgId = ++id;
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id !== msgId) return;
      ws.removeEventListener("message", onMessage);
      if (msg.error) reject(new Error(`${method}: ${msg.error.message}`));
      else resolve(msg.result);
    };
    ws.addEventListener("message", onMessage);
    ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
  });
}

function limpiar() {
  chrome.kill();
  // Chrome sigue escribiendo en el perfil unos ms después de salir.
  for (let i = 0; i < 5; i++) {
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
      return;
    } catch {
      execSync("sleep 0.2");
    }
  }
}

const results = [];
function check(name, ok, extra = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`);
}

const wsUrl = await targetWs();
const ws = new WebSocket(wsUrl);
await new Promise((resolve) => ws.addEventListener("open", resolve));

const { targetInfos } = await rpc(ws, "Target.getTargets");
const { sessionId } = await rpc(ws, "Target.attachToTarget", {
  targetId: targetInfos.find((t) => t.type === "page").targetId,
  flatten: true,
});
const call = (method, params) => rpc(ws, method, params, sessionId);

await call("Page.enable");
await call("Runtime.enable");
// Viewport de escritorio para que el sidebar (lg:) sea el visible.
await call("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

const errores = [];
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === "Runtime.exceptionThrown") {
    errores.push(
      msg.params.exceptionDetails?.exception?.description ??
        msg.params.exceptionDetails?.text ??
        "excepción",
    );
  }
  if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
    errores.push(msg.params.args.map((a) => a.value ?? a.description ?? "").join(" "));
  }
});

async function evaluate(expression) {
  const { result, exceptionDetails } = await call("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception?.description ?? "error");
  }
  return result.value;
}

const goto = async (url, wait = 1300) => {
  await call("Page.navigate", { url });
  await sleep(wait);
};

/** Espera a que el cliente termine de hidratar/renderizar. */
async function waitFor(selector, timeout = 20000) {
  const inicio = Date.now();
  while (Date.now() - inicio < timeout) {
    const ok = await evaluate(
      `!!document.querySelector(${JSON.stringify(selector)})`,
    );
    if (ok) return true;
    await sleep(250);
  }
  throw new Error(`timeout esperando ${selector}`);
}

async function waitForPath(pathname, timeout = 20000) {
  const inicio = Date.now();
  while (Date.now() - inicio < timeout) {
    if ((await evaluate("location.pathname")) === pathname) return true;
    await sleep(250);
  }
  throw new Error(`timeout esperando la ruta ${pathname}`);
}

const texto = () => evaluate("document.body.innerText");
const urlActual = () => evaluate("location.pathname");
const hrefs = () =>
  evaluate("[...document.querySelectorAll('a')].map(a => a.getAttribute('href'))");
const filas = () => evaluate("document.querySelectorAll('tbody tr').length");

/** Escribe en un input controlado por React disparando el setter nativo. */
const fill = (sel, value) =>
  evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) throw new Error('no existe ' + ${JSON.stringify(sel)});
    const proto = el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype
      : el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  })()`);

const submit = () => evaluate("document.querySelector('form').requestSubmit(), true");
const clickText = (txt) =>
  evaluate(`(() => {
    const el = [...document.querySelectorAll('button, a')].find(b => b.innerText.trim().includes(${JSON.stringify(txt)}));
    if (!el) throw new Error('no existe botón ' + ${JSON.stringify(txt)});
    el.click();
    return true;
  })()`);

// ---------------------------------------------------------------- sitio público
await goto(`${BASE}/`);
check("home pública con navbar", (await hrefs()).includes("/productos"));

// ---------------------------------------------------------------- guard
await goto(`${BASE}/admin-panel/dashboard`);
await waitForPath("/admin-panel/login");
await waitFor('input[name="usuario"]');
check("guard redirige a login", (await urlActual()) === "/admin-panel/login", await urlActual());

// ---------------------------------------------------------------- login
await fill('input[name="usuario"]', "admin");
await fill('input[name="password"]', "malo");
await submit();
await sleep(500);
check(
  "login rechaza password incorrecta",
  (await texto()).includes("Usuario o contraseña incorrectos"),
);

await fill('input[name="password"]', "cucurumbe");
await submit();
await waitForPath("/admin-panel/dashboard");
await sleep(600);
check("login entra al dashboard", (await urlActual()) === "/admin-panel/dashboard", await urlActual());

// ---------------------------------------------------------------- dashboard
await waitFor(".recharts-surface");
const dashboard = await texto();
const dashboardLower = dashboard.toLowerCase();
check("dashboard: heading", dashboardLower.includes("dashboard"));
check(
  "dashboard: cards",
  dashboardLower.includes("ventas sep") && dashboardLower.includes("leads pendientes"),
);
const surfaces = await evaluate("document.querySelectorAll('.recharts-surface').length");
check("dashboard: gráficas recharts", surfaces >= 3, `surfaces=${surfaces}`);

// ---------------------------------------------------------------- productos
await goto(`${BASE}/admin-panel/productos`);
await waitFor('input[type="search"]');
await waitFor("tbody tr");
check("productos: 8 filas", (await filas()) === 8, `filas=${await filas()}`);

await fill('input[type="search"]', "Espresso");
await sleep(400);
check("productos: filtro de búsqueda", (await filas()) === 1, `filas=${await filas()}`);

await fill('input[type="search"]', "");
await sleep(300);

await goto(`${BASE}/admin-panel/productos/nuevo`);
await waitFor('input[name="nombre"]');
await fill('input[name="nombre"]', "Blend Nocturno");
await fill('input[name="precio"]', "299");
await fill('input[name="stock"]', "12");
await submit();
await waitForPath("/admin-panel/productos");
await waitFor("tbody tr");
check("productos: crear", (await urlActual()) === "/admin-panel/productos", await urlActual());
check("productos: nuevo en la tabla", (await texto()).includes("Blend Nocturno"));
check(
  "productos: persistido en localStorage",
  await evaluate(
    `JSON.parse(localStorage.getItem('cucurumbe_admin_data')).productos.some(p => p.nombre === 'Blend Nocturno')`,
  ),
);

await goto(`${BASE}/admin-panel/productos/prd-001/editar`);
await waitFor('input[name="nombre"]');
const nombrePrecargado = await evaluate(
  `document.querySelector('input[name="nombre"]').value`,
);
check(
  "productos: formulario precargado",
  nombrePrecargado === "Café Tostado Claro",
  nombrePrecargado,
);
await fill('input[name="nombre"]', "Café Tostado Claro (editado)");
await fill('input[name="stock"]', "99");
await submit();
await waitForPath("/admin-panel/productos");
await waitFor("tbody tr");
check("productos: editar", (await texto()).includes("Café Tostado Claro (editado)"));

// ---------------------------------------------------------------- sucursales
await goto(`${BASE}/admin-panel/sucursales`);
await waitFor("tbody tr");
check("sucursales: 3 filas", (await filas()) === 3, `filas=${await filas()}`);

await goto(`${BASE}/admin-panel/sucursales/nueva`);
await waitFor('input[name="nombre"]');
await fill('input[name="nombre"]', "Sucursal Test");
await fill('input[name="direccion"]', "Calle Test 1");
await submit();
await waitForPath("/admin-panel/sucursales");
await waitFor("tbody tr");
check("sucursales: crear", (await texto()).includes("Sucursal Test"));

await goto(`${BASE}/admin-panel/sucursales/suc-002/editar`);
await waitFor('input[name="nombre"]');
await fill('input[name="telefono"]', "618 000 1111");
await submit();
await waitForPath("/admin-panel/sucursales");
await waitFor("tbody tr");
check("sucursales: editar", (await texto()).includes("618 000 1111"));

// ---------------------------------------------------------------- leads
await goto(`${BASE}/admin-panel/leads`);
await waitFor("tbody tr");
check("leads: listado", (await texto()).includes("Ana Torres"));
await fill("tbody tr select", "atendido");
await sleep(400);
check(
  "leads: cambio de estado",
  await evaluate(
    `JSON.parse(localStorage.getItem('cucurumbe_admin_data')).leads.find(l => l.id === 'lead-001').status === 'atendido'`,
  ),
);

await goto(`${BASE}/admin-panel/leads/lead-002/editar`);
await waitFor('select[name="status"]');
check("leads: detalle solo lectura", (await texto()).includes("Consulta por mayoreo"));
await fill('select[name="status"]', "pendiente");
await submit();
await waitForPath("/admin-panel/leads");
await waitFor("tbody tr");
check("leads: editar status desde detalle", (await urlActual()) === "/admin-panel/leads", await urlActual());
check(
  "leads: status aplicado",
  await evaluate(
    `JSON.parse(localStorage.getItem('cucurumbe_admin_data')).leads.find(l => l.id === 'lead-002').status === 'pendiente'`,
  ),
);

// ---------------------------------------------------------------- eliminar
await goto(`${BASE}/admin-panel/productos`);
await waitFor("tbody tr");
await evaluate(`(() => {
  window.confirm = () => true;
  const fila = [...document.querySelectorAll('tbody tr')].find(f => f.innerText.includes('Blend Nocturno'));
  fila.querySelector('button[aria-label^="Eliminar"]').click();
})()`);
await sleep(600);
check("productos: eliminar", !(await texto()).includes("Blend Nocturno"));

// ---------------------------------------------------------------- logout
await goto(`${BASE}/admin-panel/dashboard`);
await waitForPath("/admin-panel/dashboard");
await waitFor("button");
await clickText("Cerrar sesión");
await waitForPath("/admin-panel/login");
await waitFor('input[name="usuario"]');
check("logout vuelve al login", (await urlActual()) === "/admin-panel/login", await urlActual());

// ---------------------------------------------------------------- usuario temporal
await clickText("invitado");
await submit();
await waitForPath("/admin-panel/dashboard");
await waitFor(".recharts-surface");
const conTemporal = await texto();
check("cuenta temporal entra al dashboard", conTemporal.toLowerCase().includes("ventas sep"));
check(
  "sidebar muestra la sesion temporal",
  conTemporal.includes("Invitado temporal"),
);
check(
  "sesion temporal persistida",
  await evaluate("JSON.parse(sessionStorage.getItem('cucurumbe_admin_session')).temporal === true"),
);

await clickText("Cerrar sesi");
await waitForPath("/admin-panel/login");
await waitFor('input[name="usuario"]');
check("cuenta temporal puede cerrar sesion", (await urlActual()) === "/admin-panel/login");

// ---------------------------------------------------------------- errores
check("sin errores de consola", errores.length === 0, errores.join(" | ").slice(0, 500));

process.on("uncaughtException", (error) => {
  console.error("ERROR", error.message);
  limpiar();
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.error("ERROR", error?.message ?? error);
  limpiar();
  process.exit(1);
});

const fallos = results.filter((r) => !r.ok);
console.log(`\n${results.length - fallos.length}/${results.length} checks OK`);
ws.close();
limpiar();
process.exit(fallos.length === 0 ? 0 : 1);