import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { AuthentificationService } from './services/authentification';
import { ApiService } from './services/api';
import { Panier } from "./components/panier/panier";
import { PanierService } from './services/panier';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, Panier, FooterComponent],
  templateUrl: './app.html'
})
export class AppComponent {

  panierService = inject(PanierService);
  apiService = inject(ApiService);
  authService = inject(AuthentificationService);
  router = inject(Router);

  constructor() {
    // Initialiser le statut utilisateur au démarrage
    this.panierService.setUserStatus(this.authService.currentUser()?.statut);
    
    // Valider la session au démarrage si un utilisateur est connecté
    if (this.authService.currentUser()) {
      this.authService.validateSession(this.authService.currentUser()!).subscribe({
        error: (err) => {
          console.warn('Erreur de validation de session:', err);
          // La session n'est pas valide, logout automatique via le service
        }
      });
    }
    
    // Mettre à jour le statut utilisateur dans le service panier quand l'utilisateur change
    effect(() => {
      const user = this.authService.currentUser();
      this.panierService.setUserStatus(user?.statut);
    });
  }

  goHome() {
    this.router.navigate(['/']);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCheckout() {
    // Vérifier que l'utilisateur est connecté
    const user = this.authService.currentUser();
    if (!user) {
      alert('Vous devez être connecté pour commander');
      this.router.navigate(['/login']);
      return;
    }

    const orderData = {
      userId: user.id || null,
      items: this.panierService.items(),
      finalTotal: this.panierService.finalTotal()
    };

    if (orderData.items.length === 0) return;

    this.apiService.placeOrder(orderData).subscribe({
      next: (response: any) => {
        // Vérifier si la réponse indique un succès
        if (response.success !== false && response.orderId) {
          alert(`Commande validée ! Numéro: ${response.orderId} - Total: ${response.serverTotal}€`);
          // Sauvegarde côté client de la commande
          const localOrder = {
            orderId: response.orderId,
            serverTotal: response.serverTotal,
            finalTotal: this.panierService.finalTotal(),
            items: this.panierService.items(),
            date: new Date().toISOString(),
            userId: orderData.userId || null
          };
          this.panierService.saveOrder(localOrder);

          this.panierService.clear();
          this.panierService.isOpen.set(false);
        } else {
          alert(response.message || "Erreur lors de la commande");
        }
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la commande. Vérifiez que le serveur PHP tourne.");
      }
    });
  }

}