export interface User {
  id: string;             
  name: string;           
  email: string;         
  password?: string;
  telephone?: string;
  adresse?: string;
  statut?: 'etudiant' | 'admin' | '';
}
