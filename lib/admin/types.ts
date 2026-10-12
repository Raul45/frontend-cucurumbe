export type LeadStatus = "pendiente" | "atendido";

export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen: string;
  descripcion: string;
};

export type Sucursal = {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
  imagen: string;
};

export type Lead = {
  id: string;
  nombre: string;
  correo: string;
  celular: string;
  comentario: string;
  status: LeadStatus;
  fecha: string;
};

export type VentaMes = { mes: string; ventas: number; pedidos: number };

export type VentaCategoria = { categoria: string; ventas: number };

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  pendiente: "PENDIENTE",
  atendido: "ATENDIDO",
};