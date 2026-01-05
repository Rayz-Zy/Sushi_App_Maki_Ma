export interface Food {
  id: number;
  nom: string;
  description?: string;
  quantite: number;
}

export interface Box {
  id: number;
  name: string;
  pieces: number;
  price: number;
  image: string;
  aliments: Food[];
  saveurs: string[];
}

export interface Sushi {
  id: number;
  name: string;
  description: string;
  price: number; 
  category: string; 
  image: string;         
}

export interface PanierProd {
  sushi?: Sushi;
  box?: Box;
  quantity: number;
}
