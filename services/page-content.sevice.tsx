import { apiRequest } from "./api";
export enum sectionKeys {
    HOME_HERO_SLIDER='HOME_HERO_SLIDER'
}
export interface slidesContent {
    _id:string;
    title: string;
    subtitle: string;
    imageUrl: string;
    productId?: string | null;
    order: number;
    isActive: boolean;
    file: File
}

export interface pageContent {
    _id:string;
    sectionKey: sectionKeys;
    slides: slidesContent[];
}

export async function getSlider(): Promise<pageContent> {
    return apiRequest<pageContent>('/page-content/hero-slider');
}

export async function addToSlider(slideDto: slidesContent): Promise<object> {

  const formData = new FormData();
   formData.append("title", slideDto.title);
  formData.append("subtitle", slideDto.subtitle);
  formData.append("order", String(slideDto.order));
  formData.append("isActive", String(slideDto.isActive));

  if (slideDto.productId) {
    formData.append("productId", slideDto.productId);
  }


  formData.append("file", slideDto.file, slideDto.file.name);

  // Depuración temporal
  for (const [key, value] of formData.entries()) {
    console.log(
      key,
      value instanceof File
        ? {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        : value,
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/page-content/HOME_HERO_SLIDER/upload-slide`,
    {
      method: "POST",
      credentials: "include",
      body: formData
    }
  )

  const result = await response.json();

    if (!response.ok) {
      throw new Error(
        Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message || "No se pudo crear el producto.",
      );
    }

    return result;

}


export async function deleteSlide(slideId: string){
  return apiRequest<any>(`/page-content/HOME_HERO_SLIDER/slide/${slideId}`, {
    method: "DELETE"
  })
}