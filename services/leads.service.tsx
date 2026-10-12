import { apiRequest } from "./api";
export type LeadStatus = "PENDIENTE" | "ATENDIDO";

export interface Lead {
    _id?:string;
    fullname: string;
    cellphone:string;
    email:string;
    comment:string;
    status?: LeadStatus
}

export async function getLeads() {
    return apiRequest<Lead[]>('/leads')
}

export async function getLead(id:string) {
    return apiRequest<Lead>(`/leads/${id}`);
}

export async function updateLeadStatus(id:string ,data: {status: LeadStatus}) {
    console.log(data, 1999);
    return apiRequest<Lead>(`/leads/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(data)
    })
}

export async function createLead(lead: Lead) {
    console.log(lead);
    return apiRequest<Lead>('/leads', {
        method: "POST",
        body: JSON.stringify(lead)
    })
}