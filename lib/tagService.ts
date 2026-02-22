import { BASE_URL, getCookie } from './auth';

export interface Tag {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface TagResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Tag[];
}

export async function getTags(): Promise<TagResponse> {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/tags/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}

export async function createTag(title: string): Promise<Tag> {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/tags/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}

export async function updateTag(id: number, title: string): Promise<Tag> {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/tags/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}

export async function deleteTag(id: number): Promise<void> {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/tags/${id}`, {
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
