import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectListService} from "../../services/project-list.service";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";

@Component({
  selector: 'app-project-list-dashboard',
  templateUrl: './project-list-dashboard.component.html',
  styleUrls: ['./project-list-dashboard.component.css']
})
export class ProjectListDashboardComponent implements OnInit {
  listData: any;
  rolename: any;
  roletype: any = '';
  rejection: string = '';
  daysSubmit = 21;
  fontColor = '';
  selectStatus = 0;
  selectStatus1 = 0;
  statusType = [{'isapproved': 0, 'statusName': 'Under Scrutiny'}, {
    'isapproved': 1,
    'statusName': 'Chairman Approved'
  }, {'isapproved': 2, 'statusName': 'Chairman Rejected'}, {
    'isapproved': 3,
    'statusName': 'HOR Approved'
  }, {'isapproved': 4, 'statusName': 'HOR Rejected'}];
  statusType1 = [{'isapproved': 0, 'statusName': 'Under Scrutiny'}, {'isapproved': 3, 'statusName': 'HOR Approved'}];
  @ViewChild('modal') modal: any;
  workflowtype: number = 1;
  regcount: number = 0;
  extcount: number = 0;
  agentcount: number = 0;
  regprojcount: number = 0
  regusrcount: number = 0
  pendingqprscount: number = 0;
  regproquacount: number = 0;
  regagentquacount: number = 0;
  isProfile: any = 'none';
  totalrevenue: number = 0;
  totalrevenuequater: number = 0;
  agentRenewalCount: number = 0;

  constructor(private notifier: NotifierService, private route: Router, private modalService: NgbModal,
              private apiService: ProjectListService, private common: CommonService,) {
  }

  ngOnInit(): void {
    sessionStorage.removeItem('pid');
    sessionStorage.removeItem('eid');
    sessionStorage.removeItem('aid');
    this.rolename = this.common.getRolename();
    this.roletype = this.common.getRoletype();
    this.common.setWorkflowType(this.workflowtype);
    this.fetchProjectDetailsForUserCount(1).then((res: any) => {
      if (res.success) {
        this.regcount = res.response.total;
      } else {
        this.notifier.notify('error', res.message);
      }
    });
    this.fetchProjectDetailsForUserCount(2).then((res: any) => {
      if (res.success) {
        this.extcount = res.response.total;
      } else {
        this.notifier.notify('error', res.message);
      }
    });
    this.fetchProjectDetailsForUserCount(3).then((res: any) => {
      if (res.success) {
        this.agentcount = res.response.total;
      } else {
        this.notifier.notify('error', res.message);
      }
    });
    this.fetchProjectDetailsForUserCount(4).then((res: any) => {
      if (res.success) {
        this.agentRenewalCount = res.response.total;
      } else {
        this.notifier.notify('error', res.message);
      }
    });
    if (this.roletype != 7 && this.roletype != 4) {
      this.fetchProjectRegisterCount(4).then((res: any) => {
        if (res.success) {
          this.regprojcount = res.response.total;
        } else {
          this.notifier.notify('error', res.message);
        }
      });

      this.fetchProjectRegisterCount(5).then((res: any) => {
        if (res.success) {
          this.regusrcount = res.response.total;
        } else {
          this.notifier.notify('error', res.message);
        }
      });

      this.fetchProjectRegisterCount(6).then((res: any) => {
        if (res.success) {
          this.pendingqprscount = res.response.total;
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    }

    if (this.roletype != 7 && this.roletype != 2 && this.roletype != 5 && this.roletype != 4) {
      this.fetchProjectRegisterCount(7).then((res: any) => {
        if (res.success) {
          this.regproquacount = res.response.total;
        } else {
          this.notifier.notify('error', res.message);
        }
      });
      this.fetchProjectRegisterCount(8).then((res: any) => {
        if (res.success) {
          this.regagentquacount = res.response.total;
        } else {
          this.notifier.notify('error', res.message);
        }
      });

      this.fetchRevenue(1).then((res: any) => {
        if (res.success) {
          this.totalrevenue = res.response.total;
        } else {
          this.notifier.notify('error', res.message);
        }
      });
      this.fetchRevenue(2).then((res: any) => {
        if (res.success) {
          this.totalrevenuequater = res.response.total;
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    }
  }


  fetchProjectDetailsForUserCount(type: number) {
    let promise = new Promise((resolve, reject) => {
      const data = {
        reraid: this.common.getReraId(),
        roleid: this.common.getRoleId(),
        userid: this.common.getUserId(),
        // status: this.selectStatus1,
        type: type
      };
      this.common.loaderStart();
      this.apiService.fetchProjectDetailsForUserCount(data).subscribe((res: any) => {
        this.common.loaderEnd();
        resolve(res)
      }, (err: any) => {
        this.common.loaderEnd();
        reject()
      })
    });
    return promise;
  }

  fetchProjectRegisterCount(type: number) {
    let promise = new Promise((resolve, reject) => {
      const data = {
        reraid: this.common.getReraId(),
        roleid: this.common.getRoleId(),
        userid: this.common.getUserId(),
        // status: this.selectStatus1,
        type: type
      };
      this.common.loaderStart();
      this.apiService.fetchProjectRegisterCount(data).subscribe((res: any) => {
        this.common.loaderEnd();
        resolve(res)
      }, (err: any) => {
        this.common.loaderEnd();
        reject()
      })
    });
    return promise;
  }


  fetchRevenue(type: number) {
    let promise = new Promise((resolve, reject) => {
      const data = {
        reraid: this.common.getReraId(),
        roleid: this.common.getRoleId(),
        userid: this.common.getUserId(),
        // status: this.selectStatus1,
        type: type
      };
      this.common.loaderStart();
      this.apiService.fetchRevenue(data).subscribe((res: any) => {
        this.common.loaderEnd();
        resolve(res)
      }, (err: any) => {
        this.common.loaderEnd();
        reject()
      })
    });
    return promise;
  }

  changeRouting(type: number) {
    this.workflowtype = type;
    this.common.setWorkflowType(this.workflowtype);
    this.route.navigate(['/user/projectList']);
  }

  changeRoute(type: number) {
    this.common.setTileType(type);
    console.log(type)
    this.route.navigate(['/user/registerProjectList']);
  }

  profileDetail() {
    if (this.isProfile === 'none') {
      this.isProfile = 'block'
    } else {
      this.isProfile = 'none'
    }
  }

}
