import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },  // Home page route
    { path: 'dashboard', component: DashboardComponent }  // Dashboard route
  ];
