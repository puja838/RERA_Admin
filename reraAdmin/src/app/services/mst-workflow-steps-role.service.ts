import { Injectable } from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MstWorkflowStepsRoleService {
  API_ROOT = this.config.API_ROOT;
  constructor(private config: ConfigService, private http: HttpClient) { }

  getList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role/list', JSON.stringify(data), httpOptions);
  }
  getRole(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role/getrole', JSON.stringify(data), httpOptions);
  }
  addData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role/add', JSON.stringify(data), httpOptions);
  }
  updateData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role/update', JSON.stringify(data), httpOptions);
  }
  deleteData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role/delete', JSON.stringify(data), httpOptions);
  }
  

  getworkflowid(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_works/getworkflowid', JSON.stringify(data), httpOptions);
  }

  getworkflowstepid(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_works/getworkflowstepid', JSON.stringify(data), httpOptions);
  }

  getstepid(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role/getstepid', JSON.stringify(data), httpOptions);
  }
}
