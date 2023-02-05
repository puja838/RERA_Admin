import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "./config.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class PromoterWorkflowService {

  API_ROOT = this.config.API_ROOT;
  BASE_ROOT = this.config.FILE_URL;
  SUB_PATH = "v1/userprojectlist/";
  // EXE_PATH="v1/project-execution/";
  WORKFLOW_PATH="v1/workflow/";
  constructor(private config: ConfigService, private http: HttpClient) {
  }
 /* getProjectDetail(data: any): any {
    return this.http.post(this.API_ROOT + this.EXE_PATH + 'getProjectDetail', JSON.stringify(data), httpOptions);
  }*/
  getPromoterQueryDashboard(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getPromoterQueryDashboard', JSON.stringify(data), httpOptions);
  }
  getSingleQueryAnswer(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getSingleQueryAnswer', JSON.stringify(data), httpOptions);
  }
  fetchProjectDetailsById(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectDetailsById', JSON.stringify(data), httpOptions);
  }
  getNextStepDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getNextStepDetails', JSON.stringify(data), httpOptions);
  }
  getQueryById(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getQueryById', JSON.stringify(data), httpOptions);
  }
  moveWorkflow(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'moveWorkflow', JSON.stringify(data), httpOptions);
  }
  workflowStepQueryAnswerMultiple(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'workflowStepQueryAnswerMultiple', JSON.stringify(data), httpOptions);
  }
  getPromoterAnswer(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getPromoterAnswer', JSON.stringify(data), httpOptions);
  }
}
