import { Component, OnInit } from '@angular/core';
import { GridsterItem, GridsterConfig }  from 'angular-gridster2';
import { UUID } from 'angular2-uuid';
import { DashboardService } from './dashboard.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  get options(): GridsterConfig {
    return this.dashboardService.options;
  }
  get layout(): GridsterItem[] {
    return this.dashboardService.layout;
  }

  constructor(
    private dashboardService: DashboardService
  ){}

  ngOnInit() {
  }
}
