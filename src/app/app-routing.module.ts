import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  { path: 'home',
    pathMatch: 'full',
    component: HomeComponent
  },
  { path: 'dashboard',
    pathMatch: 'full',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
