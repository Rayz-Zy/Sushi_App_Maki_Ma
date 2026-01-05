import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface StatistiquesReponse {
  success: boolean;
  statistiques_mensuelles: StatistiqueMois[];
  statistiques_totales: StatistiquesTotales;
  boxes_populaires: BoxPopulaire[];
  top_users?: TopUser[];
  stats_par_statut?: StatParStatut[];
}

export interface StatistiqueMois {
  mois: string;
  nombre_commandes: number;
  total_depense: string;
}

export interface StatistiquesTotales {
  total_commandes: number;
  total_depense: string;
  depense_moyenne: string;
  commande_max: string;
  commande_min: string;
  nombre_utilisateurs?: number;
}

export interface BoxPopulaire {
  id: number;
  name: string;
  nombre_commandes: number;
  revenue_total?: string;
}

export interface TopUser {
  id: number;
  name: string;
  email: string;
  nombre_commandes: number;
  total_depense: string;
}

export interface StatParStatut {
  statut: string;
  nombre_utilisateurs: number;
  nombre_commandes: number;
  total_depense: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/sushi-api';

  getStatistiques(): Observable<StatistiquesReponse> {
    return this.http.get<StatistiquesReponse>(
      `${this.apiUrl}/statistics.php`
    ).pipe(
      catchError(err => {
        console.error('API getStatistiques failed', err);
        return of({
          success: false,
          statistiques_mensuelles: [],
          statistiques_totales: {
            total_commandes: 0,
            total_depense: '0',
            depense_moyenne: '0',
            commande_max: '0',
            commande_min: '0'
          },
          boxes_populaires: []
        } as StatistiquesReponse);
      })
    );
  }
}
