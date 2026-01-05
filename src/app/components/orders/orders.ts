import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanierService } from '../../services/panier';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent {
  panier = inject(PanierService);
  orders: any[] = [];
  expandedOrderId: any = null;

  constructor() {
    this.load();
  }

  load() {
    this.orders = this.panier.getOrders();
  }

  // Supprime toutes les commandes locales
  clearOrders() {
    try {
      localStorage.removeItem('sushi_orders');
      this.load();
    } catch (e) {
      console.warn('Impossible de supprimer les commandes', e);
    }
  }

  // Affiche/masque les détails inline d'une commande
  toggleDetails(order: any) {
    this.expandedOrderId = this.expandedOrderId === order.orderId ? null : order.orderId;
  }
}
