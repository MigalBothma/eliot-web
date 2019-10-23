import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { FeaturesComponent } from './Components/features/features.component';
import { DashboardStaticComponent } from './Components/dashboard-static/dashboard-static.component';
import { DevicesComponent } from './Components/devices/devices.component';
import { PricingComponent } from './Components/pricing/pricing.component';
import { AboutComponent } from './Components/about/about.component';

const routes: Routes = [
  { path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  { path: 'home',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'about',
    pathMatch: 'full',
    component: AboutComponent
  },
  { path: 'dashboard',
    pathMatch: 'full',
    component: DashboardStaticComponent
  },
  {
    path: 'features',
    pathMatch: 'full',
    component: FeaturesComponent
  },
  {
    path: 'devices',
    pathMatch: 'full',
    component: DevicesComponent
  },
  {
    path: 'pricing',
    pathMatch: 'full',
    component: PricingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
