import { BASE_URL, getCookie } from './auth';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password?: string;
    role: 'ADMIN' | 'MANAGER' | 'STAFF' | null;
}

export interface UsersResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
}

export const getUsers = async (page: number = 1): Promise<UsersResponse> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/admin/users/?page=${page}`, {
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

export const createUser = async (userData: Partial<User>): Promise<User> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/admin/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }
};
