import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RestApiService} from '../../services/rest-api.service';
import {CommonService} from '../../services/common.service';
import {NotifierService} from "angular-notifier";
import {ConfigService} from "../../services/config.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeleteConfirmationModalComponent} from "../shared/delete-confirmation-modal/delete-confirmation-modal.component";
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
})
export class ProjectDashboardComponent implements OnInit, OnDestroy {
  tableHead: any = [];
  updateProjectTableHead: any = [];
  projectList: any = [];
  name = '';
  projectId = 4;
  totalProjectCount = 0;
  totalWorkflowProjectCount = 0;
  getCountOfTotalRegisteredProjects = 0;
  getCountOfTotalRegistrationApplications = 0;
  pendingProjectList: any = [];
  updateProjectList: any = [];
  listType = 0;
  message = '';
  complainCount = '';
  notificationCount= 0;
  selectedProjectId = 0;
  UpcomingQpr = 0;
  QueriesCount = 0;
  isRegister= false;
  CasesfiledAllotteesCount = 0;
  CasesfiledPromoterCount = 0;
  @ViewChild('messageModal') messageModal: any;
  modalSubjectSubp = new Subscription();
  countOfTotalProjectStageTwo = '';
  listHeading = 'Updates and Important Notices';
  noticeList: any = [];
  FILE_URL = '';
  constructor(private router: Router, private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
              private notifier: NotifierService, private config: ConfigService, private modalService: NgbModal) {
    this.FILE_URL = this.rest.FILE_URL;
  }

  ngOnInit(): void {
    // this.getProjectList();
    this.getNotices('notice');
    this.getProjectDashboardData();
    this.numberofComplain();
    this.name = this.common.getUserName();
    this.modalSubjectSubp = this.common.modalSubject.asObservable().subscribe((res: any) => {
      this.deleteProject();
    })
  }

  ngOnDestroy(): void {
    if (this.modalSubjectSubp) {
      this.modalSubjectSubp.unsubscribe();
    }
  }

  openFile(file: string) {
    window.open(this.FILE_URL + 'news/' + file, '_blank');
  }

  getNotices(type: string): void {
    const data = {
      type: type,
      start: 0,
      limit: 10
    };
    this.rest.getNotices(data).subscribe((res: any) => {
      if (res.success) {
        for (const obj of res.response) {
          this.noticeList.push({
            content: obj.subject,
            date: this.common.getDateStr(obj.dateofnotice),
            file: obj.document,
            img: obj.bannarimage
          })
        }
      }
    })
  }

