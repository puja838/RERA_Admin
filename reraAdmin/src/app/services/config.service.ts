import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  API_ROOT = environment.API_ROOT;
  FILE_URL = environment.FILE_URL;
  FILE_ROOT = environment.FILE_ROOT;
  NEWS_ROOT = environment.NEWS_ROOT;
  IFIX_URL = environment.IFIX_URL;
  constructor() { }
}
