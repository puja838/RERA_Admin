import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "./config.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  API_ROOT = this.config.API_ROOT;
  BASE_ROOT = this.config.FILE_URL;
  SUB_PATH = "v1/search/";
  PROJECT_PATH="v1/project/";
  constructor(private config: ConfigService, private http: HttpClient) {
  }
  search(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'search', JSON.stringify(data), httpOptions);
  }
  getState(data: any): any {
    return this.http.post(this.API_ROOT + this.PROJECT_PATH + 'getState', JSON.stringify(data), httpOptions);
  }
  getDistricts(data: any): any {
    return this.http.post(this.API_ROOT + this.PROJECT_PATH + 'getDistricts', JSON.stringify(data), httpOptions);
  }
  fetchProjectType(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectType', JSON.stringify(data), httpOptions);
  }
  maxFieldValue(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'maxFieldValue', JSON.stringify(data), httpOptions);
  }
  fetchProjectDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectDetails', JSON.stringify(data), httpOptions);
  }
  fetchProjectValueDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectValueDetails', JSON.stringify(data), httpOptions);
  }
  fetchCommonAmenities(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchCommonAmenities', JSON.stringify(data), httpOptions);
  }
  fetchBuildingDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchBuildingDetails', JSON.stringify(data), httpOptions);
  }
  fetchProfileValueDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProfileValueDetails', JSON.stringify(data), httpOptions);
  }
  fetchDocuments(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchDocuments', JSON.stringify(data), httpOptions);
  }
  fetchEngineerDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchEngineerDetails', JSON.stringify(data), httpOptions);
  }
  fetchPromoterDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchPromoterDetails', JSON.stringify(data), httpOptions);
  }
  fetchProjectByStatus(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectByStatus', JSON.stringify(data), httpOptions);
  }
  fetchDirectorDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchDirectorDetails', JSON.stringify(data), httpOptions);
  }
  fetchPastProject(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchPastProject', JSON.stringify(data), httpOptions);
  }
  fetchFullBuildingDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchFullBuildingDetails', JSON.stringify(data), httpOptions);
  }
  fetchFinancialDocuments(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchFinancialDocuments', JSON.stringify(data), httpOptions);
  }
}
