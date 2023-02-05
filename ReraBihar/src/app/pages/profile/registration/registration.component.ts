import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../services/rest-api.service';
import { CommonService } from '../../../services/common.service';
import { NotifierService } from "angular-notifier";
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
 
  selectedPromotorType: any = '';
  isPromotorTypeSelected: boolean = false;
  userType: any = "1";
  userName: any = "";
  userPanNo: any = "";
  userEmail: any = "";
  userEmailVarifyCode: any = "";
  userMobileNo: any = "";
  userMobileOTP: any = "";
  userPassword: any = "";
  userConfirmPassword: any = "";
  entityTypeList: any = [];
  userNameErr: string = "";
  panerr: string = '';
  emailerr: string = '';
  mobileerr: string = '';
  emailTableID: any;
  emailClientID: any;
  mobileTableID: any;
  mobileClientID: any;
  timerIdForEmail: any;
  timerIdForMobile: any;
  timerPosition: any;
  timerSequence: any;
  timerTimeLeft: any;
  timerFieldSpc: any;
  isEmailVerify: boolean = false;
  isPhnNumVerify: boolean = false;
  isPanVerify: boolean = false;
  previousUserEmail = '';
  previousUsrMobile = '';
  isSuccess: boolean = false;
  ismobsuccess: boolean = false;
  passworderr = '';
  constructor(private rest: RestApiService, private commonService: CommonService, private notifier: NotifierService, private router: Router, public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.getEntityTypeList();
  }

  getEntityTypeList(): void {
    this.rest.getEntityTypeByEntity({reraid: this.commonService.getReraId(), entityid: 1}).subscribe((res: any) => {
      if (res.success) {
        this.entityTypeList = res.response;
        this.entityTypeList.sort(function (a: any, b: any) {
          return ('' + a.entitytypedesc).localeCompare(b.entitytypedesc);
        });
        this.hideOTPFieldBtns(1, 'Email');
        this.hideOTPFieldBtns(1, 'Mobile');
      }
    });
  }

  onPromotorTypeChange() {
    // this.isPromotorTypeSelected = false;
    // this.userName = "";
    // this.userPanNo = "";
    // this.userEmail = "";
    // this.userEmailVarifyCode = "";
    // this.userMobileNo = "";
    // this.userMobileOTP = "";
    // this.userPassword = "";
    // this.userConfirmPassword = "";
    // if (this.selectedPromotorType === "") {
    //   this.isPromotorTypeSelected = false;
    // } else {
    //   this.isPromotorTypeSelected = true;
    // }
  }

  nameValidation() {
    if ((this.commonService.nameformat.test(this.userName)) || this.commonService.namehasNumber.test(this.userName)) {
      this.userName = this.userName.toUpperCase()
      this.userNameErr = this.translate.instant('Enter a valid User Name')
    }
    else {
      this.userName = this.userName.toUpperCase()
      this.userNameErr = ''
    }
  }

  checkPanLength(event: any): boolean {
    return !(this.userPanNo.length >= 10 && event.keyCode !== 8);
  }

  checkMobileLength(event: any): boolean {
    if ((((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && this.userMobileNo.length < 10) || event.keyCode == 8) {
      return true;
    } else {
      return false;
    }
  }

  validPAN() {
    if (!this.commonService.regpan.test(this.userPanNo) && this.userPanNo != '') {
      this.panerr = this.translate.instant('Sorry, Invalid PAN no.')
    }
    else {
      this.panerr = "";
      this.userPanNo = this.userPanNo.toUpperCase();
    }
  }

  ValidateEmail() {
    if (this.commonService.regemail.test(this.userEmail) == false && this.userEmail != '') {
      this.emailerr = this.translate.instant('Invalid Email Address');
    }
    else {
      this.emailerr = ""
    }
    this.check()
  }

  validMobile() {
    if (!this.commonService.regmobile.test(this.userMobileNo) && this.userMobileNo != '') {
      this.mobileerr = this.translate.instant('Invalid Mobile Number');
    }
    else {
      this.mobileerr = ""
    }
    this.check()
  }

  // validPassword(){
  //   if (this.commonService.passwordValid.test(this.userPassword) == false) {
  //     this.passworderr = 'Password pattern is not match'
  //   }
  //   else {
  //     this.passworderr = ''
  //   }
  // }


  signUp() {
    if (this.selectedPromotorType === "" || this.userName === "" || this.userPanNo === "" || this.userEmail === "" || this.userMobileNo === "" || this.userPassword === "" || this.userConfirmPassword === "") {
      this.notifier.notify('error', this.translate.instant('All * fields are mandatory.'));
    }
    else if (this.userNameErr !== "" || this.panerr !== "" || this.emailerr !== "" || this.mobileerr !== "") {
      this.notifier.notify('error', 'Enter valid details.');
    }
    else if (this.isEmailVerify === false) {
      this.notifier.notify('error', 'Please verify Email.');
    }
    else if (this.isPhnNumVerify === false) {
      this.notifier.notify('error', 'Please verify Mobile Number.');
    }
    else if (this.isPanVerify === false) {
      this.notifier.notify('error', 'Please verify PAN Number.');
    }
    else {
      if (this.userPassword !== this.userConfirmPassword) {
        this.notifier.notify('error', this.translate.instant('Confirm Password must be same as Password.'));
      } else {
        const data = {
          'usertype': this.userType,
          'promotertype': this.selectedPromotorType,
          'username': this.userName,
          'userpan': this.userPanNo,
          'useremail': this.userEmail,
          'usermobile': this.userMobileNo,
          'userpassword': this.userPassword,
          'reraid': this.commonService.getReraId()
        };
        this.rest.userSignUpInfo(data).subscribe((res: any) => {
          if (res.success) {
            this.notifier.notify('success', res.message);
            sessionStorage.setItem('userid', res.response.userid);
            sessionStorage.setItem('entitytypeid', this.selectedPromotorType);
            sessionStorage.setItem('token', res.response.token);
            this.inserDataForm();
            this.router.navigate(['/pages/profile-details']);
          } else {
            this.notifier.notify('error', res.message);
          }
        });
      }
    }

  }

  onButtonClick(fieldSpc: string) {
    if (fieldSpc === "Verify_Email_Id" || fieldSpc === "Resend_Code_Email") {
      this.previousUserEmail = this.userEmail;
      if (this.userEmail !== '') {
        if (this.emailerr !== "") {
          this.notifier.notify('error', 'Enter valid Email ID.');
        } else {
          const data = {
            "reraid": this.commonService.getReraId(),
            "userid": null,
            "fieldid": 0,
            "stepid": 0,
            "groupid": 0,
            "groupposition": 0,
            "fieldvalue": this.userEmail,
            "fieldtype": "Email",
            "isRegistration": "true"
          };
          this.commonService.loaderShow();
          this.rest.generateFieldOTP(data).subscribe((res: any) => {
            this.commonService.loaderEnd();
            if (res.success) {
              this.notifier.notify('success', res.message);
              this.isSuccess = res.success;
              this.emailTableID = res.response.id;
              this.emailClientID = res.response.resReturn.client_id;
              this.hideOTPFieldBtns(2, 'Email');
            } else {
              this.notifier.notify('error', res.message);
            }
          });
        }
      } else {
        this.notifier.notify('error', this.translate.instant('Please enter Email ID.'));
      }
    } else if (fieldSpc === "Verify_Code_Email") {
      if (this.userEmailVarifyCode !== '') {
        const data = {
          "id": Number(this.emailTableID),
          "reraid": this.commonService.getReraId(),
          "userid": null,
          "fieldid": 0,
          "stepid": 0,
          "groupid": 0,
          "groupposition": 0,
          "fieldvalue": this.userEmail,
          "clientid": this.emailClientID,
          "verifyOTP": this.userEmailVarifyCode,
          "isProfile": "true",
          "fieldtype": "Email",
          "isRegistration": "true"
        };
        this.commonService.loaderShow()
        this.rest.submitFieldOTP(data).subscribe((res: any) => {
          this.isEmailVerify = res.success
          this.commonService.loaderEnd()
          if (res.success) {
            this.hideOTPFieldBtns(3, 'Email');
            this.notifier.notify('success', res.message);
          } else {
            this.notifier.notify('error', res.message);
          }
        });
      } else {
        this.notifier.notify('error', 'Please enter OTP.');
      }
    } else if (fieldSpc === "Request_For_OTP_Mobile" || fieldSpc === "Resend_OTP_Mobile") {
      this.previousUsrMobile = this.userMobileNo;
      if (this.userMobileNo !== '') {
        if (this.mobileerr !== "") {
          this.notifier.notify('error', 'Enter valid Mobile Number.');
        } else {
          const data = {
            "reraid": this.commonService.getReraId(),
            "userid": null,
            "fieldid": 0,
            "stepid": 0,
            "groupid": 0,
            "groupposition": 0,
            "fieldvalue": this.userMobileNo,
            "fieldtype": "Mobile",
            "isRegistration": "true"
          };
          this.commonService.loaderShow();
          this.rest.generateFieldOTP(data).subscribe((res: any) => {
            this.commonService.loaderEnd();
            if (res.success) {
              this.notifier.notify('success', res.message);
              this.ismobsuccess = res.success
              this.mobileTableID = res.response.id;
              this.mobileClientID = res.response.resReturn.client_id;
              this.hideOTPFieldBtns(2, 'Mobile');
            } else {
              this.notifier.notify('error', res.message);
            }
          });
        }
      } else {
        this.notifier.notify('error', this.translate.instant('Please enter Mobile Number.'));
      }

    } else if (fieldSpc === "Verify_OTP_Mobile") {
      if (this.userMobileOTP !== '') {
        const data = {
          "id": Number(this.mobileTableID),
          "reraid": this.commonService.getReraId(),
          "userid": null,
          "fieldid": 0,
          "stepid": 0,
          "groupid": 0,
          "groupposition": 0,
          "fieldvalue": this.userMobileNo,
          "clientid": this.mobileClientID,
          "verifyOTP": this.userMobileOTP,
          "isProfile": "true",
          "fieldtype": "Mobile",
          "isRegistration": "true"
        };
        this.commonService.loaderShow()
        this.rest.submitFieldOTP(data).subscribe((res: any) => {
          this.isPhnNumVerify = res.success
          this.commonService.loaderEnd()
          if (res.success) {
            this.hideOTPFieldBtns(3, 'Mobile');
            this.notifier.notify('success', res.message);
          } else {
            this.notifier.notify('error', res.message);
          }
        });
      } else {
        this.notifier.notify('error', this.translate.instant('Please enter OTP.'));
      }
    }
    else if (fieldSpc === 'Verify_Pan') {
      if (this.userName === '') {
        this.userNameErr = this.translate.instant('Please enter Name As Per Pan Card')
      }
      if (this.userPanNo === '') {
        this.panerr = this.translate.instant('Please enter Pan Card No')
      }
      if (this.userName !== '' && this.userPanNo !== '') {
        const data = {
          "reraid": this.commonService.getReraId(),
          "userid": null,
          "fieldid": 0,
          "stepid": 0,
          "groupid": 0,
          "groupposition": 0,
          "username": this.userName,
          "panno": this.userPanNo.toUpperCase(),
          "isRegistration": "true"
        };
        this.commonService.loaderShow();
        this.rest.verifyPAN(data).subscribe((res: any) => {
          this.commonService.loaderEnd();
          this.isPanVerify = res.success
          if (res.success) {
            this.notifier.notify('success', res.message);
            (<HTMLButtonElement>document.getElementById('Verify_Pan')).disabled = true;
          } else {
            this.notifier.notify('error', res.message);
          }
        });
      }
    }
  }


  hideOTPFieldBtns(sequence: number, fieldSpc: string) {
    if (fieldSpc === 'Email') {
      setTimeout(() => {
        (<HTMLButtonElement>document.getElementById('Verify_Email_Id')).disabled = true;
        (<HTMLInputElement>document.getElementById('Email_Verification_Code')).disabled = true;
        (<HTMLButtonElement>document.getElementById('Verify_Code_Email')).disabled = true;
        (<HTMLButtonElement>document.getElementById('Resend_Code_Email')).disabled = true;
        if (sequence === 1) {
          (<HTMLButtonElement>document.getElementById('Verify_Email_Id')).disabled = false;
        } else if (sequence === 2) {
          (<HTMLInputElement>document.getElementById('Email_Verification_Code')).disabled = false;
          (<HTMLButtonElement>document.getElementById('Verify_Code_Email')).disabled = false;
          this.selIntervals(sequence, fieldSpc);
        } else if (sequence === 3) {
          this.selIntervals(sequence, fieldSpc);
        }
      }, 1000);
    } else if (fieldSpc === 'Mobile') {
      setTimeout(() => {
        (<HTMLButtonElement>document.getElementById('Request_For_OTP_Mobile')).disabled = true;
        (<HTMLInputElement>document.getElementById('Enter_Mobile_OTP')).disabled = true;
        (<HTMLButtonElement>document.getElementById('Verify_OTP_Mobile')).disabled = true;
        (<HTMLButtonElement>document.getElementById('Resend_OTP_Mobile')).disabled = true;
        if (sequence === 1) {
          (<HTMLButtonElement>document.getElementById('Request_For_OTP_Mobile')).disabled = false;
        } else if (sequence === 2) {
          (<HTMLInputElement>document.getElementById('Enter_Mobile_OTP')).disabled = false;
          (<HTMLButtonElement>document.getElementById('Verify_OTP_Mobile')).disabled = false;
          this.selIntervals(sequence, fieldSpc);
        } else if (sequence === 3) {
          this.selIntervals(sequence, fieldSpc);
        }
      }, 1000);
    }
  }


  selIntervals(sequence: number, fieldSpc: string) {
    if (fieldSpc === 'Email') {
      if (this.timerIdForEmail) {
        clearInterval(this.timerIdForEmail);
      }
      var timeLeft: number;
      if (sequence === 3) {
        timeLeft = 0;
      } else {
        (<HTMLInputElement>document.getElementById('label_Resend_Code_Email')).innerText = this.translate.instant('Resend OTP in ') + ('0:59s');
        timeLeft = 58;
      }
      this.timerSequence = sequence;
      this.timerTimeLeft = timeLeft;
      this.timerFieldSpc = fieldSpc;
      this.timerIdForEmail = setInterval(() => { this.countdown(sequence, timeLeft, fieldSpc) }, 1000);
    } else if (fieldSpc === 'Mobile') {
      if (this.timerIdForMobile) {
        clearInterval(this.timerIdForMobile);
      }
      var timeLeft: number;
      if (sequence === 3) {
        timeLeft = 0;
      } else {
        (<HTMLInputElement>document.getElementById('label_Resend_OTP_Mobile')).innerText = this.translate.instant('Resend OTP in ') + ('0:59s');
        timeLeft = 58;
      }
      this.timerSequence = sequence;
      this.timerTimeLeft = timeLeft;
      this.timerFieldSpc = fieldSpc;
      this.timerIdForMobile = setInterval(() => { this.countdown(sequence, timeLeft, fieldSpc) }, 1000);
    }
  }


  countdown(sequence: number, timeLeft: number, fieldSpc: string) {
    if (this.timerFieldSpc === 'Email') {
      if (this.timerSequence === 3) {
        this.timerTimeLeft = 0;
        (<HTMLInputElement>document.getElementById('label_Resend_Code_Email')).innerHTML = '&nbsp;';
        (<HTMLInputElement>document.getElementById('Email_ID')).disabled = true;
        clearTimeout(this.timerIdForEmail);
      }
       else {
        if (this.timerTimeLeft === 0) {
          (<HTMLButtonElement>document.getElementById('Resend_Code_Email')).disabled = false;
          (<HTMLInputElement>document.getElementById('label_Resend_Code_Email')).innerHTML = '&nbsp;';
          clearTimeout(this.timerIdForEmail);
        } else {
          if (this.timerTimeLeft >= 10) {
            (<HTMLInputElement>document.getElementById('label_Resend_Code_Email')).innerText = this.translate.instant('Resend OTP in ') + ('0:') + this.timerTimeLeft + 's';
          } else {
            (<HTMLInputElement>document.getElementById('label_Resend_Code_Email')).innerText = this.translate.instant('Resend OTP in ') + ('0:0') + this.timerTimeLeft + 's';
          }
          this.timerTimeLeft--;
        }
      }
    } else if (this.timerFieldSpc === 'Mobile') {
      if (this.timerSequence === 3) {
        this.timerTimeLeft = 0;
        (<HTMLInputElement>document.getElementById('label_Resend_OTP_Mobile')).innerHTML = '&nbsp;';
        (<HTMLInputElement>document.getElementById('Mobile_Number')).disabled = true;
        clearTimeout(this.timerIdForMobile);
      } else {
        if (this.timerTimeLeft === 0) {
          (<HTMLButtonElement>document.getElementById('Resend_OTP_Mobile')).disabled = false;
          (<HTMLInputElement>document.getElementById('label_Resend_OTP_Mobile')).innerHTML = '&nbsp;';
          clearTimeout(this.timerIdForMobile);
        } else {
          if (this.timerTimeLeft >= 10) {
            (<HTMLInputElement>document.getElementById('label_Resend_OTP_Mobile')).innerText = this.translate.instant('Resend OTP in ') + ('0:') + this.timerTimeLeft + 's';
          } else {
            (<HTMLInputElement>document.getElementById('label_Resend_OTP_Mobile')).innerText = this.translate.instant('Resend OTP in ') + ('0:0') + this.timerTimeLeft + 's';
          }
          this.timerTimeLeft--;
        }
      }
    }
  }


  check(){
    if(this.previousUserEmail !== this.userEmail && this.isSuccess === true){
      this.hideOTPFieldBtns(1,'Email')
      this.timerSequence = 2;
      this.timerTimeLeft = 0;
      this.timerFieldSpc = 'Email';
      this.countdown(2,0,'Email')
    } else if(this.previousUsrMobile !== this.userMobileNo && this.ismobsuccess === true){
      this.hideOTPFieldBtns(1,'Mobile')
      this.timerSequence = 2;
      this.timerTimeLeft = 0;
      this.timerFieldSpc = 'Mobile';
      this.countdown(2,0,'Mobile')
    } else{
      console.log("Match")
    }
  }

  inserDataForm() {
    let fieldvalue = [this.userName, this.userPanNo, this.userEmail, this.userMobileNo]
    let fieldid
    let verify
    let success
    for (let i = 0; i < fieldvalue.length; i++) {
      if (this.selectedPromotorType == 1) {
        console.log(">>>>>", this.selectedPromotorType)
        if (fieldvalue[i] === this.userName) {
          fieldid = 1
          verify = 0
        }
        else if (fieldvalue[i] === this.userPanNo) {
          fieldid = 35
          verify = 1
        }
        else if (fieldvalue[i] === this.userEmail) {
          fieldid = 22
          verify = 1
        }
        else if (fieldvalue[i] === this.userMobileNo) {
          fieldid = 231
          verify = 1
        }
      } else if (this.selectedPromotorType == 2) {
        console.log(">>>>>", this.selectedPromotorType)
        if (fieldvalue[i] === this.userName) {
          fieldid = 101
          verify = 0
        }
        else if (fieldvalue[i] === this.userPanNo) {
          fieldid = 119
          verify = 1
        }
        else if (fieldvalue[i] === this.userEmail) {
          fieldid = 116
          verify = 1
        }
        else if (fieldvalue[i] === this.userMobileNo) {
          fieldid = 231
          verify = 1
        }
      } else if (this.selectedPromotorType == 3) {
        console.log(">>>>>", this.selectedPromotorType)
        if (fieldvalue[i] === this.userName) {
          fieldid = 143
          verify = 0
        }
        else if (fieldvalue[i] === this.userPanNo) {
          fieldid = 149
          verify = 1
        }
        else if (fieldvalue[i] === this.userEmail) {
          fieldid = 22
          verify = 1
        }
        else if (fieldvalue[i] === this.userMobileNo) {
          fieldid = 231
          verify = 1
        }
      } else if (this.selectedPromotorType == 4) {
        console.log(">>>>>", this.selectedPromotorType)
        if (fieldvalue[i] === this.userName) {
          fieldid = 154
          verify = 0
        }
        else if (fieldvalue[i] === this.userPanNo) {
          fieldid = 161
          verify = 1
        }
        else if (fieldvalue[i] === this.userEmail) {
          fieldid = 22
          verify = 1
        }
        else if (fieldvalue[i] === this.userMobileNo) {
          fieldid = 231
          verify = 1
        }
      } else if (this.selectedPromotorType == 5) {
        console.log(">>>>>", this.selectedPromotorType)
        if (fieldvalue[i] === this.userName) {
          fieldid = 143
          verify = 0
        }
        else if (fieldvalue[i] === this.userPanNo) {
          fieldid = 149
          verify = 1
        }
        else if (fieldvalue[i] === this.userEmail) {
          fieldid = 22
          verify = 1
        }
        else if (fieldvalue[i] === this.userMobileNo) {
          fieldid = 231
          verify = 1
        }
      } else if (this.selectedPromotorType == 6) {
        console.log(">>>>>", this.selectedPromotorType)
        if (fieldvalue[i] === this.userName) {
          fieldid = 178
          verify = 0
        }
        else if (fieldvalue[i] === this.userPanNo) {
          fieldid = 184
          verify = 1
        }
        else if (fieldvalue[i] === this.userEmail) {
          fieldid = 182
          verify = 1
        }
        else if (fieldvalue[i] === this.userMobileNo) {
          fieldid = 231
          verify = 1
        }
      } else if (this.selectedPromotorType == 7) {
        console.log(">>>>>", this.selectedPromotorType)
        if (fieldvalue[i] === this.userName) {
          fieldid = 191
          verify = 0
        }
        else if (fieldvalue[i] === this.userPanNo) {
          fieldid = 198
          verify = 1
        }
        else if (fieldvalue[i] === this.userEmail) {
          fieldid = 22
          verify = 1
        }
        else if (fieldvalue[i] === this.userMobileNo) {
          fieldid = 231
          verify = 1
        }
      } else if (this.selectedPromotorType == 8) {
        console.log(">>>>>", this.selectedPromotorType)
        if (fieldvalue[i] === this.userName) {
          fieldid = 204
          verify = 0
        }
        else if (fieldvalue[i] === this.userPanNo) {
          fieldid = 211
          verify = 1
        }
        else if (fieldvalue[i] === this.userEmail) {
          fieldid = 22
          verify = 1
        }
        else if (fieldvalue[i] === this.userMobileNo) {
          fieldid = 231
          verify = 1
        }
      } else if (this.selectedPromotorType == 9) {
        console.log(">>>>>", this.selectedPromotorType)
        if (fieldvalue[i] === this.userName) {
          fieldid = 217
          verify = 0
        }
        else if (fieldvalue[i] === this.userPanNo) {
          fieldid = 224
          verify = 1
        }
        else if (fieldvalue[i] === this.userEmail) {
          fieldid = 22
          verify = 1
        }
        else if (fieldvalue[i] === this.userMobileNo) {
          fieldid = 231
          verify = 1
        }
      }

      const data = {
        userid: sessionStorage.getItem('userid'),
        stepid: 9,
        fieldid: fieldid,
        fieldvalue: fieldvalue[i],
        isverified: verify
      }
      console.log(JSON.stringify(data))
      this.rest.storeUserInfo(data).subscribe((res: any) => {
        if (res.success) {
          success = true
        } else {
          success = false
          this.notifier.notify('error', res.message);
        }
      });
    }
  }





}
