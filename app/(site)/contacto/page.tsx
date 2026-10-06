"use client";

import { createLead, type Lead} from "@/services/leads.service";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactoPage() {
const router = useRouter();
const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useState<Lead>({
    fullname: "",
    email: "",
    cellphone: "",
    comment: ""
  });  const [enviado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir recarga de página

    try {
      // TypeScript valida que formData cumpla con CreateLeadInput
      const nuevoLead = await createLead(formData);
      
      console.log("Lead creado exitosamente:", nuevoLead);
      router.push("/admin/leads"); // Redirigir a la lista
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado"
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-azabache sm:text-4xl">
          Contacto
        </h1>
        <p className="mt-2 text-sm text-gris-pizarra sm:text-base">
          Escríbenos y te responderemos lo más pronto posible
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-azabache"
          >
            Nombre
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            required
            value={formData.fullname}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-azabache shadow-sm transition focus:border-latte focus:outline-none focus:ring-2 focus:ring-latte/30"
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-azabache"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-azabache shadow-sm transition focus:border-latte focus:outline-none focus:ring-2 focus:ring-latte/30"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label
            htmlFor="cellphone"
            className="block text-sm font-medium text-azabache"
          >
            Celular
          </label>
          <input
            type="tel"
            id="cellphone"
            name="cellphone"
            required
            value={formData.cellphone}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-azabache shadow-sm transition focus:border-latte focus:outline-none focus:ring-2 focus:ring-latte/30"
            placeholder="618 000 0000"
          />
        </div>
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-azabache"
          >
            Comentario
          </label>
          <textarea
            id="comment"
            name="comment"
            required
            rows={5}
            value={formData.comment}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-azabache shadow-sm transition focus:border-latte focus:outline-none focus:ring-2 focus:ring-latte/30"
            placeholder="Escríbenos tu mensaje..."
          />
        </div>
        {enviado && (
          <div className="rounded-lg bg-latte/10 p-3 text-sm text-latte">
            ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
          </div>
        )}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-latte px-6 py-2.5 text-sm font-medium text-blanco-roto shadow-sm transition hover:bg-latte/90 focus:outline-none focus:ring-2 focus:ring-latte/40"
        >
          Enviar mensaje
        </button>
         {error ? (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          ) : null}
      </form>
    </div>
  );
}
