import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthentificationService } from '../../services/authentification';
import { PanierService } from '../../services/panier';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {

  auth = inject(AuthentificationService);
  panier = inject(PanierService);
  
}
