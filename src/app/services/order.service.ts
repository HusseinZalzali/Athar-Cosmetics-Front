import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product?: any;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total: number;
  payment_method: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_city: string;
  shipping_street: string;
  shipping_notes?: string;
  items: OrderItem[];
  created_at: string;
}

export interface CreateOrderRequest {
  items: Array<{ product_id: number; quantity: number }>;
  shipping: {
    name: string;
    phone: string;
    city: string;
    street: string;
    notes?: string;
  };
  payment_method: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(order: CreateOrderRequest): Observable<{ success: boolean; data: Order; message?: string }> {
    return this.http.post<{ success: boolean; data: Order; message?: string }>(this.apiUrl, order);
  }

  getMyOrders(): Observable<{ success: boolean; data: Order[] }> {
    return this.http.get<{ success: boolean; data: Order[] }>(`${this.apiUrl}/my`);
  }

  getAllOrders(): Observable<{ success: boolean; data: Order[] }> {
    return this.http.get<{ success: boolean; data: Order[] }>(this.apiUrl);
  }

  updateOrderStatus(orderId: number, status: string): Observable<{ success: boolean; data: Order; message?: string }> {
    return this.http.put<{ success: boolean; data: Order; message?: string }>(
      `${this.apiUrl}/${orderId}/status`,
      { status }
    );
  }
}




