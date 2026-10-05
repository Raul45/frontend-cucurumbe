"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    celular: "",
    comentario: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario de contacto enviado:", formData);
    setEnviado(true);
    setFormData({ nombre: "", correo: "", celular: "", comentario: "" });
    setTimeout(() => setEnviado(false), 5000);
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
            htmlFor="nombre"
            className="block text-sm font-medium text-azabache"
          >
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-azabache shadow-sm transition focus:border-latte focus:outline-none focus:ring-2 focus:ring-latte/30"
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label
            htmlFor="correo"
            className="block text-sm font-medium text-azabache"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            required
            value={formData.correo}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-azabache shadow-sm transition focus:border-latte focus:outline-none focus:ring-2 focus:ring-latte/30"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label
            htmlFor="celular"
            className="block text-sm font-medium text-azabache"
          >
            Celular
          </label>
          <input
            type="tel"
            id="celular"
            name="celular"
            required
            value={formData.celular}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-azabache shadow-sm transition focus:border-latte focus:outline-none focus:ring-2 focus:ring-latte/30"
            placeholder="618 000 0000"
          />
        </div>
        <div>
          <label
            htmlFor="comentario"
            className="block text-sm font-medium text-azabache"
          >
            Comentario
          </label>
          <textarea
            id="comentario"
            name="comentario"
            required
            rows={5}
            value={formData.comentario}
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
      </form>
    </div>
  );
}
