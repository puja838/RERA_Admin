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
  EXTENSION_PATH="v1/project-extension/";
  AGENT_PATH="v1/agent/";

  constructor(private config: ConfigService, private http: HttpClient) {
  }

  fetchProjectDetailsbyisApprove(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectDetailsbyisApprove', JSON.stringify(data), httpOptions);
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
  fetchUserFromStep(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'fetchUserFromStep', JSON.stringify(data), httpOptions);
  }
  getProjectHistory(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'getProjectHistory', JSON.stringify(data), httpOptions);
  }
  hasValidQuery(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'hasValidQuery', JSON.stringify(data), httpOptions);
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
  getRegistrationCertificate_v2(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/getRegistrationCertificate_v2', JSON.stringify(data), httpOptions);
  }
  saveCertificateContent(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/saveCertificateContent', JSON.stringify(data), httpOptions);
  }
  getOfficerQuestion(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getOfficerQuestion', JSON.stringify(data), httpOptions);
  }
  insertOfficerAnswer(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'insertOfficerAnswer', JSON.stringify(data), httpOptions);
  }
  getInternalNotes(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getInternalNotes', JSON.stringify(data), httpOptions);
  }
  insertInternalNotes(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'insertInternalNotes', JSON.stringify(data), httpOptions);
  }
  fetchRoleUserInStep(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'fetchRoleUserInStep', JSON.stringify(data), httpOptions);
  }
  changeUserInStep(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'changeUserInStep', JSON.stringify(data), httpOptions);
  }
  getSingleQueryAnswer(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getSingleQueryAnswer', JSON.stringify(data), httpOptions);
  }
  getApprovalTypes(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getApprovalTypes', JSON.stringify(data), httpOptions);
  }
  insertApprovalNotes(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'insertApprovalNotes', JSON.stringify(data), httpOptions);
  }
  getApprovalNotes(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getApprovalNotes', JSON.stringify(data), httpOptions);
  }
  getChairmanApprovalTypes(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'getChairmanApprovalTypes', JSON.stringify(data), httpOptions);
  }
  fetchProjectDetailsForUserCount(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectDetailsForUserCount', JSON.stringify(data), httpOptions);
  }
  fetchChecklistByTabExtension(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchChecklistByTabExtension', JSON.stringify(data), httpOptions);
  }
  getExtensionCertificate(data: any): any {
    return this.http.post(this.API_ROOT + this.EXTENSION_PATH + 'getExtensionCertificate', JSON.stringify(data), httpOptions);
  }
  updateExtensionStatus(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'updateExtensionStatus', JSON.stringify(data), httpOptions);
  }
  getAgentRegistrationCertificate(data: any): any {
    return this.http.post(this.API_ROOT + this.AGENT_PATH + 'getRegistrationCertificate', JSON.stringify(data), httpOptions);
  }
  saveAgentCertificateContent(data: any): any {
    return this.http.post(this.API_ROOT + this.AGENT_PATH + 'saveCertificateContent', JSON.stringify(data), httpOptions);
  }
  saveExtensionCertificateContent(data: any): any {
    return this.http.post(this.API_ROOT + this.EXTENSION_PATH + 'saveCertificateContent', JSON.stringify(data), httpOptions);
  }
  updateAgentStatus(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'updateAgentStatus', JSON.stringify(data), httpOptions);
  }
  workflowStepQueryAnswerComment(data: any): any {
    return this.http.post(this.API_ROOT + this.WORKFLOW_PATH + 'workflowStepQueryAnswerComment', JSON.stringify(data), httpOptions);
  }
  fetchProjectRegisterCount(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectRegisterCount', JSON.stringify(data), httpOptions);
  }
  fetchProjectRegisterCountofQuater(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectRegisterCountofQuater', JSON.stringify(data), httpOptions);
  }
  fetchRevenue(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchRevenue', JSON.stringify(data), httpOptions);
  }
}
