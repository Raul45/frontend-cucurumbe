import { useEffect, useState } from "react";

export interface ExistingImage {
  url: string;
  alt?: string;
  order: number;
  _id?: string;
}

export function useImageManager(
  initialImages: ExistingImage[] = [],
) {
  const [existingImages, setExistingImages] =
    useState<ExistingImage[]>(initialImages);

  const [newImages, setNewImages] = useState<File[]>([]);

  const [previews, setPreviews] = useState<string[]>([]);

  const [imagesToDelete, setImagesToDelete] =
    useState<string[]>([]);

  /*
   * Cuando cargamos una entidad desde el backend
   */
  function setInitialImages(images: ExistingImage[]) {
    setExistingImages(
      [...images].sort(
        (a, b) => a.order - b.order,
      ),
    );
  }

  /*
   * Seleccionar nuevas imágenes
   */
  function handleFilesChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const selectedFiles = Array.from(files);

    setNewImages((prev) => [
      ...prev,
      ...selectedFiles,
    ]);

    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setPreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    event.target.value = "";
  }

  /*
   * Eliminar imagen existente
   */
  function removeExistingImage(url: string) {
    setExistingImages((prev) =>
      prev.filter((image) => image.url !== url),
    );

    setImagesToDelete((prev) => {
      if (prev.includes(url)) {
        return prev;
      }

      return [...prev, url];
    });
  }

  /*
   * Eliminar imagen nueva
   */
  function removeNewImage(index: number) {
    const preview = previews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setNewImages((prev) =>
      prev.filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    );

    setPreviews((prev) =>
      prev.filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    );
  }

  /*
   * Limpiar imágenes nuevas
   */
  function clearImages() {
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setNewImages([]);
    setPreviews([]);
    setImagesToDelete([]);
  }

  /*
   * Liberar Object URLs
   */
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  return {
    existingImages,
    newImages,
    previews,
    imagesToDelete,
    setExistingImages,
    setInitialImages,
    setNewImages,
    setPreviews,
    handleFilesChange,
    removeExistingImage,
    removeNewImage,
    clearImages,
  };
}