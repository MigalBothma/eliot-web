import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
let TimeseriesService = class TimeseriesService {
    constructor(http) {
        this.http = http;
    }
    getDataByCompany(company) {
        console.log("getDataByCompany making call to : " + environment.timeseriesAPI_URL + ':' + environment.timeseriesAPI_PORT + '/timeseries/company/' + company);
        return this.http.get(environment.timeseriesAPI_URL + ':' + environment.timeseriesAPI_PORT + '/timeseries/company/' + company);
    }
};
TimeseriesService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], TimeseriesService);
export { TimeseriesService };
//# sourceMappingURL=timeseries.service.js.map