import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthentificationService } from '../services/authentification';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  auth = inject(AuthentificationService);
  name = '';
  email = '';
  password = '';
  telephone = '';
  adresse = '';
  statut = '';
  error = signal('');

  // Crée un objet utilisateur local
  onSubmit() {
    if (!this.name || !this.email || !this.password || !this.telephone || !this.adresse) return;

    const newUser = {
      id: '0',
      name: this.name,
      email: this.email,
      password: this.password,
      telephone: this.telephone,
      adresse: this.adresse,
      statut: this.statut as 'etudiant' | 'admin' | ''
    };

    this.auth.register(newUser).subscribe({
      next: () => {},
      error: (err) => {
        this.error.set(err.error.message || 'Erreur lors de l\'inscription');
      }
    });
  }
}
