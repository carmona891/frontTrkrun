import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { RankingComponent } from './components/ranking/ranking.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ContactComponent } from './components/contact/contact.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  { path: 'rankings', component: RankingComponent },
  { path: 'perfil', component: ProfileComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'torneos', component: TournamentsComponent, canActivate: [AuthGuardService] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] }

  
];