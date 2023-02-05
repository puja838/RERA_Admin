import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class RegisterListService {
  API_ROOT = this.config.API_ROOT;
  BASE_ROOT = this.config.FILE_URL;
  SUB_PATH = "v1/userprojectlist/";
  WORKFLOW_PATH="v1/workflow/";
  EXTENSION_PATH="v1/project-extension/";
  AGENT_PATH="v1/agent/";

  constructor(private config: ConfigService, private http: HttpClient) {
  }

  fetchProjectDetails(data: any): any {
    return this.http.post(this.API_ROOT + this.SUB_PATH + 'fetchProjectRegisterDetails', JSON.stringify(data), httpOptions);
  }
}
