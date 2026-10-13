import { apiRequest } from "./api";

export interface CartItem {
    productId:string;
    variantId:string;
    quantity: number;
}
export interface Cart {
  userId:string;
  guestSessionId?:string;
  items: CartItem[]
}


export async function getMyCart() {
    return apiRequest<Cart[]>('/cart/my-cart')
}

export async function saveMyCart(cart: Cart) {
    return apiRequest<object>('/cart', {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(cart)
    })
}