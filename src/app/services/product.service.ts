import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
  name_en: string;
  name_ar: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt_text?: string;
}

export interface Product {
  id: number;
  name: string;
  name_en: string;
  name_ar: string;
  description: string;
  description_en: string;
  description_ar: string;
  price: number;
  stock: number;
  sku: string;
  category_id: number;
  category?: Category;
  ingredients?: string;
  ingredients_en?: string;
  ingredients_ar?: string;
  usage?: string;
  usage_en?: string;
  usage_ar?: string;
  is_featured: boolean;
  images: ProductImage[];
  created_at?: string;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  message?: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this.http.get<{ success: boolean; data: Category[] }>(`${this.apiUrl}/categories`, {
      params: { lang: 'en' }
    });
  }

  getProducts(params?: {
    search?: string;
    category?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    featured?: boolean;
  }): Observable<ProductListResponse> {
    let httpParams = new HttpParams().set('lang', 'en');
    
    if (params) {
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.category) httpParams = httpParams.set('category', params.category.toString());
      if (params.minPrice) httpParams = httpParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
      if (params.featured) httpParams = httpParams.set('featured', 'true');
    }

    return this.http.get<ProductListResponse>(`${this.apiUrl}/products`, { params: httpParams });
  }

  getProduct(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/${id}`, {
      params: { lang: 'en' }
    });
  }

  createProduct(product: Partial<Product>): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.apiUrl}/products`, product, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateProduct(id: number, product: Partial<Product>): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiUrl}/products/${id}`);
  }

  uploadProductImage(productId: number, file: File, altText?: string): Observable<{ success: boolean; data: ProductImage }> {
    const formData = new FormData();
    formData.append('image', file);
    if (altText) formData.append('alt_text', altText);
    
    return this.http.post<{ success: boolean; data: ProductImage }>(
      `${this.apiUrl}/products/${productId}/images`,
      formData
    );
  }

  deleteProductImage(productId: number, imageId: number): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(
      `${this.apiUrl}/products/${productId}/images/${imageId}`
    );
  }
}

