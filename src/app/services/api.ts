import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Sushi, Box } from '../models/sushi.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // HttpClient injecté via la nouvelle API standalone
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/sushi-api';

  // Récupère les boîtes avec tous les détails
  getBoxes(): Observable<Box[]> {
    return this.http.get<Box[]>(this.apiUrl + '/boxes.php').pipe(
      catchError(err => {
        console.error('API getBoxes failed', err);
        return of([]);
      })
    );
  }

  // Récupère les boîtes les plus populaires
  getPopularBoxes(): Observable<Box[]> {
    return this.http.get<Box[]>(this.apiUrl + '/popular-boxes.php').pipe(
      catchError(err => {
        console.error('API getPopularBoxes failed', err);
        return of([]);
      })
    );
  }

  // Construit l'URL d'une image côté serveur
  getImageUrl(imageName: string | undefined | null, ext = 'jpg'): string {
    if (!imageName) return this.apiUrl + '/images/amateur-mix.jpg';
    return `${this.apiUrl}/images/${imageName}.${ext}`;
  }

  placeOrder(order: any): Observable<any> {
    return this.http.post(this.apiUrl + '/order.php', order).pipe(
      catchError(err => {
        console.error('API placeOrder failed', err);
        return of({ success: false, message: err.error?.message || 'Erreur lors de la commande' });
      })
    );
  }
}
