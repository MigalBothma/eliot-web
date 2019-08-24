import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { DashboardStaticComponent } from './Components/dashboard-static/dashboard-static.component';
const routes = [
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
        component: DashboardStaticComponent
    }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map