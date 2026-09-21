export type CreateOrderRequest = {
    cartId: string;
    customerName: string;
    customerEmail: string;
    shippingAddress?: string;
}
export type UpdateOrderRequest = {
    status?: string;
    shippingAddress?: string;
}
export type OrderFilterQuery = {
    status?: string;
    customerEmail?: string;
}
