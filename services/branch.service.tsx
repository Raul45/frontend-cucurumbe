import { apiRequest } from "./api";

export interface BranchImage {
  url: string;
  alt?: string;
  order: number;
}

export interface BranchAddress {
  street: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  references?: string;
}

export interface BranchLocation {
  mapaUrl:string;
}

export interface BranchContact {
  phone?: string;
  email?: string;
}

export interface BranchDaySchedule {
  open?: string;
  close?: string;
}

export interface BranchSchedule {
  monday?: BranchDaySchedule;
  tuesday?: BranchDaySchedule;
  wednesday?: BranchDaySchedule;
  thursday?: BranchDaySchedule;
  friday?: BranchDaySchedule;
  saturday?: BranchDaySchedule;
  sunday?: BranchDaySchedule;
}

export interface BranchServices {
  pickup?: boolean;
  delivery?: boolean;
  coffeeShop?: boolean;
  ecommerce?: boolean;
}

export type BranchStatus =
  | "active"
  | "inactive"
  | "temporarily_closed";

export interface Branch {
  _id:string;
  name: string;
  code: string;
  description?: string;
  address: BranchAddress;
  location: BranchLocation;
  contact?: BranchContact;
  schedule?: BranchSchedule;
  services?: BranchServices;
  status?: BranchStatus;
  images: BranchImage[];
}

export async function getBranches(): Promise<Branch[]> {
  return apiRequest<Branch[]>("/branch");
}

export async function createBranch(data: {
  name: string,
  code: string,
  description:string,
  address: BranchAddress,
  location: BranchLocation,
  contact: BranchContact,
  schedule: BranchSchedule,
  services: BranchServices,
  status: BranchStatus,
  images: File[]
}
): Promise<Branch>{
  console.log('=========Create Branch');
  const formData = new FormData();
  formData.append("name",data.name);
  formData.append("code",data.code);
  formData.append("description",data.description);
  formData.append("address",JSON.stringify(data.address));
  formData.append("location",JSON.stringify(data.location));
  formData.append("contact",JSON.stringify(data.contact));
  formData.append("schedule",JSON.stringify(data.schedule));
  formData.append("services",JSON.stringify(data.services));
  formData.append("status",data.status);
  
  console.log(data.images);
  data.images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/branch`,
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

export async function getBranch(id:string): Promise<Branch> {
  return apiRequest<Branch>(`/branch/${id}`);
}

export async function updateBranch(
  id:string,
  data: {
    name: string,
    code: string,
    description:string,
    address: BranchAddress,
    location: BranchLocation,
    contact: BranchContact,
    schedule: BranchSchedule,
    services: BranchServices,
    status: BranchStatus,
    imagesToDelete: string[];
    images: File[]
  }
) {
  const formData = new FormData();
  formData.append("name",data.name);
  formData.append("code",data.code);
  formData.append("description",data.description);
  formData.append("address",JSON.stringify(data.address));
  formData.append("location",JSON.stringify(data.location));
  formData.append("contact",JSON.stringify(data.contact));
  formData.append("schedule",JSON.stringify(data.schedule));
  formData.append("services",JSON.stringify(data.services));
  formData.append("status",data.status);
  
  formData.append(
      "imagesToDelete",
      JSON.stringify(data.imagesToDelete),
    );


  data.images.forEach((file) => {
    formData.append("images", file);
  });

console.log(Object.fromEntries(formData));
const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/branch/${id}`,
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

export async function deleteBranch(id:string){
  return apiRequest<any>(`/branch/${id}`, {
    method: "DELETE"
  });
}