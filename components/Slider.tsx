
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/admin/getImage";
import type { slidesContent } from "@/services/page-content.sevice";

interface SliderProps {
  slides: slidesContent[];
}

export default function Slider({ slides }: SliderProps) {
  const activeSlides = slides
    .filter((slide) => slide.isActive)
    .sort((a, b) => a.order - b.order);

  const [current, setCurrent] = useState(0);

  // Reiniciar el índice si cambia la cantidad de banners.
  useEffect(() => {
    setCurrent(0);
  }, [activeSlides.length]);

  // Cambiar de banner automáticamente cada 5 segundos.
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) {
    return null;
  }

  const prevSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-black/5 shadow-sm">
      {/* Contenedor de banners */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {activeSlides.map((slide, index) => {
          const content = (
            <>
              <Image
                src={getImageUrl(slide.imageUrl)}
                alt={slide.title}
                fill
                priority={index === 0}
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 90vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-azabache/70 to-azabache/10" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                  {slide.title}
                </h2>

                <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
                  {slide.subtitle}
                </p>
              </div>
            </>
          );

          return (
            <div
              key={slide._id}
              className="relative h-[280px] w-full shrink-0 sm:h-[420px] lg:h-[520px]"
            >
              {slide.productId ? (
                <Link
                  href={`/productos/${slide.productId}`}
                  className="absolute inset-0 block"
                  aria-label={`${slide.title}: ver producto`}
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>

      {/* Flechas de navegación */}
      {activeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Banner anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-azabache shadow transition hover:bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Banner siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-azabache shadow transition hover:bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {activeSlides.map((slide, index) => (
              <button
                key={slide._id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Ir al banner ${index + 1}`}
                aria-current={current === index ? "true" : undefined}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  current === index
                    ? "bg-latte"
                    : "bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
