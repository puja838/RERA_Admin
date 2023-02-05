import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {ConfigService} from "../services/config.service";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {

  apiUrl: any = this.config.CMS_URL;

  constructor(private config: ConfigService, private http: HttpClient) { }

  getFullMenu(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/panel/getFullmenu', data);
  }

  getMenuContent(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/panel/getMenuContent', data);
  }

  getMenuContentbyURL(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/panel/getMenuContentByUrl', data);
  }
}
