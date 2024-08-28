interface Order {
    id?: string ,
    userId: string,
    total: string,
    paymentStatus: string,
    orderStatus: "Procesando" | "Enviando" | "Entregada" | "Cancelada",
    deliveryAddress: string,
    created_at: string,
    paymentMethod: string,
    contactName: string,
    contactPhone: string
}