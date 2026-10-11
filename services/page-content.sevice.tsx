import { apiRequest } from "./api";
export enum sectionKeys {
    HOME_HERO_SLIDER='HOME_HERO_SLIDER'
}
export interface slidesContent {
    _id:string;
    title: string;
    subtitle: string;
    imageUrl: string;
    productId?: string;
    order: number;
    isActive: boolean;
}

export interface pageContent {
    sectionKey: sectionKeys;
    slides?: slidesContent[];
}

export async function getSlider(): Promise<pageContent> {
    return apiRequest<pageContent>('/page-content/hero-slider');
}