import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthentificationService } from '../services/authentification';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  const user = authService.currentUser();

  if (user && user.statut === 'admin') {
    return true;
  }

  // Redirige vers la page d'accueil si pas admin
  router.navigate(['/']);
  return false;
};
