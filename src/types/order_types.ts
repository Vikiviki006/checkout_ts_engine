export interface CreateOrderRequest {
    cartId: string;
    customerName: string;
    customerEmail: string;
    shippingAddress?: string;
}
export interface UpdateOrderRequest {
    status?: string;
    shippingAddress?: string;
}