  generateToken():any{
    const data = {
      reraid: this.common.getReraId(),
      name: this.common.getPanNumber()
    };
    this.rest.generateToken(data).subscribe((res: any) => {
      if (res.success) {
        if(res.response.success){
          window.open(res.response.details.finalURl)
        } else {
          this.notifier.notify('error', 'You are not permitted')
        }
      } else {
        this.notifier.notify('error', 'You are not permitted')
      }
    });
  }
  getProjectDashboardData(): void {
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId()
    };
    this.rest.getProjectDashboardData(data).subscribe((res: any) => {
      if (res.success) {
        this.totalProjectCount = res.response.totalProjectCount;
        this.totalWorkflowProjectCount = res.response.totalWorkflowProjectCount;
        this.countOfTotalProjectStageTwo = res.response.countOfTotalProjectStageTwo;
        this.getCountOfTotalRegisteredProjects = res.response.getCountOfTotalRegisteredProjects;
        this.getCountOfTotalRegistrationApplications = res.response.getCountOfTotalRegistrationApplications;
        this.UpcomingQpr = res.response.countOfTotalProjectQPR;
      }
    });
  }
 
  getProjectList(): void {
    this.common.loaderShow();
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      isRegister:this.isRegister
    };
    this.rest.getProjectList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.tableHead = res.response.head;
        for(const obj of res.response.list) {
          if (obj.submitiontime) {
            obj.submitiontime = this.common.formatDate(obj.submitiontime);
            obj.submitionDays = this.common.subDates(obj.submitiontime);
          } else {
            obj.submitiontime = 'NA';
            obj.submitionDays = 'NA';
          }
        }
        this.projectList = res.response.list;
      }
    });
  }

  fetchProjectDetailsForUser(): void {
    const data = {
      reraid: this.common.getReraId(),
      roleid: this.common.getRoleId(),
      userid: this.common.getUserId(),
      status: '0'
    };
    this.rest.fetchProjectDetailsForUser(data).subscribe((res: any) => {
      if (res.success) {
        this.pendingProjectList = res.response;
      }
    });
  }

  fetchUpdateProjectDetailsForUser(flag: number = 0): void {
    const data = {
      reraid: this.common.getReraId(),
      roleid: this.common.getRoleId(),
      userid: this.common.getUserId(),
      flag: flag
    };
    this.rest.fetchUpdateProjectDetailsForUser(data).subscribe((res: any) => {
      if (res.success) {
        this.updateProjectTableHead = res.response.head;
        for(const obj of res.response.list) {
          if (obj.submitiontime) {
            obj.submitiontime = this.common.formatDate(obj.submitiontime);
            obj.submitionDays = this.common.subDates(obj.submitiontime);
          } else {
            obj.submitiontime = 'NA';
            obj.submitionDays = 'NA';
          }
        }
        this.updateProjectList = res.response.list;
      }
    });
  }

  goTo(path: string, id: any, isComplete: any = 0, projectuid: string): void {
    this.router.navigate([path + '/' + id + '/' + isComplete + '/' + projectuid])
  }

  goToProfile() {
    this.router.navigate(['/pages/profile-details'])
  }

  goToAnnualReport(){
    this.router.navigate(['/pages/annual-report'])
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  viewCertificate(projectId: number): void {
    const data = {
      reraid: this.common.getReraId(),
      projectid: projectId,
      userid: this.common.getUserId()
    };
    this.rest.getRegistrationCertificate(data).subscribe((res: any) => {
      if (res.success) {
        window.open(this.config.CRT_ROOT + res.response.fileName, '_blank');
      }
    });
  }

  openDeleteConfirmModal(projectId: number) {
    this.selectedProjectId = projectId;
    this.modalService.open(DeleteConfirmationModalComponent, {centered: true})
  }

  deleteProject(): void {
    const data = {
      reraid: this.common.getReraId(),
      projectid: this.selectedProjectId,
      userid: this.common.getUserId()
    };
    this.modalService.dismissAll();
    this.common.loaderShow();
    this.rest.deleteDraftProject(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.getProjectList();
        this.notifier.notify('success', res.message);
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }
  goToChecklist(id: number): void {
    this.common.setProjectId(id);
    this.common.setMenuType('1');
    this.router.navigate(['pages/checklist'])
  }

  listShow(flag: number, heading: string = '') {
    this.listHeading = heading;
    const elem = <HTMLElement>document.getElementById('listcontainer');
    if (elem) {
      elem.scrollIntoView();
    }
    this.listType = flag;
    if (flag === 1) {
      //console.log('aaaaaa')
      this.projectList = [];
      this.isRegister = true;
      this.getProjectList();
      
    } else if (flag === 2) {
      if (this.pendingProjectList.length === 0) {
        this.fetchProjectDetailsForUser();
      }
    } else if (flag === 3) {
      this.updateProjectList = [];
      this.fetchUpdateProjectDetailsForUser(0);
    } else if (flag === 4) {
      this.projectList = [];
      this.isRegister = false;
      this.getProjectList();
      
    } else if (flag === 5) {
      this.updateProjectList = [];
      this.fetchUpdateProjectDetailsForUser(2);
    }
  }
  showComment(comment: string) {
    this.message = comment;
    this.modalService.open(this.messageModal, {centered: true})
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  numberofComplain() {
    const data = {
      Promotor_id : this.common.getPanNumber()
    };
    this.rest.getCaseFiledCount(data).subscribe((res: any) => {
      if (res.success) {
        this.CasesfiledAllotteesCount = res.details.totalCaseFiles;
      }
    });
  }

  listofComplain(){
    const data = {
      userId : this.common.getPanNumber()
    }
    let testappurl = this.rest.getListofComplain(data)
    window.open(testappurl,'_blank')
  }

}
