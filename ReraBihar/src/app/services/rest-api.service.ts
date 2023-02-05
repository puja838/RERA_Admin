import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "./config.service";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const options = {
  headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
};

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  API_ROOT = this.config.API_ROOT;
  FILE_URL = this.config.FILE_URL;
  IFIX_URL = this.config.IFIX_URL;
  IFIX_URL_TESTAPP = this.config.IFIX_URL_TESTAPP;
  FILE_ROOT = this.config.FILE_ROOT;
  CGM_URL = this.config.CGM_URL;
  PRM_ADMIN_URL = this.config.PRM_ADMIN_URL;
  CGM_APP_URL = this.config.CGM_APP_URL;
  BASE_PATH = this.config.BASE_PATH;
  FEEDBACK_URL = 'http://acc3.ifixcloud.io:9000/#/RERA_ticket/dashboardRERA?userId=RFBaQVBH&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU5MzUzLCJpYXQiOjE2NjMxMzgzMzAsImV4cCI6MTY2MzE0MTkzMH0.21KjkF2ujIeh4t55IgYz_5sCcjaKAYmwwh3t_WU3B1M&routeFor=create';
  grievanceURL = 'http://poc.ifixcloud.co:9000/#/ticket/Dashboardrerahelpdesk?name=FBcKFxMVSxARKgIEMRQQBxxLBg==&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4ODkxLCJpYXQiOjE2NjgwODY1MzAsImV4cCI6MTY2ODA5MDEzMH0.LsUK0dh5KzF66cex3_MZKEdNQIQCCEGaHJ53V8KIcQY&clientId=19 ';
  constructor(private config: ConfigService, private http: HttpClient) {
  }

  getOnboardingCountData(data:any) {
    return this.http.post(this.API_ROOT + 'v1/onboarding/getOnboardingCountData', JSON.stringify(data), httpOptions);
  }
  getWhatsNew() {
    return this.http.get(this.API_ROOT + 'v1/onboarding/getWhatsNew', httpOptions);
  }

  getAllRegisteredProjectCountDistrictwise() {
    return this.http.get(this.API_ROOT + 'v1/onboarding/getAllRegisteredProjectCountDistrictwise', httpOptions);
  }

  getProjectLatLong() {
    return this.http.get(this.API_ROOT + 'v1/onboarding/getProjectLatLong', httpOptions);
  }

  getFormInfo(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/form-info', JSON.stringify(data), httpOptions);
  }

  getUpdateProjectFormInfo(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/form-info', JSON.stringify(data), httpOptions);
  }
  getPastProjects(data: any){
    return this.http.post(this.API_ROOT + 'v1/project/past-projects', JSON.stringify(data), httpOptions);
  }
  getProfileFormInfo(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/render-profile/form-info', JSON.stringify(data), httpOptions);
  }
  uploadAgentSignature(data:any){
    return this.http.post(this.API_ROOT + 'v1/render-profile/uploadSignature', data);
  }
  createProject(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/create-new-temp-project', JSON.stringify(data), httpOptions);
  }
  storeTemp(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/store-temp', data);
  }
  storeProfileTemp(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/render-profile/store-temp', data);
  }
  deleteTemp(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/delete-temp', JSON.stringify(data), httpOptions);
  }
  submitProject(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/submit', JSON.stringify(data), httpOptions);
  }
  getProjectList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/getProjectList', JSON.stringify(data), httpOptions);
  }
  userLoginInfo(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_user/login', JSON.stringify(data), httpOptions);
  }
  userSignUpInfo(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/signup/userSignUpInfo', JSON.stringify(data), httpOptions);
  }
  getEntityTypeList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-entity-type/list', JSON.stringify(data), httpOptions);
  }
  getEntityTypeByEntity(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst-entity-type/getEntityTypeByEntity', JSON.stringify(data), httpOptions);
  }
  deleteProfileTemp(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/render-profile/delete-temp', JSON.stringify(data), httpOptions);
  }
  deleteProjectTemp(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/delete-temp', JSON.stringify(data), httpOptions);
  }

  submitProfile(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/render-profile/submit', JSON.stringify(data), httpOptions);
  }

  getSystemVerificationFields(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/getSystemVerificationFields', JSON.stringify(data), httpOptions);
  }

  getRegistrationCertificate(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/getRegistrationCertificate', JSON.stringify(data), httpOptions);
  }

  deleteDraftProject(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/project/deleteDraftProject', JSON.stringify(data), httpOptions);
  }

  moveWorkflow(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/workflow/moveWorkflow', JSON.stringify(data), httpOptions);
  }

  getLatLong(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/location/getlatlong', JSON.stringify(data), httpOptions);
  }

  generateAadhaarOTP(data: any){
    return this.http.post(this.API_ROOT + 'v1/aadhaar/generateAadhaarOTP', JSON.stringify(data), httpOptions);
  }

  submitAadhaarOTP(data: any){
    return this.http.post(this.API_ROOT + 'v1/aadhaar/submitAadhaarOTP', JSON.stringify(data), httpOptions);
  }

  getProjectDashboardData(data: any){
    return this.http.post(this.API_ROOT + 'v1/project/getProjectDashboardData', JSON.stringify(data), httpOptions);
  }

  fetchProjectDetailsForUser(data: any){
    return this.http.post(this.API_ROOT + 'v1/userprojectlist/fetchProjectDetailsForUser', JSON.stringify(data), httpOptions);
  }

  fetchUpdateProjectDetailsForUser(data: any){
    return this.http.post(this.API_ROOT + 'v1/project/fetchUpdateProjectDetailsForUser', JSON.stringify(data), httpOptions);
  }

  getBuildingListOfProject(data: any){
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/getBuildingListOfProject', JSON.stringify(data), httpOptions);
  }

  stageTwoStoreTemp(data: any){
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/store-temp', JSON.stringify(data), httpOptions);
  }

  stageTwoSubmitForm(data: any){
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/submitForm', JSON.stringify(data), httpOptions);
  }

  getInformationUpdateData(data: any){
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/getInformationUpdateData', JSON.stringify(data), httpOptions);
  }

  saveInformationUpdateData(data: any){
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/saveInformationUpdateData', JSON.stringify(data), httpOptions);
  }

  getStageTwoHdr(data: any){
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/getStageTwoHdr', JSON.stringify(data), httpOptions);
  }

  getInventoryDetails(data: any){
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/getInventoryDetails', JSON.stringify(data), httpOptions);
  }

  saveInventoryData(data: any){
    return this.http.post(this.API_ROOT + 'v1/project-stage-two/saveInventoryData', JSON.stringify(data), httpOptions);
  }

  //  <<<<<-------------------------------------------                  --------------------------------------->>>>>>


  generateFieldOTP(data: any){
    return this.http.post(this.API_ROOT + 'v1/validation/generateFieldOTP', JSON.stringify(data), httpOptions);
  }

  submitFieldOTP(data: any){
    return this.http.post(this.API_ROOT + 'v1/validation/submitFieldOTP', JSON.stringify(data), httpOptions);
  }

  getFormSubmitInfo(data: any){
    return this.http.post(this.API_ROOT + 'v1/render-profile/getFormSubmitInfo', JSON.stringify(data), httpOptions);
  }

  getCaseFiledCount(data:any){
    let url = this.IFIX_URL+"getCaseCountBasedPromotorId?login_name="+ data.Promotor_id;
    return this.http.get(url);
  }

  getCauseList(data:any) {
    let url = this.IFIX_URL+"getCauseListPageNation?client_id=18&nextOffset=" + data.nextOffset + "&paginationType=" + data.paginationType + "&page_size=" + data.pageSize;
    return this.http.get(url);
  }

  getListofComplain(data:any){
    let url = this.IFIX_URL_TESTAPP+"?userId="+data.userId+"&callBackURL="+this.IFIX_URL_TESTAPP
    return url
  }

  CreateUser(body:any){
    return this.http.post(this.IFIX_URL+'createuser_customized', body, options);
  }

  storeUserInfo(data: any){
    return this.http.post(this.API_ROOT + 'v1/signup/storeUserInfo', JSON.stringify(data), httpOptions);
  }

  // PAN Validation
  verifyPAN(data: any){
    return this.http.post(this.API_ROOT + 'v1/verification/verifypan', JSON.stringify(data), httpOptions);
  }

  // IFSC VERIFICATION
  verifyIFSC(data: any){
    return this.http.post(this.API_ROOT + 'v1/verification/verifyifsc', JSON.stringify(data), httpOptions);
  }
  verifyGSTIN(data: any){
    return this.http.post(this.API_ROOT + 'v1/verify/gstin', JSON.stringify(data), httpOptions);
  }
  verifyDIN(data: any){
    return this.http.post(this.API_ROOT + 'v1/verify/din', JSON.stringify(data), httpOptions);
  }
  
  // All Field Details
  addAllFieldDetails(data: any){
    return this.http.post(this.API_ROOT + 'v1/project/addallfielddetails', JSON.stringify(data), httpOptions);
  }

  getState(data:any){
    return this.http.post(this.API_ROOT + 'v1/project/getState', JSON.stringify(data), httpOptions);
  }

  getDistricts(data:any){
    return this.http.post(this.API_ROOT + 'v1/project/getDistricts', JSON.stringify(data), httpOptions);
  }

  getPastProjectOutsideCaseDtl(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project/getPastProjectOutsideCaseDtl', JSON.stringify(data), httpOptions);
  }

  uploadSignature(data:any){
    return this.http.post(this.API_ROOT + 'v1/project/uploadSignature', data);
  }

  getFinancialYearList(data:any){
    return this.http.post(this.API_ROOT + 'v1/project/getFinancialYearList', data);
  }

  isPaymentComplete(data:any){
    return this.http.post(this.API_ROOT + 'v1/project/isPaymentComplete', JSON.stringify(data), httpOptions);
  }

  makePayment(data:any){
    return this.http.post(this.API_ROOT + 'v1/payment/makePayment', JSON.stringify(data), httpOptions);
  }

  makeAxisPayment(data:any){
    return this.http.post(this.API_ROOT + 'v1/payment/makeAxisPayment', JSON.stringify(data), httpOptions);
  }

  // getCaseByProject(data: any) {
  //   return this.http.get(this.IFIX_URL + 'getcasedetails?Project_registration_no=' + '4gpw5rzl4qpoda6' + '&nextOffset=0&paginationType=next&page_size=10'); // data.projectRegNo
  // }

  getCaseByProject(data: any) {
    return this.http.get(this.IFIX_URL + 'getCaseCountBasedProjectId?Project_registration_no='+ data.projectRegNo); // data.projectRegNo
  }
  
  generateToken(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_user/generateToken', JSON.stringify(data), httpOptions);
  }

  uploadFile(data: any){
    return this.http.post(this.API_ROOT + 'v1/mst_annual_report/fileupload', data);
  }

  addAnnualReport(data:any){
    return this.http.post(this.API_ROOT + 'v1/mst_annual_report/add', JSON.stringify(data), httpOptions);
  }

  listAnnualReport(data:any){
    return this.http.post(this.API_ROOT + 'v1/mst_annual_report/list', JSON.stringify(data), httpOptions);
  }
  deleteReport(data:any){
    return this.http.post(this.API_ROOT + 'v1/mst_annual_report/delete', JSON.stringify(data), httpOptions);
  }
  /*  Project Execution  */
  getProjectDetail(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/getProjectDetail', JSON.stringify(data), httpOptions);
  }
  getPendingQuoterList(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/getPendingQuoterList', JSON.stringify(data), httpOptions);
  }
  getSubmittedQuoterList(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/getSubmittedQuoterList', JSON.stringify(data), httpOptions);
  }
  getInventoryData(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/getInventoryData', JSON.stringify(data), httpOptions);
  }
  getConstructionProgress(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/getConstructionProgress', JSON.stringify(data), httpOptions);
  }
  upsertConstructionProgress(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/upsertConstructionProgress', JSON.stringify(data), httpOptions);
  }

  // Sayan
  getFinancial_details(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/getFinancial_details', JSON.stringify(data), httpOptions);
  }
  addFinancial_details(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/addFinancial_details', JSON.stringify(data), httpOptions);
  }
  updateFinancial_details(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/updateFinancial_details', JSON.stringify(data), httpOptions);
  }
  addLegalCase(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/addLegalCase', JSON.stringify(data), httpOptions);
  }
  updateLegalCase(data:any){
    return this.http.post(this.API_ROOT + 'v1/project-execution/updateLegalCase', JSON.stringify(data), httpOptions);
  }
  getLegalCase(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-execution/getLegalCase', JSON.stringify(data), httpOptions);
  }
  getBuildingPhotograph(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-execution/getBuildingPhotograph', JSON.stringify(data), httpOptions);
  }
  deleteBuildingPhoto(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-execution/deleteBuildingPhoto', JSON.stringify(data), httpOptions);
  }

  uploadPhotoParticulars(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-execution/uploadPhotoParticulars', data);
  }
  getPhotoParticulars() {
    return this.http.get(this.API_ROOT + 'v1/project-execution/getPhotoParticulars', httpOptions);
  }

  getGrievance() {
    return this.http.get(this.IFIX_URL + 'generateToken?clientId=19&login_name=grievance_requester&Logintype=prmLogin', httpOptions);
  }

  getNotices(data:any) {
    return this.http.post(this.API_ROOT + 'v1/mst_notice/getNotices', data);
  }

  getJudgmentList(data: any) {
    return this.http.get(this.IFIX_URL + 'getJudgementsListPageNation?client_id=18&nextOffset=' + data.nextOffset + '&paginationType='+ data.paginationType +'&page_size=' + data.pageSize + '&Allocated_bench='+ data.AllocatedBench +'&note_type=' + data.noteType, httpOptions);
  }

  projectListForExtension(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/projectList', JSON.stringify(data), httpOptions);
  }

  generateProjectExtensionId(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/generateProjectExtensionId', JSON.stringify(data), httpOptions);
  }

  saveProjectExtensionInfo(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/saveProjectExtensionInfo', JSON.stringify(data), httpOptions);
  }

  getDevelopmentPlan(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/getDevelopmentPlan', JSON.stringify(data), httpOptions);
  }

  upsertDevelopmentPlan(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/upsertDevelopmentPlan', JSON.stringify(data), httpOptions);
  }

  getDocuments(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/getDocuments', JSON.stringify(data), httpOptions);
  }

  upsertDocumentData(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/upsertDocumentData', JSON.stringify(data), httpOptions);
  }

  deleteOtherDocData(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/deleteOtherDocData', JSON.stringify(data), httpOptions);
  }

  submitForExtension(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/submitForExtension', JSON.stringify(data), httpOptions);
  }

  getExtensionList(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project-extension/getExtensionList', JSON.stringify(data), httpOptions);
  }

  getNotificationList(data:any) {
    return this.http.post(this.API_ROOT + 'v1/notification/list', JSON.stringify(data), httpOptions);
  }

  getAlerts(data:any) {
    return this.http.post(this.API_ROOT + 'v1/alert/getAlerts', JSON.stringify(data), httpOptions);
  }

  getAgentDashboardData(data:any) {
    return this.http.post(this.API_ROOT + 'v1/agent/getDashboardData', JSON.stringify(data), httpOptions);
  }

  getNewLunchedProjects(data:any) {
    return this.http.post(this.API_ROOT + 'v1/project/getNewLunchedProjects', JSON.stringify(data), httpOptions);
  }

  getAlertsRenual(data:any) {
    return this.http.post(this.API_ROOT + 'v1/agent/getDashboardAlert', JSON.stringify(data), httpOptions);
  }

  renewalProfile(data:any) {
    return this.http.post(this.API_ROOT + '/v1/render-profile/renewal', JSON.stringify(data), httpOptions);
  }
  
}
