import { apiRequest } from "./api";

export interface ProductImage {
  url: string;
  alt?: string;
  order: number;
}

export interface ProductOrigin {
  pais: string;
  estado?: string;
}

export interface ProductInventory {
  stock: number;
  grams: number;
  disponible: boolean;
}

export interface Product {
  _id: string;
  sku: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  currency: string;
  category: string;
  origin: ProductOrigin;
  inventary: ProductInventory;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export async function getProducts(): Promise<Product[]> {
  return apiRequest<Product[]>('/product')
};
export async function getProduct(id: string): Promise<Product> {
  return apiRequest<Product>(`/product/${id}`);
}

export async function createProduct(data: {
  name: string;
  sku: string;
  description: string;
  brand: string;
  price: number;
  currency: string;
  category: string;
  inventary: ProductInventory;
  origin: ProductOrigin;
  images: File[];
}): Promise<Product> {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("sku", data.sku);
  formData.append("description", data.description);
  formData.append("brand", data.brand);
  formData.append("price", String(data.price));
  formData.append("currency", data.currency);
  formData.append("category", data.category);

  formData.append("inventary", JSON.stringify(data.inventary));
  formData.append("origin", JSON.stringify(data.origin));

  data.images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

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

export async function updateProduct(
  id: string,
  data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imagesToDelete: string[];
    images: File[];
  },
): Promise<Product> {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", String(data.price));
  formData.append("stock", String(data.stock));

  formData.append(
    "imagesToDelete",
    JSON.stringify(data.imagesToDelete),
  );

  data.images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "No se pudo actualizar el producto.",
    );
  }

  return result;
}

export async function deleteProduct(id:string) {
  const response = await apiRequest<any>(`/product/${id}`,{
    method: "DELETE"
  });
  return response;
}