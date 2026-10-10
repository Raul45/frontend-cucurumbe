"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images.jpg",
    alt: "Café - imagen 1",
  },
  {
    src: "/images1.jpg",
    alt: "Café - imagen 2",
  },
];

const slidesImages = []; 

export default function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => setCurrent(index);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-black/5 shadow-sm dark:border-white/10">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[280px] w-full flex-shrink-0 sm:h-[420px] lg:h-[520px]">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-azabache/60 to-azabache/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                Café de calidad, sabor único
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
                Disfruta de nuestros productos de café seleccionados con mucho
                cariño.
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-azabache shadow transition hover:bg-white"
        aria-label="Anterior"
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
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-azabache shadow transition hover:bg-white"
        aria-label="Siguiente"
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
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition ${
              current === index
                ? "bg-latte"
                : "bg-white/60 hover:bg-white"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
