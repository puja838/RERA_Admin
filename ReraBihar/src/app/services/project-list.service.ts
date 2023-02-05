import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProjectListService {
  API_ROOT = this.config.API_ROOT;
  BASE_ROOT = this.config.FILE_URL;
  SUB_PATH = "v1/userprojectlist/";
  WORKFLOW_PATH="v1/workflow/";

  constructor(private config: ConfigService, private http: HttpClient) {
  }

  fetchProjectDetailsForUser(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectDetailsForUser', JSON.stringify(data), httpOptions);
  }
  fetchProjectDetailsById(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectDetailsById', JSON.stringify(data), httpOptions);
  }
  fetchTabbyEntityType(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchTabbyEntityType', JSON.stringify(data), httpOptions);
  }
  fetchChecklistByTab(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchChecklistByTab', JSON.stringify(data), httpOptions);
  }
  getNextStepDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getNextStepDetails', JSON.stringify(data), httpOptions);
  }
  getQueryCommentsByProject(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getQueryCommentsByProject', JSON.stringify(data), httpOptions);
  }
  workflowStepChecklistComment(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'workflowStepChecklistComment', JSON.stringify(data), httpOptions);
  }
  moveWorkflow(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'moveWorkflow', JSON.stringify(data), httpOptions);
  }
  workflowStepUserQuery(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'workflowStepUserQuery', JSON.stringify(data), httpOptions);
  }
  workflowStepQueryAnswer(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'workflowStepQueryAnswer', JSON.stringify(data), httpOptions);
  }
  invalidateQuery(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'invalidateQuery', JSON.stringify(data), httpOptions);
  }
  workflowStepResolvedQuery(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'workflowStepResolvedQuery', JSON.stringify(data), httpOptions);
  }
  getStepidBytype(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getStepidBytype', JSON.stringify(data), httpOptions);
  }
  updateApprovalComments(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/updateApprovalComments', JSON.stringify(data), httpOptions);
  }
  isChairmanApprove(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/isChairmanApprove', JSON.stringify(data), httpOptions);
  }
  getRegistrationCertificate(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/getRegistrationCertificate', JSON.stringify(data), httpOptions);
  }

  fetchUserFromStep(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'fetchUserFromStep', JSON.stringify(data), httpOptions);
  }

}
