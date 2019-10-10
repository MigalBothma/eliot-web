import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule, MatButtonModule, MatCardModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { GridsterModule } from 'angular-gridster2';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DxButtonModule, DxBarGaugeModule, DxCheckBoxModule, DxResizableModule } from 'devextreme-angular';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardStaticComponent } from './Components/dashboard-static/dashboard-static.component';

import { TimeseriesService } from './Services/timeseries.service';
import { FeaturesComponent } from './Components/features/features.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    DashboardStaticComponent,
    FeaturesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    GridsterModule,
    BrowserAnimationsModule,
    DxButtonModule, DxBarGaugeModule, DxCheckBoxModule, DxResizableModule,
    MatIconModule, MatButtonModule, MatCardModule,
    NgApexchartsModule
  ],
  providers: [TimeseriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
