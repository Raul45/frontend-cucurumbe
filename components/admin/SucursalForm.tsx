"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createBranch,
  getBranch,
  type Branch,
  type BranchSchedule,
  type BranchDaySchedule,
  type BranchStatus,
  updateBranch
} from "@/services/branch.service";

import PageHeader from "./PageHeader";
import { CampoSelect, CampoTexto } from "./FormControls";
import { BackIcon } from "./icons";
import { useImageManager } from "@/hooks/useImageManager";
import ImageUploader from "./ImageUploader";

export const NUEVO_ID = "nueva";

type Props = {
  id: string;
};

const initialSchedule: BranchSchedule = {
  monday: {},
  tuesday: {},
  wednesday: {},
  thursday: {},
  friday: {},
  saturday: {},
  sunday: {},
};

const days: {
  key: keyof BranchSchedule;
  label: string;
}[] = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];


function SeccionColapsable({
  titulo,
  children,
  abierta = false,
}: {
  titulo: string;
  children: React.ReactNode;
  abierta?: boolean;
}) {
  const [open, setOpen] = useState(abierta);

  return (
    <section className="overflow-hidden rounded-xl border border-black/5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between bg-white px-4 py-3 text-left transition hover:bg-black/[0.02]"
      >
        <span className="text-sm font-medium text-azabache">
          {titulo}
        </span>

        <span
          className={`text-lg text-gris-pizarra transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
         ⌄
        </span>
      </button>

      {open && (
        <div className="border-t border-black/5 bg-white p-4">
          {children}
        </div>
      )}
    </section>
  );
}


export default function SucursalForm({ id }: Props) {
  const router = useRouter();
    const {
      existingImages,
      newImages,
      previews,
      imagesToDelete,
      setInitialImages,
      handleFilesChange,
      removeExistingImage,
      removeNewImage,
    } = useImageManager();

  const [sucursal, setSucursal] = useState<Branch | null>(null);

  // Información general
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  // Dirección
  const [street, setStreet] = useState("");
  const [exteriorNumber, setExteriorNumber] = useState("");
  const [interiorNumber, setInteriorNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("México");
  const [references, setReferences] = useState("");

  // Ubicación
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  // Contacto
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Horarios
  const [schedule, setSchedule] =
    useState<BranchSchedule>(initialSchedule);

  // Estado
  const [status, setStatus] =
    useState<BranchStatus>("active");

  // Servicios
  const [pickup, setPickup] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [coffeeShop, setCoffeeShop] = useState(true);
  const [ecommerce, setEcommerce] = useState(false);

  // Estado del formulario
  const [loading, setLoading] =
    useState(id !== NUEVO_ID);

  const [saving, setSaving] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Cargar sucursal cuando estamos editando
   */
  useEffect(() => {
    if (id === NUEVO_ID) {
      setLoading(false);
      return;
    }

    async function cargarSucursal() {
      try {
        setLoading(true);
        setError(null);

        const data = await getBranch(id);

        setSucursal(data);

        setName(data.name ?? "");
        setCode(data.code ?? "");
        setDescription(data.description ?? "");

        setStreet(data.address?.street ?? "");
        setExteriorNumber(
          data.address?.exteriorNumber ?? "",
        );
        setInteriorNumber(
          data.address?.interiorNumber ?? "",
        );
        setNeighborhood(
          data.address?.neighborhood ?? "",
        );
        setCity(data.address?.city ?? "");
        setState(data.address?.state ?? "");
        setPostalCode(
          data.address?.postalCode ?? "",
        );
        setCountry(
          data.address?.country ?? "México",
        );
        setReferences(
          data.address?.references ?? "",
        );

        setLongitude(
          String(
            data.location?.coordinates?.[0] ?? "",
          ),
        );

        setLatitude(
          String(
            data.location?.coordinates?.[1] ?? "",
          ),
        );

        setPhone(data.contact?.phone ?? "");
        setEmail(data.contact?.email ?? "");

        setSchedule(
          data.schedule ?? initialSchedule,
        );

        setStatus(data.status ?? "active");

        setPickup(
          data.services?.pickup ?? false,
        );

        setDelivery(
          data.services?.delivery ?? false,
        );

        setCoffeeShop(
          data.services?.coffeeShop ?? true,
        );

        setEcommerce(
          data.services?.ecommerce ?? false,
        );

        setInitialImages(
          [...(data.images ?? [])].sort(
            (a,b) => a.order - b.order
          )
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar la sucursal.",
        );
      } finally {
        setLoading(false);
      }
    }

    cargarSucursal();
  }, [id]);

   useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);
  /*
   * Actualizar horario
   */
  function handleScheduleChange(
    day: keyof BranchSchedule,
    field: keyof BranchDaySchedule,
    value: string,
  ) {
    setSchedule((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        [field]: value,
      },
    }));
  }


  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    if (!name.trim()) {
      setError(
        "El nombre de la sucursal es obligatorio.",
      );
      return;
    }

    if (!code.trim()) {
      setError(
        "El código de la sucursal es obligatorio.",
      );
      return;
    }

    if (!street.trim()) {
      setError("La calle es obligatoria.");
      return;
    }

    if (!city.trim()) {
      setError("La ciudad es obligatoria.");
      return;
    }

    if (!state.trim()) {
      setError("El estado es obligatorio.");
      return;
    }

    if (!postalCode.trim()) {
      setError(
        "El código postal es obligatorio.",
      );
      return;
    }

    if (
      id === NUEVO_ID &&
      newImages.length === 0
      ) {
      setError("Debes seleccionar al menos una imagen.");
      return;
    }

    const longitudeNum = Number(longitude);
    const latitudeNum = Number(latitude);

    if (!Number.isFinite(longitudeNum)) {
      setError(
        "La longitud debe ser un número válido.",
      );
      return;
    }

    if (!Number.isFinite(latitudeNum)) {
      setError(
        "La latitud debe ser un número válido.",
      );
      return;
    }

    /*
     * Crear
     */
    try {
      setSaving(true);

      if (id === NUEVO_ID) {
        console.log("Archivos seleccionados:", newImages);
        console.log("Cantidad de archivos:", newImages.length);

        const nuevaSucursal = await createBranch({
          name: name.trim(),
          code: code.trim(),
          description: description.trim(),

          address: {
            street: street.trim(),
            exteriorNumber:
              exteriorNumber.trim(),
            interiorNumber:
              interiorNumber.trim(),
            neighborhood:
              neighborhood.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode:
              postalCode.trim(),
            country:
              country.trim(),
            references:
              references.trim(),
          },

          location: {
            type: "Point",
            coordinates: [
              longitudeNum,
              latitudeNum,
            ],
          },

          contact: {
            phone: phone.trim(),
            email: email.trim(),
          },

          schedule,

          services: {
            pickup,
            delivery,
            coffeeShop,
            ecommerce,
          },

          status,

          images: newImages,
        });

        setSucursal(nuevaSucursal);
      } else {
        await updateBranch(id, {
          name: name.trim(),
          code: code.trim(),
          description: description.trim(),
          address: {
            street: street.trim(),
            exteriorNumber:
              exteriorNumber.trim(),
            interiorNumber:
              interiorNumber.trim(),
            neighborhood:
              neighborhood.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode:
              postalCode.trim(),
            country:
              country.trim(),
            references:
              references.trim(),
          },
          location: {
            type: "Point",
            coordinates: [
              longitudeNum,
              latitudeNum,
            ],
          },
          contact: {
            phone: phone.trim(),
            email: email.trim(),
          },
          schedule,
          services: {
            pickup,
            delivery,
            coffeeShop,
            ecommerce,
          },
          status,
          imagesToDelete,
          images: newImages,
        })
      }

      router.push("/admin/sucursales");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la sucursal.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <main>
        <PageHeader
          titulo="Editar sucursal"
          descripcion="Cargando información de la sucursal..."
          volverHref="/admin/sucursales"
        />

        <section className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-gris-pizarra shadow-sm">
          Cargando sucursal...
        </section>
      </main>
    );
  }

  /*
   * Sucursal no encontrada
   */
  if (
    id !== NUEVO_ID &&
    error &&
    !sucursal
  ) {
    return (
      <main>
        <PageHeader
          titulo="Sucursal no encontrada"
          volverHref="/admin/sucursales"
        />

        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        titulo={
          id === NUEVO_ID
            ? "Nueva sucursal"
            : "Editar sucursal"
        }
        descripcion={
          id === NUEVO_ID
            ? "Registra una nueva sucursal de Cucurumbe Café."
            : "Actualiza la información de la sucursal."
        }
        volverHref="/admin/sucursales"
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        {/* Información general */}
        <SeccionColapsable titulo="Información general">
          <div className="grid gap-4 sm:grid-cols-2">
            <CampoTexto
              label="Nombre"
              name="name"
              value={name}
              onChange={setName}
              required
              placeholder="Sucursal Centro Histórico"
            />

            <CampoTexto
              label="Código"
              name="code"
              value={code}
              onChange={setCode}
              required
              placeholder="SUC-001"
            />
          </div>

          <div className="mt-4">
            <CampoTexto
              label="Descripción"
              name="description"
              value={description}
              onChange={setDescription}
              placeholder="Sucursal principal de Cucurumbe Café"
            />
          </div>
        </SeccionColapsable>

        {/* Dirección */}
        <SeccionColapsable titulo="Dirección">
          <div className="grid gap-4 sm:grid-cols-2">
            <CampoTexto
              label="Calle"
              name="street"
              value={street}
              onChange={setStreet}
              required
              placeholder="Av. Principal"
            />

            <CampoTexto
              label="Número exterior"
              name="exteriorNumber"
              value={exteriorNumber}
              onChange={setExteriorNumber}
              required
              placeholder="123"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CampoTexto
              label="Número interior"
              name="interiorNumber"
              value={interiorNumber}
              onChange={setInteriorNumber}
              placeholder="Local 4"
            />

            <CampoTexto
              label="Colonia"
              name="neighborhood"
              value={neighborhood}
              onChange={setNeighborhood}
              required
              placeholder="Centro"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CampoTexto
              label="Ciudad"
              name="city"
              value={city}
              onChange={setCity}
              required
              placeholder="Durango"
            />

            <CampoTexto
              label="Estado"
              name="state"
              value={state}
              onChange={setState}
              required
              placeholder="Durango"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CampoTexto
              label="Código postal"
              name="postalCode"
              value={postalCode}
              onChange={setPostalCode}
              required
              placeholder="34000"
            />

            <CampoTexto
              label="País"
              name="country"
              value={country}
              onChange={setCountry}
              required
              placeholder="México"
            />
          </div>

          <div className="mt-4">
            <CampoTexto
              label="Referencias"
              name="references"
              value={references}
              onChange={setReferences}
              placeholder="Frente a la plaza principal"
            />
          </div>
        </SeccionColapsable>

        {/* Ubicación */}
        <SeccionColapsable titulo="Ubicación">
          <p className="mb-3 text-xs text-gris-pizarra">
            Coordenadas geográficas de la sucursal.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <CampoTexto
              label="Longitud"
              name="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={setLongitude}
              required
              placeholder="-104.669"
            />

            <CampoTexto
              label="Latitud"
              name="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={setLatitude}
              required
              placeholder="24.0277"
            />
          </div>
        </SeccionColapsable>

        {/* Contacto */}
        <SeccionColapsable titulo="Contacto">
          <div className="grid gap-4 sm:grid-cols-2">
            <CampoTexto
              label="Teléfono"
              name="phone"
              type="tel"
              value={phone}
              maxLength={10}
              onChange={setPhone}
              placeholder="6180000000"
            />

            <CampoTexto
              label="Correo electrónico"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="sucursal@cucurumbe.com"
            />
          </div>
        </SeccionColapsable>

        {/* Horarios */}
        <SeccionColapsable titulo="Horarios">
          <div className="space-y-3">
            {days.map((day) => (
              <div
                key={day.key}
                className="grid items-center gap-3 sm:grid-cols-[120px_1fr_1fr]"
              >
                <span className="text-sm font-medium text-gris-pizarra">
                  {day.label}
                </span>

                <CampoTexto
                  label="Apertura"
                  name={`${day.key}-open`}
                  type="time"
                  value={
                    schedule[day.key]?.open ?? ""
                  }
                  onChange={(value) =>
                    handleScheduleChange(
                      day.key,
                      "open",
                      value,
                    )
                  }
                />

                <CampoTexto
                  label="Cierre"
                  name={`${day.key}-close`}
                  type="time"
                  value={
                    schedule[day.key]?.close ?? ""
                  }
                  onChange={(value) =>
                    handleScheduleChange(
                      day.key,
                      "close",
                      value,
                    )
                  }
                />
              </div>
            ))}
          </div>
        </SeccionColapsable>

        {/* Servicios */}
        <SeccionColapsable titulo="Servicios">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-gris-pizarra">
              <input
                type="checkbox"
                checked={pickup}
                onChange={(event) =>
                  setPickup(
                    event.target.checked,
                  )
                }
              />
              Recoger en sucursal
            </label>

            <label className="flex items-center gap-2 text-sm text-gris-pizarra">
              <input
                type="checkbox"
                checked={delivery}
                onChange={(event) =>
                  setDelivery(
                    event.target.checked,
                  )
                }
              />
              Entrega a domicilio
            </label>

            <label className="flex items-center gap-2 text-sm text-gris-pizarra">
              <input
                type="checkbox"
                checked={coffeeShop}
                onChange={(event) =>
                  setCoffeeShop(
                    event.target.checked,
                  )
                }
              />
              Cafetería
            </label>

            <label className="flex items-center gap-2 text-sm text-gris-pizarra">
              <input
                type="checkbox"
                checked={ecommerce}
                onChange={(event) =>
                  setEcommerce(
                    event.target.checked,
                  )
                }
              />
              Ecommerce
            </label>
          </div>
        </SeccionColapsable>

        {/* Estado */}
        <SeccionColapsable titulo="Estado">
          <CampoSelect
            label="Estado de la sucursal"
            name="status"
            value={status}
            onChange={(valorDirecto) =>
              setStatus(
                valorDirecto as BranchStatus,
              )
            }
            opciones={[
              {
                value: "active",
                label: "Activa",
              },
              {
                value: "inactive",
                label: "Inactiva",
              },
              {
                value: "temporarily_closed",
                label: "Cerrada temporalmente",
              },
            ]}
          />
        </SeccionColapsable>

        {/* Imágenes */}
        <section>
          <h3 className="mb-3 text-sm font-medium text-azabache">
            Imágenes
          </h3>

          <p className="mb-3 text-xs text-gris-pizarra">
            Selecciona las imágenes que deseas asociar
            a la sucursal.
          </p>
    
          <ImageUploader
                  existingImages={existingImages}
                  previews={previews}
                  onFilesChange={handleFilesChange}
                  onRemoveExisting={removeExistingImage}
                  onRemoveNew={removeNewImage}
                />
    
        </section>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {/* Acciones */}
        <section className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-azabache px-5 py-2 text-sm font-medium text-white transition hover:bg-azabache/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : id === NUEVO_ID
                ? "Crear sucursal"
                : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/sucursales")
            }
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-azabache transition hover:border-latte hover:text-latte disabled:opacity-50"
          >
            <BackIcon />
            Cancelar
          </button>
        </section>
      </form>
    </main>
  );
}