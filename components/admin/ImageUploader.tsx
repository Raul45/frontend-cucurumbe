"use client";

import { getImageUrl } from "@/lib/admin/getImage";
import Image from "next/image";

export interface ExistingImage {
  url: string;
  alt?: string;
  order: number;
  _id?: string;
}

interface ImageUploaderProps {
  existingImages: ExistingImage[];
  previews: string[];
  onFilesChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveExisting: (url: string) => void;
  onRemoveNew: (index: number) => void;
}

export default function ImageUploader({
  existingImages,
  previews,
  onFilesChange,
  onRemoveExisting,
  onRemoveNew,
}: ImageUploaderProps) {
  return (
    <div className="space-y-4">
      <label
        htmlFor="image-upload"
        className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-black/20 px-4 py-6 text-sm text-gris-pizarra transition hover:border-latte hover:text-latte"
      >
        Seleccionar imágenes
      </label>

      <input
        id="image-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onFilesChange}
        className="sr-only"
      />

      {(existingImages.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {/* Imágenes existentes */}
          {existingImages.map((image) => (
            <div
              key={image.url}
              className="relative overflow-hidden rounded-xl border"
            >
              <Image
                src={getImageUrl(image.url)}
                alt={image.alt ?? "Imagen"}
                width={300}
                height={300}
                className="aspect-square w-full object-cover"
              />

              <button
                type="button"
                onClick={() => onRemoveExisting(image.url)}
                className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
              >
                Eliminar
              </button>
            </div>
          ))}

          {/* Imágenes nuevas */}
          {previews.map((preview, index) => (
            <div
              key={preview}
              className="relative overflow-hidden rounded-xl border"
            >
              <Image
                src={preview}
                alt={`Nueva imagen ${index + 1}`}
                width={300}
                height={300}
                className="aspect-square w-full object-cover"
              />

              <button
                type="button"
                onClick={() => onRemoveNew(index)}
                className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}