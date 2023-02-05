import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MstFieldsService {
  API_ROOT = this.config.API_ROOT;

  constructor(private config: ConfigService, private http: HttpClient) {
  }

  getList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-fields/list', JSON.stringify(data), httpOptions);
  }

  addData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-fields/add', JSON.stringify(data), httpOptions);
  }

  updateData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-fields/update', JSON.stringify(data), httpOptions);
  }

  deleteData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-fields/delete', JSON.stringify(data), httpOptions);
  }

  businessUnitTypeData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_business_unit_type/list', JSON.stringify(data), httpOptions);
  }
}
