import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-project-entesion-dtl',
  templateUrl: './project-entesion-dtl.component.html',
  styleUrls: ['./project-entesion-dtl.component.css']
})
export class ProjectEntesionDtlComponent implements OnInit, OnChanges {

  FILE_URL = '';
  @Input() projectId = 0;
  @Input() userId = 0;
  projectuid: any = '';
  name = '';
  selectedTabIndex = 0;
  devTabIndex = 0;
  isForceMajeure = 'No';
  projectExtensionPeriod = '';
  targetCompletionDate = '';
  delayReason = '';
  likelyCompletionDate = '';
  forceMajeure = '';
  forceMajeureImpact = '';
  forceMajeureDays = '';
  extensionId = '';
  buildingList: any = [];
  constructionProgressList: any = [];
  commonAmenities: any = [];
  selectedBuilding = '';
  isSubmitted = true;
  documentList: any = [];
  FILE_ROOT = '';
  otherDocuments: any = [{
    documentname: '',
    reason: '',
    docfile: ''
  }];
  isCheck = false;
  signatureImg = '';
  isPaymentComplete = true;
  constructor(private router: Router, private rest: RestApiService, private common: CommonService) {
    this.FILE_ROOT = this.rest.FILE_ROOT;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (this.projectId !== 0) {
      this.generateProjectExtensionId();
    }
  }

  onlyNumber(event: any): boolean {
    if (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) || event.keyCode == 8 || event.keyCode == 190 || event.keyCode == 110) {
      return true;
    } else {
      return false;
    }
  }

  goToProfile(): void {
    this.router.navigate(['/pages/profile-details'])
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  generateProjectExtensionId() {
    const data = {
      reraid: this.common.getReraId(),
      projectid: this.projectId,
      projectstatus: 'Ongoing'
    };
    this.rest.generateProjectExtensionId(data).subscribe((res: any) => {
      if (res.success) {
        this.extensionId = res.response.id;
        // this.isSubmitted = res.response.submitted === 1;
        this.isPaymentComplete = res.response.ispaymentcomplete === 1;
        this.signatureImg = res.response.signature ? res.response.signature : '';
        if (res.response.type === undefined) {
          this.targetCompletionDate = res.response.completiondate ? this.common.formatDate(res.response.completiondate) : '';
          this.likelyCompletionDate = res.response.likelycompletiondate ? this.common.formatDate(res.response.likelycompletiondate) : '';
          this.delayReason = res.response.delayreason ? res.response.delayreason : '';
          this.isForceMajeure = res.response.isforcemajeure ? res.response.isforcemajeure : 'No';
          this.forceMajeure = res.response.forcemajeuredesc ? res.response.forcemajeuredesc : '';
          this.forceMajeureImpact = res.response.forcemajeureimpact ? res.response.forcemajeureimpact : '';
          this.forceMajeureDays = res.response.forcemajeureperiod ? res.response.forcemajeureperiod : '';
          this.projectExtensionPeriod = res.response.projectextexsionperiod ? this.common.formatDate(res.response.projectextexsionperiod) : '';
        }
      }
    });
  }

  onTabChange(event: any) {
    if (event.index === 1) {
      this.getBuildingListOfProject();
    } else if (event.index === 2) {
      this.getDocuments();
    }
  }

  onDevTabChange(event: any) {
    if (event.index === 1) {
      this.getAmenitiesDetails();
    }
  }

  goToPrevTab(): void {
    this.selectedTabIndex -= 1;
  }

  goToPrevDevTab(): void {
    this.devTabIndex = 0;
  }

  goToNextDevTab(): void {
    this.devTabIndex = 1;
  }

  goToNext() {
    this.selectedTabIndex += 1;
  }

  getBuildingListOfProject(): any {
    this.common.loaderStart();
    const data = {
      reraid: this.common.getReraId(),
      userid: this.userId,
      projectid: this.projectId
    };
    this.rest.getBuildingListOfProject(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.buildingList = res.response;
        if (this.buildingList.length > 0) {
          this.selectedBuilding = this.buildingList[0].buildingName;
          this.getDevelopmentPlan(this.buildingList[0]);
        }
      }
    })
  }

  onBuildingChange(building: any) {
    this.getDevelopmentPlan(building);
  }

  getDevelopmentPlan(buildingDtl: any) {
    this.common.loaderStart();
    const data = {
      reraid: this.common.getReraId(),
      userid: this.userId,
      projectid: this.projectId,
      extensionid: this.extensionId,
      groupid: buildingDtl.groupid,
      fieldid: buildingDtl.fieldid,
      groupposition: buildingDtl.groupposition,
      type: 'construct'
    };
    this.rest.getDevelopmentPlan(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        for (const obj of res.response) {
          // obj.isDisable = this.common.isDateMaxThanToday(obj.enddate, 0);
          obj.perErr = '';
          obj.isDisable = false;
          obj.resonErr = '';
          obj.cmpdErr = '';
        }
        this.constructionProgressList = res.response;
      }
    })
  }


  getAmenitiesDetails() {
    this.common.loaderStart();
    const data = {
      reraid: this.common.getReraId(),
      userid: this.userId,
      projectid: this.projectId,
      extensionid: this.extensionId,
      groupid: '',
      fieldid: '',
      groupposition: '',
      type: 'amenity'
    };
    this.rest.getDevelopmentPlan(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        for (const obj of res.response) {
          obj.isDisable = false;
          obj.perErr = '';
          obj.resonErr = '';
          obj.cmpdErr = '';
        }
        this.commonAmenities = res.response;
      }
    })
  }



  onCustomDateSelect(event: any, fieldObj: any) {
    fieldObj.estimate_completion   = event;
  }

  getDocuments() {
    const data = {
      reraid: this.common.getReraId(),
      userid: this.userId,
      projectid: this.projectId,
      extensionid: this.extensionId
    };
    this.common.loaderStart();
    this.rest.getDocuments(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        for (const obj of res.response.docList) {
          obj.issuedate = this.common.formatDate(obj.issuedate);
          obj.validitydate = this.common.formatDate(obj.validitydate);
        }
        this.documentList = res.response.docList;
        this.otherDocuments = res.response.otherDocList;
      }
    })
  }

  openLink(file: any) {
    window.open(this.FILE_ROOT + file, '_blank');
  }

}
