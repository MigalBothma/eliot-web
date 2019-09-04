import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  constructor(private http: HttpClient) { }

  public getContextByCompany(company: string): Observable<any> {
    var requestURI = 'http://' + environment.timeseriesAPI_URL + ':' + environment.timeseriesAPI_PORT + '/context/' + company;
   return this.http.get<any>(requestURI);
 }
}
