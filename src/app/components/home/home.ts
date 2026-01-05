import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Sushi, Box } from '../../models/sushi.model';
import { ApiService } from '../../services/api';
import { PanierService } from '../../services/panier';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  panierService = inject(PanierService);
  apiService = inject(ApiService);
  
  featuredBoxes = signal<Box[]>([]);

  //récupère les 3 boîtes les plus populaires depuis l'API
  ngOnInit() {
    this.apiService.getPopularBoxes().subscribe(data => {
      console.log('getPopularBoxes returned', data);
      this.featuredBoxes.set(data);
    }, err => {
      console.error('getPopularBoxes error', err);
    });
  }

  trackById(index: number, item: Box) { return item.id; }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    img.onerror = null;
    img.src = this.apiService.getImageUrl('amateur-mix');
  }
}
