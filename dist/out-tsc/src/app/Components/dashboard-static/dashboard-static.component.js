import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let DashboardStaticComponent = class DashboardStaticComponent {
    constructor(tsService) {
        this.tsService = tsService;
        this.timeseriesData = {};
    }
    ngOnInit() {
        this.tsService.getDataByCompany('Migal')
            .subscribe(events => {
            this.timeseriesData = events;
            console.log(events);
        });
    }
};
DashboardStaticComponent = tslib_1.__decorate([
    Component({
        selector: 'app-dashboard-static',
        templateUrl: './dashboard-static.component.html',
        styleUrls: ['./dashboard-static.component.css']
    })
], DashboardStaticComponent);
export { DashboardStaticComponent };
//# sourceMappingURL=dashboard-static.component.js.map