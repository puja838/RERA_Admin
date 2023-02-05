import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { Router } from '@angular/router';
@Component({
  selector: 'app-preview-details',
  templateUrl: './preview-details.component.html',
  styleUrls: ['./preview-details.component.css']
})
export class PreviewDetailsComponent implements OnInit {
  isComplete = 0
  formDetails: any;
  stepList: any = [];
  stepListShow: any = [];
  entytyType = '';
  entytyType1: any;
  isSubmitted = false;
  stateName: any = [];
  stateList: any = [];
  cityName: any = [];
  loginUserAddress: any = ''
  backupDetails: any = [];
  FILE_ROOT = '';
  isAccept: boolean = true
  signatureImg = '';
  paymentAmount = 10000;
  disablefieldsidlist: any = ['Enter_Aadhaar_OTP', 'Enter_Mobile_Otp', 'Enter_Mobile_Otp_Proprietor']
  constructor(private common: CommonService, private rest: RestApiService, public print: NgxPrintElementService, private router: Router) {
    this.FILE_ROOT = this.rest.FILE_ROOT;
  }

  ngOnInit(): void {
    if (this.common.getEntityTypeId() == 1) {
      this.paymentAmount = 10000;
    } else {
      this.paymentAmount = 50000;
    }


    this.stepListShow = this.common.stepListShow;

    this.formDetails = this.common.formDetails;
    setTimeout(()=>{
this.hiddenFieldList(this.disablefieldsidlist)
    })
    
    this.signatureImg = this.common.signatureImg


    
    if (this.stepListShow.length == 0 && this.formDetails.length == 0) {
      history.back()

    }
  }

  hiddenFieldList(fieldList:any) {
   
    for (const field of fieldList) {
      try {
        const elems: any = document.querySelectorAll('[id^="' + field + '"]');
        for (let i = 0; i < elems.length; i++) {
          elems[i].hidden = true;
        }
      } catch (e) { }
    }
  }

  openLink(file: any) {
    window.open(this.FILE_ROOT + file, '_blank');
  }

  back() {
    history.back()
  }
}
