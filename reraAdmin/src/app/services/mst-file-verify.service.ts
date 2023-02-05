import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MstFileVerifyService {
  API_ROOT = this.config.API_ROOT;

  constructor(private config: ConfigService, private http: HttpClient) {
  }

  getList(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_file_verify/list', JSON.stringify(data), httpOptions);
  }

  addData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_file_verify/add', JSON.stringify(data), httpOptions);
  }

  updateData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_file_verify/update', JSON.stringify(data), httpOptions);
  }

  deleteData(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_file_verify/delete', JSON.stringify(data), httpOptions);
  }

  getFieldNameForProject(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_file_verify/getFieldNameForProject', JSON.stringify(data), httpOptions);
  }

  getFieldNameForProfile(data: any): any {
    return this.http.post(this.API_ROOT + 'v1/mst_file_verify/getFieldNameForProfile', JSON.stringify(data), httpOptions);
  }
}
