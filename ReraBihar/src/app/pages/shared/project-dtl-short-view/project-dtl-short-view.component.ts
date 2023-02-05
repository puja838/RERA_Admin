import {Component, Input, OnInit} from '@angular/core';
import {RestApiService} from "../../../services/rest-api.service";
import {CommonService} from "../../../services/common.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifierService} from "angular-notifier";
import {ProjectConfService} from "../../project-conf.service";

@Component({
  selector: 'app-project-dtl-short-view',
  templateUrl: './project-dtl-short-view.component.html',
  styleUrls: ['./project-dtl-short-view.component.css']
})
export class ProjectDtlShortViewComponent implements OnInit {
  @Input() projectId = 0;
  @Input() projectuid = '';
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
  constructor(private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
              private modalService: NgbModal, private notifier: NotifierService, private router: Router) {
  }

  ngOnInit(): void {
    this.getProjectDetail();
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

  goToProjectDetails(): void {
    this.router.navigate([])
        .then((result: any) => {
          window.open('/rera-app/#/pages/project-details/' + this.projectId + '/1/' + this.projectuid, '_blank');
        })
  }

}
