
"use client";

import { getImageUrl } from "@/lib/admin/getImage";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductImage {
  url: string;
}

interface ProductImageSliderProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageSlider({
  images,
  productName,
}: ProductImageSliderProps) {
  const [current, setCurrent] = useState(0);

  const total = images.length;

  useEffect(() => {
    setCurrent(0);

    if (total <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(interval);
  }, [total]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  if (total === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gray-100 text-gris-pizarra">
        Sin imágenes disponibles
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-black/5 shadow-sm">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="relative aspect-[4/3] w-full shrink-0"
          >
            <Image
              src={getImageUrl(image.url)}
              alt={`${productName} - imagen ${index + 1}`}
              fill
              priority={index === 0}
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-azabache shadow hover:bg-white"
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
            aria-label="Imagen siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-azabache shadow hover:bg-white"
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
            {images.map((image, index) => (
              <button
                key={`${image.url}-dot-${index}`}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={current === index ? "true" : undefined}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  current === index
                    ? "bg-latte"
                    : "bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
