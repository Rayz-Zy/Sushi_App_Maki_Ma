import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Box } from '../../models/sushi.model';
import { ApiService } from '../../services/api';
import { PanierService } from '../../services/panier';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css'
})
export class CatalogueComponent implements OnInit {
  // Services utilisés
  panierService = inject(PanierService);
  apiService = inject(ApiService);
  
  // Signal pour les boîtes
  boxes = signal<Box[]>([]);
  
  // Signal pour le tri
  sortBy = signal<'name' | 'price' | 'pieces'>('name');
  sortOrder = signal<'asc' | 'desc'>('asc');
  
  // Signal pour la boîte sélectionnée dans la modale
  selectedBox = signal<Box | null>(null);
  
  // Signal pour la quantité dans la modale
  modalQuantity = signal<number>(1);

  // Computed pour les boîtes triées
  sortedBoxes = computed(() => {
    const allBoxes = [...this.boxes()];
    const sortByVal = this.sortBy();
    const orderVal = this.sortOrder();
    
    allBoxes.sort((a, b) => {
      let compareValue = 0;
      
      if (sortByVal === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortByVal === 'price') {
        compareValue = a.price - b.price;
      } else if (sortByVal === 'pieces') {
        compareValue = a.pieces - b.pieces;
      }
      
      return orderVal === 'asc' ? compareValue : -compareValue;
    });
    
    return allBoxes;
  });

  // Exposer Math pour l'utiliser dans le template
  Math = Math;

  //récupère la liste des boîtes depuis l'API
  ngOnInit() {
    this.apiService.getBoxes().subscribe(data => {
      console.log('getBoxes returned', data);
      this.boxes.set(data);
    }, err => {
      console.error('getBoxes error', err);
    });
  }

  // Ouvre la modale pour une boîte
  openModal(box: Box) {
    this.selectedBox.set(box);
    this.modalQuantity.set(1);
    document.body.style.overflow = 'hidden';
  }

  // Ferme la modale
  closeModal() {
    this.selectedBox.set(null);
    this.modalQuantity.set(1);
    document.body.style.overflow = 'auto';
  }

  // Ajoute au panier depuis la modale
  addToCartFromModal() {
    const box = this.selectedBox();
    if (box) {
      for (let i = 0; i < this.modalQuantity(); i++) {
        this.panierService.addBox(box);
      }
      this.closeModal();
    }
  }

  trackById(index: number, box: Box) { return box.id; }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    img.onerror = null;
    img.src = this.apiService.getImageUrl('amateur-mix');
  }

  // Change le critère de tri
  changeSortBy(criteria: 'name' | 'price' | 'pieces') {
    if (this.sortBy() === criteria) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(criteria);
      this.sortOrder.set('asc');
    }
  }
}

