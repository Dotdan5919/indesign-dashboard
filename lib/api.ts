export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const PRODUCTS_ENDPOINT = `${API_URL}/products`;

export type ProductImage = {
  url: string;
  alt?: string;
  isPrimary?: boolean;
};

export type Product = {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive" | "draft" | "discontinued";
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(PRODUCTS_ENDPOINT, { 
    cache: "no-store",
    credentials: "include"
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Authentication required. Please log in.");
    }
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${PRODUCTS_ENDPOINT}/delete/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Authentication required. Please log in.");
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Failed to delete product`);
  }
}

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  status?: "active" | "inactive" | "draft" | "discontinued";
};

export async function updateProduct(
  id: string,
  data: UpdateProductPayload,
  images?: File[]
): Promise<Product> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (images && images.length > 0) {
    images.forEach((file) => formData.append("images", file));
  }

  const res = await fetch(`${PRODUCTS_ENDPOINT}/update/${id}`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Authentication required. Please log in.");
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Failed to update product`);
  }
  const result = await res.json();
  return result.product as Product;
}

export type CreateProductPayload = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status?: "active" | "inactive" | "draft" | "discontinued";
};

export async function createProduct(
  data: CreateProductPayload,
  images: File[]
): Promise<Product> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  images.forEach((file) => formData.append("images", file));

  const res = await fetch(PRODUCTS_ENDPOINT, {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Authentication required. Please log in.");
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Failed to create product`);
  }
  const result = await res.json();
  return result.product as Product;
}

export function getProductPrimaryImageUrl(product: Product): string | null {
  const primary = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  if (!primary?.url) return null;
  // Backend stores filename; assume static is served from /uploads/products
  return `${API_URL}/uploads/products/${primary.url}`;
}


