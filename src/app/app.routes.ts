import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { HomeComponent } from './components/home/home';
import { CatalogueComponent } from './components/catalogue/catalogue';
import { OrdersComponent } from './components/orders/orders';
import { StatisticsComponent } from './components/statistics/statistics';
import { RgpdComponent } from './components/rgpd/rgpd';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [adminGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent},
  { path: 'rgpd', component: RgpdComponent }

];
