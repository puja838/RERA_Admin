import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  API_ROOT = environment.API_ROOT;
  FILE_ROOT = environment.FILE_ROOT;
  CRT_ROOT = environment.CRT_ROOT;
  FILE_URL = environment.FILE_URL;
  IFIX_URL = environment.IFIX_URL
  IFIX_URL_TESTAPP = environment.IFIX_URL_TESTAPP;
  CMS_URL = environment.CMS_URL;
  CGM_URL = environment.CGM_URL;
  PRM_ADMIN_URL = environment.PRM_ADMIN_URL;
  CGM_APP_URL = environment.CGM_APP_URL;
  BASE_PATH = environment.BASE_PATH;
  constructor() { }
}
