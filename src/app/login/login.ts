import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthentificationService } from '../services/authentification';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  auth = inject(AuthentificationService);
  email = '';
  password = '';
  error = signal('');

  // Appelé lors de la soumission : délègue la connexion à AuthService
  // Le service effectue la navigation si succès
  onSubmit() {
    if (!this.email || !this.password) return;
    
    this.auth.login(this.email, this.password).subscribe({
      next: () => {},
      error: (err) => {
        this.error.set(err.error.message || 'Erreur de connexion');
      }
    });
  }
}
