import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
let DashboardService = class DashboardService {
    constructor() {
        this.options = {
            draggable: {
                enabled: true
            },
            pushItems: true,
            resizable: {
                enabled: true
            }
        };
        this.layout = [];
    }
    addItem() {
        this.layout.push({
            cols: 2,
            id: UUID.UUID(),
            rows: 2,
            x: 0,
            y: 0
        });
    }
    deleteItem(id) {
        const item = this.layout.find(d => d.id === id);
        this.layout.splice(this.layout.indexOf(item), 1);
    }
};
DashboardService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map