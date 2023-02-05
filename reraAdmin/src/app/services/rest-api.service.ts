import { Injectable } from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  API_ROOT = this.config.API_ROOT;
  IFIX_URL = this.config.IFIX_URL;
  FILE_ROOT = this.config.FILE_ROOT;
  NEWS_ROOT = this.config.NEWS_ROOT;
  constructor(private config: ConfigService, private http: HttpClient) { }
  login(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_user/login', data);
  }

  rolelist(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_user/rolelist', data);
  }

  list(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_user/list', data);
  }

  add(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_user/add', data);
  }

  update(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_user/update', data);
  }

  delete(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_user/delete', data);
  }

  changeRoleName(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_user/changeRoleName', data);
  }

  getFormInfo(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/form-info', JSON.stringify(data), httpOptions);
  }
  addAllFieldDetails(data: any){
    return this.http.post(this.API_ROOT + 'v1/project/addallfielddetails', JSON.stringify(data), httpOptions);
  }
  deleteProfileTemp(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/render-profile/delete-temp', JSON.stringify(data), httpOptions);
  }
  getLatLong(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/location/getlatlong', JSON.stringify(data), httpOptions);
  }
  getProfileFormInfo(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/render-profile/form-info', JSON.stringify(data), httpOptions);
  }

  /*getCaseByProject(data: any) {
    return this.http.get(this.IFIX_URL + 'getcasedetails?Project_registration_no=' + data.projectRegNo + '&nextOffset=0&paginationType=next&page_size=10')
  }*/
  getCaseByProject(data: any) {
    return this.http.get(this.IFIX_URL + 'getCaseCountBasedProjectId?Project_registration_no='+ data.projectRegNo); // data.projectRegNo
  }

  getPastProjectOutsideCaseDtl(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project/getPastProjectOutsideCaseDtl', JSON.stringify(data), httpOptions);
  }
  getPastProjects(data: any){
    return this.http.post(this.API_ROOT + 'v1/project/past-projects', JSON.stringify(data), httpOptions);
  }
  getState(data:any){
    return this.http.post(this.API_ROOT + 'v1/project/getState', JSON.stringify(data), httpOptions);
  }
  getDistricts(data:any){
    return this.http.post(this.API_ROOT + 'v1/project/getDistricts', JSON.stringify(data), httpOptions);
  }

  uploadFile(data:any){
    return this.http.post(this.API_ROOT + 'v1/mst_notice/fileupload',data);
  }

  noticelist(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_notice/list', data);
  }

  noticeadd(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_notice/add', data);
  }

  noticeupdate(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_notice/update', data);
  }

  noticedelete(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_notice/delete', data);
  }
  generateProjectExtensionId(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/generateProjectExtensionId', JSON.stringify(data), httpOptions);
  }
  getDevelopmentPlan(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/getDevelopmentPlan', JSON.stringify(data), httpOptions);
  }
  getDocuments(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/getDocuments', JSON.stringify(data), httpOptions);
  }
  getBuildingListOfProject(data: any){
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/getBuildingListOfProject', JSON.stringify(data), httpOptions);
  }
}
