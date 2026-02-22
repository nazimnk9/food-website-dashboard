//const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { BASE_URL, getCookie } from './auth';
export interface Category {
    id: number;
    title: string;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id: number;
    image: string;
    created_at: string;
    updated_at: string;
}

import { Tag } from './tagService';
export interface Product {
    id: number;
    category: Category[];
    images: ProductImage[];
    tags: Tag[];
    title: string;
    price: string;
    description: string;
    is_popular: boolean;
    created_at: string;
    updated_at: string;
    status: string;
}

export interface ProductsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
}

export interface CreateProductData {
    title: string;
    price: string | number | null;
    description: string;
    is_popular: boolean;
    images_ids?: number[];
    category_ids?: number[];
    tags_ids?: number[];
    status?: string | null;
}

export const getProducts = async (page: number = 1): Promise<ProductsResponse> => {
    const response = await fetch(`${BASE_URL}/menu/products/?page=${page}`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

export const createProduct = async (data: CreateProductData): Promise<Product> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/products/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
};

export interface ImageUploadResponse {
    id: number;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface ImagesListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ImageUploadResponse[];
}

export const uploadProductImage = async (file: File): Promise<ImageUploadResponse> => {
    const accessToken = getCookie('access_token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BASE_URL}/menu/images/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
};

export const deleteProductImage = async (id: number): Promise<void> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/images/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }
};

export const getProductImages = async (): Promise<ImagesListResponse> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/images/`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
};

export const getProductById = async (id: number | string): Promise<Product> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/products/${id}`, {
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
};
export const updateProduct = async (id: number | string, data: CreateProductData): Promise<Product> => {
    const accessToken = getCookie('access_token');
    const response = await fetch(`${BASE_URL}/menu/products/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
};
