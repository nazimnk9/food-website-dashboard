import { BASE_URL, getCookie } from './auth';
import { Product } from './productService';

export interface OrderAddress {
    id: number;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    created_at: string;
    updated_at: string;
    user: number | null;
}

export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: string;
    total_price: string;
}

export interface Order {
    id: number;
    user: number | null;
    status: string;
    total_amount: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
    address: OrderAddress | null;
    payment_type: string;
    cancelled_reason: string | null;
}

export interface OrdersResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Order[];
}

export const getOrders = async (page: number = 1): Promise<OrdersResponse> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/admin/orders/?page=${page}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
};

export const updateOrderStatus = async (id: number | string, status: string, cancelled_reason: string | null = null): Promise<Order> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status, cancelled_reason }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
};
