import { apiRequest } from "./api";

export interface ShipmentAddress {
    _id?:string;
    addressName: string;
    fullName: string;
    address: string;
    internalNumber?:string;
    externalNumber:string;
    references?:string;
    postalcode: number;
    city: string;
    state:string;
    cellphone:string;
}

export async function getMyShipmentsAddress() {
    return apiRequest<ShipmentAddress[]>('/shipment-address/me')
}

export async function saveShipmentAddress(createAddress: ShipmentAddress) {
    return apiRequest<object>('/shipment-address', {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(createAddress)
    })
}

export async function updateShipmentAddress(
    id:string,
    updateAddress: Partial<ShipmentAddress>) {
    return apiRequest<object>(`/shipment-address/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(updateAddress)
    })
}

export async function removeShipmentAddress(id:string) {
    return apiRequest<object>(`/shipment-address/${id}`, {
        method: "DELETE",
        credentials: "include"
    })
}