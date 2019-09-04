import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeseriesService {
  constructor(private http: HttpClient) { }

  public getDataByCompanyLocationArea(company: string, location: string, area: string): Observable<any> {
     var requestURI = 'http://' + environment.timeseriesAPI_URL + ':' + environment.timeseriesAPI_PORT + '/timeseries/v1/' + company + '/' + location +'/' + area;
    return this.http.get<any>(requestURI);
  }

}
