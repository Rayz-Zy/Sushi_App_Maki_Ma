import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanierProd } from '../../models/sushi.model';

@Component({
  selector: 'app-panier',
  imports: [CommonModule],
  templateUrl: './panier.html',
  styleUrls: ['./panier.css']
})
export class Panier {
  // Liste des éléments du panier (PanierProd contient `sushi` ou `box` + `quantity`)
  @Input() items: PanierProd[] = [];
  // Total calculé côté service (ou computed) et passé ici
  @Input() total: number = 0;
  // Remise étudiante
  @Input() studentDiscount: number = 0;
  // Remise bulk (5+ boxes)
  @Input() bulkDiscount: number = 0;
  // Total de toutes les remises
  @Input() discount: number = 0;
  // Total après remise
  @Input() finalTotal: number = 0;
  // Indique si le drawer est visible
  @Input() isOpen: boolean = false;
  // Indique si la limite de 10 boxes a été dépassée
  @Input() exceedsBoxLimit: boolean = false;
  
  // Événements émis vers le parent
  @Output() close = new EventEmitter<void>();
  @Output() increment = new EventEmitter<{ id: number; isBox: boolean }>();
  @Output() decrement = new EventEmitter<{ id: number; isBox: boolean }>();
  @Output() checkout = new EventEmitter<void>();

  // Helper pour obtenir le nom d'un item
  getItemName(item: PanierProd): string {
    return item.sushi?.name || item.box?.name || 'Produit inconnu';
  }

  // Helper pour obtenir l'ID d'un item et savoir si c'est une boîte
  getItemId(item: PanierProd): { id: number; isBox: boolean } {
    if (item.box) {
      return { id: item.box.id, isBox: true };
    }
    return { id: item.sushi?.id || 0, isBox: false };
  }

  // Helper pour obtenir le prix d'un item
  getItemPrice(item: PanierProd): number {
    return (item.sushi?.price || item.box?.price || 0) * item.quantity;
  }

  // Calcule le nombre total de boxes
  getTotalBoxes(): number {
    return this.items
      .filter(item => item.box !== undefined)
      .reduce((acc, item) => acc + item.quantity, 0);
  }
}
