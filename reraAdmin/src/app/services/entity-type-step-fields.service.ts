import {Injectable} from '@angular/core';
import {ConfigService} from "./config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class EntityTypeStepFieldsService {

  API_ROOT = this.config.API_ROOT;

  constructor(private config: ConfigService, private http: HttpClient) {
  }

  landingData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/entitytype-step-fields/landingData', JSON.stringify(data), httpOptions);
  }

  getEntityTypeByEntity(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-entity-type/getEntityTypeByEntity', JSON.stringify(data), httpOptions);
  }

  getList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/entitytype-step-fields/list', JSON.stringify(data), httpOptions);
  }

  getFieldList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/entitytype-step-fields/getFieldList', JSON.stringify(data), httpOptions);
  }

  addData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/entitytype-step-fields/add', JSON.stringify(data), httpOptions);
  }

  updateData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/entitytype-step-fields/update', JSON.stringify(data), httpOptions);
  }

  deleteData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/entitytype-step-fields/delete', JSON.stringify(data), httpOptions);
  }
}
