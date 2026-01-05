import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rgpd',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rgpd.html',
  styleUrls: ['./rgpd.css']
})
export class RgpdComponent {
  now = new Date();
}
