import { Injectable } from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MstWorkflowStepsRoleUserChecklistService {
  API_ROOT = this.config.API_ROOT;
  constructor(private config: ConfigService, private http: HttpClient) { }

  getList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role_user_checklist/list', JSON.stringify(data), httpOptions);
  }
  addData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role_user_checklist/add', JSON.stringify(data), httpOptions);
  }
  updateData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role_user_checklist/update', JSON.stringify(data), httpOptions);
  }
  deleteData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_workflow_steps_role_user_checklist/delete', JSON.stringify(data), httpOptions);
  }
  getProjectFieldid(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-fields/list', JSON.stringify(data), httpOptions);
  }
  getgroupnames(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/getgroupnames', JSON.stringify(data), httpOptions);
  }
  gettabnames(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/gettabnames', JSON.stringify(data), httpOptions);
  }
  getGroupNameList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/getgroupnames', JSON.stringify(data), httpOptions);
  }
  addGroupName(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/addgroupname', JSON.stringify(data), httpOptions);
  }
  updateGroupName(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/updategroupname', JSON.stringify(data), httpOptions);
  }
  deleteGroupName(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/deletegroupname', JSON.stringify(data), httpOptions);
  }
  getTabNameList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/gettabname', JSON.stringify(data), httpOptions);
  }
  addTabName(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/addtabname', JSON.stringify(data), httpOptions);
  }
  updateTabName(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/updatetabname', JSON.stringify(data), httpOptions);
  }
  deleteTabName(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/deletetabname', JSON.stringify(data), httpOptions);
  }
  getTabEntityMap(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/gettabentitymap', JSON.stringify(data), httpOptions);
  }
  addTabEntityMap(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/addtabentitymap', JSON.stringify(data), httpOptions);
  }
  updateTabEntityMap(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/updatetabentitymap', JSON.stringify(data), httpOptions);
  }
  deleteTabEntityMap(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/checklist/deletetabentitymap', JSON.stringify(data), httpOptions);
  }

}
