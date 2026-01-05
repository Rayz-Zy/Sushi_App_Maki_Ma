import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { StatisticsService } from '../../services/statistics';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css'
})
export class StatisticsComponent implements OnInit, OnDestroy {
  private statisticsService = inject(StatisticsService);

  @ViewChild('chartCommandes', { static: false }) chartCommandesRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartDepense', { static: false }) chartDepenseRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartBoxes', { static: false }) chartBoxesRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartStatut', { static: false }) chartStatutRef?: ElementRef<HTMLCanvasElement>;

  charts: Chart[] = [];

  statistiquesTotales: any = null;
  boxesPopulaires: any[] = [];
  topUsers: any[] = [];
  statsParStatut: any[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.statisticsService.getStatistiques().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.statistiquesTotales = response.statistiques_totales;
          this.boxesPopulaires = response.boxes_populaires;
          this.topUsers = response.top_users;
          this.statsParStatut = response.stats_par_statut;
          
          // Initialiser les graphiques après le rendu
          setTimeout(() => {
            this.initCharts(response.statistiques_mensuelles, response.boxes_populaires, response.stats_par_statut);
          }, 100);
        } else {
          this.error = 'Erreur lors du chargement des statistiques';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Erreur de connexion au serveur';
        this.loading = false;
      }
    });
  }

  private initCharts(statistiques_mensuelles: any[], boxes: any[], statsStatut: any[]) {
    // Nettoyez les anciens graphiques
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    const mois = statistiques_mensuelles.map(s => this.formatMois(s.mois));
    const commandes = statistiques_mensuelles.map(s => parseInt(s.nombre_commandes));
    const depenses = statistiques_mensuelles.map(s => parseFloat(s.total_depense));

    // Graphique 1: Nombre de commandes par mois
    if (this.chartCommandesRef) {
      const ctx1 = this.chartCommandesRef.nativeElement.getContext('2d');
      if (ctx1) {
        const chart1 = new Chart(ctx1, {
          type: 'line',
          data: {
            labels: mois,
            datasets: [{
              label: 'Nombre de commandes',
              data: commandes,
              borderColor: '#ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 5,
              pointBackgroundColor: '#ff6b6b',
              pointBorderColor: '#fff',
              pointBorderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { color: '#000', font: { size: 12 } }
              },
              title: {
                display: true,
                text: 'Nombre de commandes par mois',
                color: '#000'
              }
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                beginAtZero: true,
                ticks: { color: '#000' },
                grid: { color: '#e0e0e0' }
              },
              x: {
                ticks: { color: '#000' },
                grid: { color: '#e0e0e0' }
              }
            }
          }
        } as ChartConfiguration);
        this.charts.push(chart1);
      }
    }

    // Graphique 2: Top boxes
    if (this.chartBoxesRef && boxes.length > 0) {
      const ctx3 = this.chartBoxesRef.nativeElement.getContext('2d');
      if (ctx3) {
        const boxNames = boxes.map(b => b.name);
        const boxCount = boxes.map(b => b.nombre_commandes);
        const colors = [
          '#ff6b6b',
          '#4ecdc4',
          '#45b7d1',
          '#f9ca24',
          '#6c5ce7',
          '#a29bfe',
          '#fd79a8',
          '#fdcb6e',
          '#6c5ce7',
          '#00b894'
        ];

        const chart3 = new Chart(ctx3, {
          type: 'doughnut',
          data: {
            labels: boxNames,
            datasets: [{
              data: boxCount,
              backgroundColor: colors.slice(0, boxes.length),
              borderColor: '#fff',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: 'right',
                labels: { color: '#000', font: { size: 12 } }
              },
              title: {
                display: true,
                text: 'Top 10 des boxes les plus commandées',
                color: '#000'
              }
            }
          }
        } as ChartConfiguration);
        this.charts.push(chart3);
      }
    }

    // Graphique 3: Statistiques par statut
    if (this.chartStatutRef && statsStatut.length > 0) {
      const ctx4 = this.chartStatutRef.nativeElement.getContext('2d');
      if (ctx4) {
        const statuts = statsStatut.map(s => s.statut || 'Non défini');
        const nbCommandes = statsStatut.map(s => s.nombre_commandes);
        
        const chart4 = new Chart(ctx4, {
          type: 'bar',
          data: {
            labels: statuts,
            datasets: [{
              label: 'Nombre de commandes',
              data: nbCommandes,
              backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
              borderColor: '#fff',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { color: '#000', font: { size: 12 } }
              },
              title: {
                display: true,
                text: 'Commandes par statut utilisateur',
                color: '#000'
              }
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                beginAtZero: true,
                ticks: { color: '#000' },
                grid: { color: '#e0e0e0' }
              },
              x: {
                ticks: { color: '#000' },
                grid: { color: '#e0e0e0' }
              }
            }
          }
        } as ChartConfiguration);
        this.charts.push(chart4);
      }
    }
  }

  private formatMois(mois: string): string {
    const months: { [key: string]: string } = {
      '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
      '05': 'Mai', '06': 'Juin', '07': 'Juil', '08': 'Août',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc'
    };
    const [year, month] = mois.split('-');
    return `${months[month]} ${year}`;
  }

  getTotalCommandes(): number {
    return this.statistiquesTotales ? parseInt(this.statistiquesTotales.total_commandes.toString()) : 0;
  }

  getTotalDepense(): string {
    return this.statistiquesTotales ? parseFloat(this.statistiquesTotales.total_depense).toFixed(2) : '0.00';
  }

  getDepenseMoyenne(): string {
    return this.statistiquesTotales ? parseFloat(this.statistiquesTotales.depense_moyenne).toFixed(2) : '0.00';
  }

  getNombreUtilisateurs(): number {
    return this.statistiquesTotales ? parseInt(this.statistiquesTotales.nombre_utilisateurs.toString()) : 0;
  }

  ngOnDestroy() {
    this.charts.forEach(chart => chart.destroy());
  }
}
