import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthentificationService } from '../services/authentification';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  const user = authService.currentUser();

  if (user) {
    return true;
  }

  // Redirige vers la page de connexion si pas connecté
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
