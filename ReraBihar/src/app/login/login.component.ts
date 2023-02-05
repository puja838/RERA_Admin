import {Component, OnInit} from '@angular/core';
import {CommonService} from '../services/common.service'
import {RestApiService} from '../services/rest-api.service'
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from "angular-notifier";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  panNumber = '';
  userPassword = '';
  panNumberErr = '';
  userPasswordErr = '';
  hide = true;
  loginErr = '';
  isValidPan: boolean = false;
  loginType = '';
  constructor(private router: Router, private common: CommonService, private notifier: NotifierService,
              private rest: RestApiService, public translate: TranslateService, private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      if (params['t']) {
        this.loginType = params['t'];
      }
    });
    this.common.getLanguage();
    this.translate.use(this.common.language);
    if (this.common.getUserId() !== null && this.common.getRoleId() == 2) {
      if (this.loginType === 'agent') {
        this.common.clearUserData();
      } else {
        this.router.navigate(['/pages/project-dashboard']);
      }
    } else if (this.common.getUserId() !== null && this.common.getRoleId() == 12) {
      if (this.loginType === '') {
        this.common.clearUserData();
      } else {
        if (this.common.getSubmittedFlag() == 0) {
          this.router.navigate(['/pages/agent-register']);
        } else {
          this.router.navigate(['/pages/agent-dashboard']);
        }
      }
    }
  }

  passfun(): any {
    this.hide = !this.hide
  }

  panNumberFun(): any {
    this.panNumberErr = ''
  }

  passwordFun(): any {
    this.userPasswordErr = ''
  }

  onSubmit(): any {
    this.panNumberErr = '';
    this.userPasswordErr = '';
    let err = 0;
    if (this.panNumber == '') {
      err++;
      this.panNumberErr = this.translate.instant('Please Enter PAN number')
    }
    if (this.userPassword == '') {
      err++;
      this.userPasswordErr = this.translate.instant('Please Enter password')
    }
    const data = {
      'username': this.panNumber,
      'password': this.userPassword,
      'reraid': this.common.getReraId(),
      'type':'A'
    };
    if (err === 0) {
      this.rest.userLoginInfo(data).subscribe((res: any) => {
        if(res.success){
          this.common.setUserData(res.response);
          if (res.response.roleid === 2) {
            sessionStorage.setItem('entityid', '1');
            this.router.navigate(['/pages/project-dashboard']);
          } else if (res.response.roleid==12) {
            sessionStorage.setItem('entityid', '2');
            if(res.response.issubmitted==0){
              this.router.navigate(['/pages/agent-register']);
            } else {
              this.router.navigate(['/pages/agent-dashboard']);
            }

          } else {
            this.notifier.notify('error', 'Invalid login credentials');
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    }
  }

  createAccount(): void {
    if (this.loginType === 'agent') {
      this.router.navigate(['/pages/agent-registration']);
    } else {
      this.router.navigate(['/pages/registration']);
    }
  }

}
