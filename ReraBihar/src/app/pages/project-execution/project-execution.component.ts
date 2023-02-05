import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifierService} from "angular-notifier";
import {ProjectConfService} from "../project-conf.service";

@Component({
  selector: 'app-project-execution',
  templateUrl: './project-execution.component.html',
  styleUrls: ['./project-execution.component.css']
})
export class ProjectExecutionComponent implements OnInit {
  name = '';
  projectId = 0;
  isComplete = 0;
  projectuid: any = '';
  stepList: any = [];
  formDetailsList: any = [];
  selectedBuildingInfo: any = [];
  selectedTabIndex = 0;
  selectedBuilding = '';
  projectDetails: any = {
    projectuid: '',
    projectName: '',
    projectAddress: '',
    promoterName: '',
    copromoterName: '',
    validatyenddate: '',
    projectStartDate: '',
    projectType: '',
    periodOfValidityDate: ''
  };
  pendingQuoterList: any = [];
  submittedQuoterList: any = [];
  constructor(private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
              private modalService: NgbModal, private notifier: NotifierService, private router: Router,
              private projectConf: ProjectConfService) {
  }

  ngOnInit(): void {
    this.name = this.common.getUserName();
    this.projectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
    this.isComplete = Number(this.activeRoute.snapshot.paramMap.get('isComplete'));
    this.projectuid = this.activeRoute.snapshot.paramMap.get('projectuid');
    this.getProjectDetail();
    this.getPendingQuoterList();
    this.getSubmittedQuoterList();
  }

  goToProfile(): void {
    this.router.navigate(['/pages/profile-details'])
  }

  goToProjectExecutionDtl(obj: any): void {
    const quoterName = obj.quoterName + ' ' + obj.quoterenddate.split('-')[0]
    this.router.navigate(['/pages/project-execution-details/' + this.projectId + '/' + this.projectuid + '/' + obj.id + '/' + quoterName])
  }

  goToProjectDetails(): void {
    this.router.navigate([])
        .then((result: any) => {
          window.open(this.rest.BASE_PATH + 'pages/project-details/' + this.projectId + '/' + this.isComplete + '/' + this.projectuid, '_blank');
        })
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  getProjectDetail() {
    this.common.loaderShow();
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId(),
      projectid: this.projectId
    };
    this.rest.getProjectDetail(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (res.response.validatyenddate) {
          res.response.validatyenddate = this.common.formatDate(res.response.validatyenddate);
        }
        this.projectDetails = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd()
    });
  }

  getPendingQuoterList() {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId(),
      projectid: this.projectId
    };
    this.rest.getPendingQuoterList(data).subscribe((res: any) => {
      if (res.success) {
        for (const obj of res.response) {
          obj.quoterenddate = this.common.formatDate(obj.quoterenddate);
          obj.delayedDays = this.common.subDates(obj.quoterenddate);
          obj.delayedDays <= 0 ? 0 : obj.delayedDays;
        }
        this.pendingQuoterList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd()
    });
  }

  getSubmittedQuoterList() {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId(),
      projectid: this.projectId
    };
    this.rest.getSubmittedQuoterList(data).subscribe((res: any) => {
      if (res.success) {
        for (const obj of res.response) {
          obj.submitteddate = this.common.formatDate(obj.submitteddate);
          obj.delayedDays = this.common.subDates(obj.quoterenddate, obj.submitteddate);
          obj.delayedDays <= 0 ? 0 : obj.delayedDays;
        }
        this.submittedQuoterList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd()
    });
  }

}
