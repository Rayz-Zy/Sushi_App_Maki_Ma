import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  http = inject(HttpClient);
  router = inject(Router);

  private apiUrl = 'http://localhost/sushi-api';

  currentUser = signal<User | null>(this.getUserFromStorage());

  // Tente une connexion via l'API. Si succès, sauvegarde l'utilisateur et navigue vers l'accueil
  login(email: string, pass: string) {
    return this.http.post<any>(`${this.apiUrl}/login.php`, { email, password: pass })
      .pipe(
        tap(response => {
          if (response.success) {
            this.saveUser(response.user);
            this.router.navigate(['/']);
          }
        })
      );
  }

  // Enregistre un nouvel utilisateur via l'API
  register(user: User) {
    return this.http.post<any>(`${this.apiUrl}/register.php`, user)
      .pipe(
        tap(response => {
          if (response.success) {
            this.saveUser(response.user);
            this.router.navigate(['/']);
          }
        })
      );
  }

  // Valide la session de l'utilisateur stocké en local contre la BDD
  validateSession(user: User) {
    return this.http.post<any>(`${this.apiUrl}/validate-session.php`, {
      userId: user.id,
      email: user.email
    }).pipe(
      tap(response => {
        if (!response.success) {
          // La session est invalide, déconnecter
          this.logout();
        } else if (response.user) {
          // Mettre à jour les données utilisateur (au cas où elles auraient changé)
          this.saveUser(response.user);
        }
      })
    );
  }

  // Déconnecte localement l'utilisateur
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('current_user');
    this.router.navigate(['/login']);
  }

  private saveUser(user: User) {
    this.currentUser.set(user);
    // On garde juste l'info "Je suis connecté" dans le navigateur
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('current_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
}