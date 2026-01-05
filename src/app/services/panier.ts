import { Injectable, signal, computed } from '@angular/core';
import { Sushi, PanierProd, Box } from '../models/sushi.model';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  private readonly ORDERS_KEY = 'sushi_orders';

  // Signal contenant les éléments du panier
  private PanierProd = signal<PanierProd[]>([]);
  // Indique si le drawer est ouvert
  isOpen = signal<boolean>(false);
  // Signal pour stocker le statut utilisateur (étudiant ou non)
  userStatus = signal<string | undefined>(undefined);

  count = computed(() => this.PanierProd().reduce((acc, item) => acc + item.quantity, 0));
  boxCount = computed(() => {
    return this.PanierProd()
      .filter(item => item.box !== undefined)
      .reduce((acc, item) => acc + item.quantity, 0);
  });
  total = computed(() => {
    return this.PanierProd().reduce((acc, item) => {
      const price = item.sushi?.price || item.box?.price || 0;
      return acc + (price * item.quantity);
    }, 0);
  });
  // Calcule la remise étudiant (1.7% si l'utilisateur est étudiant)
  studentDiscount = computed(() => {
    const status = this.userStatus();
    const normalizedStatus = status ? status.trim().toLowerCase() : '';
    if (normalizedStatus === 'etudiant') {
      return this.total() * 0.017;
    }
    return 0;
  });
  // Calcule la remise boites (1.5% si au moins 5 boxes commandées)
  bulkDiscount = computed(() => {
    if (this.boxCount() >= 5) {
      return this.total() * 0.015;
    }
    return 0;
  });


  discount = computed(() => this.studentDiscount() + this.bulkDiscount());
  // Total après remise, arrondi à 2 décimales
  finalTotal = computed(() => Math.round((this.total() - this.discount()) * 100) / 100);
  canAddMoreBoxes = computed(() => this.boxCount() < 10);
  // Indique si la limite de 10 boxes a été dépassée
  exceedsBoxLimit = computed(() => this.boxCount() > 10);
  items = this.PanierProd.asReadonly();

  // Ajoute un sushi au panier : si déjà présent, incrémente la quantité
  add(sushi: Sushi) {
    this.PanierProd.update(items => {
      const existing = items.find(i => i.sushi?.id === sushi.id);
      if (existing) {
        return items.map(i => i.sushi?.id === sushi.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { sushi, quantity: 1 }];
    });
    
  }

  // Ajoute une boîte au panier : si déjà présente, incrémente la quantité
  addBox(box: Box) {
    this.PanierProd.update(items => {
      const existing = items.find(i => i.box?.id === box.id);
      if (existing) {
        return items.map(i => i.box?.id === box.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { box, quantity: 1 }];
    });
    
  }

  // Incrémente la quantité d'un item
  increment(itemId: number, isBox: boolean = false) {
    this.PanierProd.update(items => 
      items.map(i => {
        const id = isBox ? i.box?.id : i.sushi?.id;
        return id === itemId ? { ...i, quantity: i.quantity + 1 } : i;
      })
    );
  }

  // Décrémente la quantité, et supprime l'item si la quantité tombe à 0
  decrement(itemId: number, isBox: boolean = false) {
    this.PanierProd.update(items => {
      const item = items.find(i => {
        const id = isBox ? i.box?.id : i.sushi?.id;
        return id === itemId;
      });
      if (item && item.quantity > 1) {
        return items.map(i => {
          const id = isBox ? i.box?.id : i.sushi?.id;
          return id === itemId ? { ...i, quantity: i.quantity - 1 } : i;
        });
      }
      return items.filter(i => {
        const id = isBox ? i.box?.id : i.sushi?.id;
        return id !== itemId;
      });
    });
  }

  // Vide totalement le panier
  clear() {
    this.PanierProd.set([]);
  }

  // Sauvegarde une commande côté client
  saveOrder(order: any) {
    try {
      const raw = localStorage.getItem(this.ORDERS_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      existing.unshift(order);
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Impossible de sauvegarder la commande en LocalStorage', e);
    }
  }

  // Récupère les commandes sauvegardées côté client
  getOrders(): any[] {
    try {
      const raw = localStorage.getItem(this.ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Impossible de lire les commandes depuis LocalStorage', e);
      return [];
    }
  }

  // Basculer l'ouverture/fermeture du drawer
  toggle() {
    this.isOpen.update(v => !v);
  }

  // Met à jour le statut utilisateur pour appliquer la remise si étudiant
  setUserStatus(status: string | undefined) {
    this.userStatus.set(status);
  }
}
