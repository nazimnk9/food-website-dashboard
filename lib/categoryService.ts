import { BASE_URL, getCookie } from './auth';

export interface Category {
    id: number;
    title: string;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface CategoryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Category[];
}

export async function getCategories(): Promise<CategoryResponse> {
    const response = await fetch(`${BASE_URL}/menu/category/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}

export async function createCategory(formData: FormData): Promise<Category> {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/category/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw result;
    }

    return result;
}

export async function updateCategory(id: number, formData: FormData): Promise<Category> {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/category/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw result;
    }

    return result;
}

export async function deleteCategory(id: number): Promise<void> {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/category/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }
}
