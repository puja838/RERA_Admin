import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { RestApiService } from "../../../services/rest-api.service";
import { CommonService } from "../../../services/common.service";
import { NotifierService } from "angular-notifier";
import { ConfigService } from "../../../services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  FILE_URL = '';
  name = '';
  expDate = '';
  regNo = '';
  newProjectList: any = [];
  queryCount = 0;
  certificate: any = ''
  renualCount = 0;
  constructor(private router: Router, private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
    private notifier: NotifierService, private config: ConfigService, private modalService: NgbModal) {
    this.FILE_URL = this.rest.FILE_URL;
  }

  ngOnInit(): void {
    this.name = this.common.getUserName();
    this.getAgentDashboardData();
    this.getNewLunchedProjects();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  goToLogin(type: any) {
    this.common.setCaroselType(type)
    window.open('/');
  }

  goToProfile(type: any) {
    if (type == 'profile') {
      this.router.navigate(['/pages/agent-registration-application'])
    } else if(type == 'renewal') {
      this.router.navigate(['/pages/agent-registration-application'], { queryParams: { type:'renewal' } })
    }
  }

  goToQuery() {
    this.router.navigate(['/pages/queryDashboard'])
  }

  goToAlert() {
    this.router.navigate(['/pages/alert-notification-view'])
  }

  goToProject(projectuid: any) {
    let path = window.location.href.split('pages');
    let link = path[0] + 'searchProject/' + projectuid
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });
  }

  getAgentDashboardData() {
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId()
    };
    this.common.loaderStart();
    this.rest.getAgentDashboardData(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.expDate = this.common.formatDate(res.response.validityenddate)
        if (res.response.registrationno) {
          this.regNo = res.response.registrationno;
          this.certificate = res.response.certificate;
          this.queryCount = res.response.queryCount ? res.response.queryCount : 0;
          this.renualCount = res.response.renualCount ? res.response.renualCount : 0;
          this.renualCount = Number(this.renualCount) + Number(this.queryCount)
        }
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getNewLunchedProjects() {
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      limit: 10,
      offset: '0'
    };
    this.rest.getNewLunchedProjects(data).subscribe((res: any) => {
      if (res.success) {
        this.newProjectList = res.response;
      }
    }, (err: any) => { })
  }

  downloadCertificate(file: string) {
    // console.log(file)
    // console.log(this.config.CRT_ROOT + file)
    window.open(this.config.CRT_ROOT + file, '_blank');
  }
}
