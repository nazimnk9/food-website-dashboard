import { BASE_URL, getCookie } from './auth';

export interface Transaction {
    id: number;
    stripe_session_id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    updated_at: string;
    cart_ids: number[];
    user: number | null;
    guest_user: number | null;
    order: number | null;
}

export interface TransactionsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Transaction[];
}

export const getTransactions = async (page: number = 1): Promise<TransactionsResponse> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/admin/transactions/?page=${page}`, {
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

export const getTransactionById = async (id: number | string): Promise<Transaction> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/admin/transactions/${id}`, {
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
