import { Injectable } from '@angular/core';
import {ConfigService} from "./config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class MstProfileFieldsGroupService {

  API_ROOT = this.config.API_ROOT;

  constructor(private config: ConfigService, private http: HttpClient) {
  }

  getFieldListByGroup(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-profile-field-group/getFieldListByGroup', JSON.stringify(data), httpOptions);
  }

  getFieldList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-profile-fields/list', JSON.stringify(data), httpOptions);
  }

  getList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-profile-field-group/list', JSON.stringify(data), httpOptions);
  }

  addData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-profile-field-group/add', JSON.stringify(data), httpOptions);
  }

  updateData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-profile-field-group/update', JSON.stringify(data), httpOptions);
  }

  deleteData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-profile-field-group/delete', JSON.stringify(data), httpOptions);
  }

  addFieldsInGroup(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-profile-field-group/addFieldsInGroup', JSON.stringify(data), httpOptions);
  }

  updateSequence(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-profile-field-group/updateSequence', JSON.stringify(data), httpOptions);
  }
}
