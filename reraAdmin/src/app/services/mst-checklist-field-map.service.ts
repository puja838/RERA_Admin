import { Injectable } from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class MstChecklistFieldMapService {

  API_ROOT = this.config.API_ROOT;
  constructor(private config: ConfigService, private http: HttpClient) { }


  getSteps(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_checklist_field_map/getsteps', JSON.stringify(data), httpOptions);
  }

  getFields(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_checklist_field_map/getfields', JSON.stringify(data), httpOptions);
  }

  getGroups(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_checklist_field_map/getgroups', JSON.stringify(data), httpOptions);
  }

  getGroupFields(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_checklist_field_map/getgroupfields', JSON.stringify(data), httpOptions);
  }

  addChecklist(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_checklist_field_map/add-checklist', JSON.stringify(data), httpOptions);
  }

  getList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_checklist_field_map/get-checklist', JSON.stringify(data), httpOptions);
  }

  updateChecklist(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_checklist_field_map/update-checklist', JSON.stringify(data), httpOptions);
  }

  deleteChecklist(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_checklist_field_map/delete-checklist', JSON.stringify(data), httpOptions);
  }

}
