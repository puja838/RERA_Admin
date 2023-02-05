import { Injectable } from '@angular/core';
import {ConfigService} from "./config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MstEntityTypeService {
  API_ROOT = this.config.API_ROOT;
  constructor(private config: ConfigService, private http: HttpClient) { }

  getList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-entity-type/list', JSON.stringify(data), httpOptions);
  }
  addData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-entity-type/add', JSON.stringify(data), httpOptions);
  }
  updateData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-entity-type/update', JSON.stringify(data), httpOptions);
  }
  deleteData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-entity-type/delete', JSON.stringify(data), httpOptions);
  }
}
