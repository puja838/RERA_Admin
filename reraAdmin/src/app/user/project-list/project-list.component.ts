import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectListService} from "../../services/project-list.service";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
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

  isProfile: any = 'none';
  constructor(private notifier: NotifierService, private route: Router, private modalService: NgbModal, private apiService: ProjectListService, private common: CommonService,
  ) {
  }

  ngOnInit(): void {
    sessionStorage.removeItem('pid');
    sessionStorage.removeItem('eid');
    sessionStorage.removeItem('aid');
    this.rolename = this.common.getRolename();
    this.roletype = this.common.getRoletype();
    this.workflowtype = this.common.getWorkflowType()
    this.common.setWorkflowType(this.workflowtype);
    // this.fetchProjectDetailsForUserCount(1).then((res: any) => {
    //   if (res.success) {
    //     this.regcount=res.response.total;
    //   } else {
    //     this.notifier.notify('error', res.message);
    //   }
    // });
    // this.fetchProjectDetailsForUserCount(2).then((res: any) => {
    //   if (res.success) {
    //     this.extcount=res.response.total;
    //   } else {
    //     this.notifier.notify('error', res.message);
    //   }
    // });
    // this.fetchProjectDetailsForUserCount(3).then((res: any) => {
    //   if (res.success) {
    //     this.agentcount=res.response.total;
    //   } else {
    //     this.notifier.notify('error', res.message);
    //   }
    // });
    this.fetchProjectDetails(this.workflowtype)
  }

  fetchProjectDetails(type: number): void {
    const data = {
      reraid: this.common.getReraId(),
      roleid: this.common.getRoleId(),
      userid: this.common.getUserId(),
      // status: this.selectStatus1,
      type: type
    };
    this.common.loaderStart();
    this.apiService.fetchProjectDetailsForUser(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        for (let i = 0; i < res.response.length; i++) {
          if (res.response[i].isapproved === 3) {
            res.response[i].statusName = 'Approved';
          } else if (res.response[i].isapproved === 4) {
            res.response[i].statusName = 'Rejected';
          } else {
            res.response[i].statusName = 'Under Scrutiny';
          }

          if (res.response[i].submitiontime != null) {
            var time = new Date().getTime() - new Date(res.response[i].submitiontime).getTime();
            const diffDays = Math.round(time / (1000 * 60 * 60 * 24));
            res.response[i].daysSubmit = diffDays;
            if (diffDays > this.daysSubmit) {
              res.response[i].fontColor = 'red'
            } else {
              res.response[i].fontColor = 'black'
            }
          }
        }
        this.listData = res.response;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
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


  fetchProjectDetailsByStatue(type: number): void {
    const data = {
      reraid: this.common.getReraId(),
      isapproved: this.selectStatus,
      type: type,
      userid:this.common.getUserId()
    };
    this.common.loaderStart();
    this.apiService.fetchProjectDetailsbyisApprove(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        for (let i = 0; i < res.response.length; i++) {
          if (res.response[i].isapproved === 3) {
            res.response[i].statusName = 'Approved';
          } else if (res.response[i].isapproved === 4) {
            res.response[i].statusName = 'Rejected';
          } else {
            res.response[i].statusName = 'Under Scrutiny';
          }

          if (res.response[i].submitiontime != null) {
            var time = new Date().getTime() - new Date(res.response[i].submitiontime).getTime();
            const diffDays = Math.round(time / (1000 * 60 * 60 * 24));
            res.response[i].daysSubmit = diffDays;
            if (diffDays > this.daysSubmit) {
              res.response[i].fontColor = 'red'
            } else {
              res.response[i].fontColor = 'black'
            }
          }

        }
        this.listData = res.response;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  onTabChange(event: any) {
    if (event.tab.textLabel === 'Assigned to me') {
      this.fetchProjectDetails(this.workflowtype)
    } else if (event.tab.textLabel === 'Other Applications') {
      this.fetchProjectDetailsByStatue(this.workflowtype)
    }
  }

  openProject(uniqueprojectid: any, i: any) {
    // console.log(uniqueprojectid)
    /*if (this.listData[i].isapproved === 3) {
      const promotorid = this.listData[i].particularprofileid;
      this.common.setProjectId(uniqueprojectid);
      this.getRegistrationCertificate(promotorid)
    } else if (this.listData[i].isapproved === 4) {
      this.rejection = this.listData[i].approvalcomment;
      this.modalService.open(this.modal, {centered: true})
    } else {*/
      this.common.setProjectId(uniqueprojectid);
      this.common.setExtensionId(this.listData[i].extensionid);
      this.common.setMenuType('1')
      this.route.navigate(['user/projectDetails'])
    // }
  }

  openProject1(uniqueprojectid: any, i: any) {
    // console.log(uniqueprojectid)
    // if (this.listData[i].isapproved === 3) {
    //   const promotorid = this.listData[i].particularprofileid;
    //   this.common.setProjectId(uniqueprojectid);
    //   this.getRegistrationCertificate(promotorid)
    // } else if (this.listData[i].isapproved === 4) {
    //   this.rejection = this.listData[i].approvalcomment;
    //   this.modalService.open(this.modal, { centered: true })
    // } else {
    //   this.common.setProjectId(uniqueprojectid);
    //   this.route.navigate(['user/projectDetails'])
    // }
    this.common.setProjectId(uniqueprojectid);
    this.common.setMenuType('2')
    this.route.navigate(['user/projectDetails'])
  }

  getRegistrationCertificate(promotorid: number) {
    /*const data = {
      reraid: this.common.getReraId(),
      projectid: this.common.getProjectId(),
      userid: promotorid,
      fromchecklist: 1
    };
    this.common.loaderStart();
    this.apiService.getRegistrationCertificate(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        window.open(this.apiService.BASE_ROOT + 'certificate/' + res.response.fileName, '_blank');
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })*/
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  getDetails(type: number) {
    this.workflowtype = type;
    this.common.setWorkflowType(this.workflowtype);
    this.fetchProjectDetails(type)
  }

  onAssignMeChange() {
    this.fetchProjectDetails(this.workflowtype)
  }

  onOthersChange() {
    this.fetchProjectDetailsByStatue(this.workflowtype)
  }

  openAgent(agent: number, i: any) {
    this.common.setAgentId(agent);
    this.common.setMenuType('1');
    this.route.navigate(['user/projectDetails'])
  }

  profileDetail() {
    if (this.isProfile === 'none') {
      this.isProfile = 'block'
    } else {
      this.isProfile = 'none'
    }
  }
}
