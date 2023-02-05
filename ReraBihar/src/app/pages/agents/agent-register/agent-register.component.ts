import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { RestApiService } from '../../../services/rest-api.service';
import { CommonService } from '../../../services/common.service';
import {NotifierService} from "angular-notifier";
import {ConfigService} from "../../../services/config.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeleteConfirmationModalComponent} from "../../shared/delete-confirmation-modal/delete-confirmation-modal.component";
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-agent-register',
  templateUrl: './agent-register.component.html',
  styleUrls: ['./agent-register.component.css']
})
export class AgentRegisterComponent implements OnInit, OnDestroy {
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
  listType = 1;
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
  listHeading = 'Registered Applications';
  constructor(private router: Router, private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
              private notifier: NotifierService, private config: ConfigService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.name = this.common.getUserName();
    // this.modalSubjectSubp = this.common.modalSubject.asObservable().subscribe((res: any) => {
    //   this.deleteProject();
    // })
  }

  ngOnDestroy(): void {
    if (this.modalSubjectSubp) {
      this.modalSubjectSubp.unsubscribe();
    }
  }
 
 

  goTo(path: string): void {
    this.router.navigate([path])
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

 
  

}
