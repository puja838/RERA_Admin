import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {ConfigService} from "../../services/config.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-project-extension-dtl',
  templateUrl: './project-extension-dtl.component.html',
  styleUrls: ['./project-extension-dtl.component.css']
})
export class ProjectExtensionDtlComponent implements OnInit {
  FILE_URL = '';
  projectId = 0;
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
  extensionId = 0;
  buildingList: any = [];
  constructionProgressList: any = [];
  commonAmenities: any = [];
  selectedBuilding = '';
  isSubmitted = false;
  documentList: any = [];
  FILE_ROOT = '';
  otherDocuments: any = [{
    documentname: '',
    reason: '',
    docfile: ''
  }];
  isCheck = false;
  signatureImg = '';
  isPaymentComplete = false;
  constructor(private router: Router, private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
              private notifier: NotifierService, private config: ConfigService, private modalService: NgbModal) {
    this.FILE_URL = this.rest.FILE_URL;
    this.FILE_ROOT = this.rest.FILE_ROOT;
  }

  ngOnInit(): void {
    this.name = this.common.getUserName();
    this.projectId = Number(this.activeRoute.snapshot.paramMap.get('projectId'));
    this.projectuid = this.activeRoute.snapshot.paramMap.get('projectuid');
    this.extensionId = Number(this.activeRoute.snapshot.paramMap.get('extensionid'));
    this.generateProjectExtensionId();
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
      projectstatus: 'Ongoing',
      userid: this.common.getUserId(),
      extensionid: this.extensionId
    };
    this.rest.generateProjectExtensionId(data).subscribe((res: any) => {
      if (res.success) {
        this.extensionId = res.response.id;
        this.isSubmitted = res.response.submitted === 1;
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

  saveExtensionInfo(): any {
    if (this.targetCompletionDate === '') {
      this.notifier.notify('error', 'Target Completion date is required');
      return false;
    }
    if (this.likelyCompletionDate === '') {
      this.notifier.notify('error', 'Likely Completion date is required');
      return false;
    }
    if (this.isForceMajeure === 'Yes') {
      if (this.forceMajeure === '' || this.forceMajeureImpact === '' || this.forceMajeureDays === '') {
        this.notifier.notify('error', 'Enter the details of force majeure');
        return false;
      }
    }
    if (this.projectExtensionPeriod === '') {
      this.notifier.notify('error', 'Project extension period is required is required');
      return false;
    }
    const data = {
      completiondate: this.targetCompletionDate,
      likelycompletiondate: this.likelyCompletionDate,
      delayreason: this.delayReason,
      isforcemajeure: this.isForceMajeure,
      forcemajeuredesc: this.forceMajeure,
      forcemajeureimpact: this.forceMajeureImpact,
      forcemajeureperiod: this.forceMajeureDays,
      projectextexsionperiod: this.projectExtensionPeriod,
      extensionid: this.extensionId,
      projectid: this.projectId,
      userid: this.common.getUserId()
    };
    this.rest.saveProjectExtensionInfo(data).subscribe((res: any) => {
      if (res.success) {
        this.goToNext();
        this.notifier.notify('success', res.message);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {})
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
    this.common.loaderShow();
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
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
    this.common.loaderShow();
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      projectid: this.projectId,
      extensionid: this.extensionId,
      groupid: buildingDtl.groupid,
      fieldid: buildingDtl.fieldid,
      groupposition: buildingDtl.groupposition + '',
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

  submitConstructionData(flag: string = '') {
    let err = 0;
    for (const obj of this.constructionProgressList) {
      obj.perErr = '';
      obj.resonErr = '';
      obj.cmpdErr = '';
      if (obj.work_done !== '' && Number(obj.work_done) > 100) {
        obj.perErr = 'wrongval';
        err++;
      }
      if (!obj.isDisable && (obj.estimate_completion === '')) {
        // obj.resonErr = 'wrongval';
        obj.cmpdErr = 'wrongval';
        err++;
      }
    }
    if (err > 0) {
      this.notifier.notify('error', 'Wrong input');
    } else {
      const data = {
        reraid: this.common.getReraId(),
        userid: this.common.getUserId(),
        projectid: this.projectId,
        extensionid: this.extensionId,
        progressData: this.constructionProgressList,
        type: 'construct'
      };
      this.common.loaderShow();
      this.rest.upsertDevelopmentPlan(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', res.message);
          if (flag === 'next') {
            this.devTabIndex += 1;
          }
        } else {
          this.notifier.notify('success', res.message);
        }
      });
    }
  }

  getAmenitiesDetails() {
    this.common.loaderShow();
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
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

  submitAmenitiesData(flag: string = '') {
    let err = 0;
    for (const obj of this.commonAmenities) {
      obj.perErr = '';
      obj.resonErr = '';
      obj.cmpdErr = '';
      if (obj.work_done !== '' && Number(obj.work_done) > 100) {
        obj.perErr = 'wrongval';
        err++;
      }
      if (!obj.isDisable && (obj.estimate_completion === '')) {
        // obj.resonErr = 'wrongval';
        obj.cmpdErr = 'wrongval';
        err++;
      }
    }
    if (err > 0) {
      this.notifier.notify('error', 'Wrong input');
    } else {
      const data = {
        reraid: this.common.getReraId(),
        userid: this.common.getUserId(),
        projectid: this.projectId,
        extensionid: this.extensionId,
        progressData: this.commonAmenities,
        type: 'amenity'
      };
      this.common.loaderShow();
      this.rest.upsertDevelopmentPlan(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', res.message);
          if (flag === 'next') {
            this.selectedTabIndex += 1;
          }
        } else {
          this.notifier.notify('success', res.message);
        }
      });
    }
  }

  onCustomDateSelect(event: any, fieldObj: any) {
    fieldObj.estimate_completion   = event;
  }

  getDocuments() {
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      projectid: this.projectId,
      extensionid: this.extensionId
    };
    this.common.loaderShow();
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

  uploadDocument(event: any, obj: any = null) {
    if (event.target.files.length > 0) {
      const fd = new FormData();
      fd.append('file', event.target.files[0]);
      this.rest.uploadFile(fd).subscribe((res: any) => {
        if (res.success) {
          if(obj) {
            obj.docfile = res.response.fileName;
          } else {
            this.signatureImg = res.response.fileName;
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      })
    }
  }

  submitDocumentData(flag: string = ''): any {
    for(const obj of this.documentList) {
      if(obj.issuingoffice === '' || obj.issuedate === '' || obj.validitydate === '' || obj.docfile === '') {
        this.notifier.notify('error', 'All (*) fields are mandatory');
        return false;
      }
    }
    for(const obj of this.otherDocuments) {
      if(obj.documentname === '' || obj.docfile === '') {
        this.notifier.notify('error', 'All (*) fields are mandatory');
        return false;
      }
    }
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      projectid: this.projectId,
      extensionid: this.extensionId,
      docList: this.documentList,
      otherDocList: this.otherDocuments
    };
    this.common.loaderShow();
    this.rest.upsertDocumentData(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (flag === 'next') {
          this.selectedTabIndex += 1;
        }
        this.notifier.notify('success', res.message);
      }
    });
  }

  openLink(file: any) {
    window.open(this.FILE_ROOT + file, '_blank');
  }

  removeImage(obj: any) {
    obj.docfile = '';
  }

  removeDoc(pos: number) {
    if (this.otherDocuments.length > 0) {
      if (this.otherDocuments[pos].documentid) {
        this.rest.deleteOtherDocData({documentid: this.otherDocuments[pos].documentid}).subscribe((res: any) => {
          if(res.success) {
            this.otherDocuments.splice(pos, 1);
          } else {
            this.notifier.notify('error', res.message);
          }
        })
      } else {
        this.otherDocuments.splice(pos, 1);
      }
    }
  }

  addMoreOtherDocument() {
    this.otherDocuments.push({
      documentname: '',
      reason: '',
      docfile: ''
    });
  }

  submitForExtension(): any {
    if (!this.isCheck) {
      this.notifier.notify('error', 'You have not accept the declaration');
      return false;
    }
    if (this.signatureImg === '') {
      this.notifier.notify('error', 'Upload your signature.');
      return false;
    }
    const data = {
      signature: this.signatureImg,
      ischeck: this.isCheck,
      extensionid: this.extensionId,
      projectid: this.projectId,
      userid: this.common.getUserId(),
      time: this.common.formatDate(new Date(), 1)
    };
    this.common.loaderShow();
    this.rest.submitForExtension(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.moveWorkflow();
        this.isSubmitted = true;
        this.notifier.notify('success', res.message);
      } else {
        this.notifier.notify('success', res.message);
      }
    })
  }

  moveWorkflow() {
    const data = {
      reraid: this.common.getReraId(),
      uniquepromoterid: this.common.getUserId(),
      uniqueprojectid: this.projectId,
      fromstepid: -1,
      forwardflg: 1,
      userid: this.common.getUserId(),
      workflowtype: 2,
      extensionid: this.extensionId
    };
    this.rest.moveWorkflow(data).subscribe((res: any) => {
      if (res.success) {
      }
    });
  }


}
