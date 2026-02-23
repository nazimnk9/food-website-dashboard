import { BASE_URL, getCookie } from '../auth';

export interface DashboardStats {
    total_revenue: number;
    total_orders: number;
    active_menu: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/dashboard`, {
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

export const getMe = async () => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/me/`, {
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

export interface OrderItem {
    id: number;
    product: {
        title: string;
        price: string;
    };
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
}

export interface OrdersResponse {
    count: number;
    results: Order[];
}

export const getRecentOrders = async (page: number = 1): Promise<OrdersResponse> => {
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
