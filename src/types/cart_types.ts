export interface CreateCartRequest {
    customerEmail?: string;
}


export interface AddCartItemRequest {
    productId: string;
    quantity: number;
}