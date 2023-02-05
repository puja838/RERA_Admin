import {Component, OnInit, ViewChild} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {MstWorkflowStepsRoleUserService} from "../../services/mst-workflow-steps-role-user.service";
import {Router} from "@angular/router";
import {ProjectListService} from "../../services/project-list.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../services/common.service";
import {DeleteConfirmationModalComponent} from "../delete-confirmation-modal/delete-confirmation-modal.component";

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {

  promotername: string = '';
  projectname: string = '';
  stepworkid: number = 0;
  entitytypeid: number = 0;
  tabs: any;
  selectedTabIndex = 0;
  tabdetails: any;
  workflowhistoryid: number = 0;
  currentstepid: number = 0;
  workflowid: number = 0;
  nextSteps: any;
  promotorid: any;
  username: any;
  rolename: any;
  queries: any;
  selectedTabIndex1 = 0;
  querydetails: any[] = [];
  roletype: any;
  projectId: any = 0;
  stepid: number = 0;
  private nextstateid: number = 0;
  approvalComment: any = '';
  @ViewChild('modal') modal: any;
  canApprove: boolean = false;
  nextstepid = 0;
  showIcon: boolean = false;
  queryRadiobtn: any;
  steps: any;
  stepusers: any[] = [];
  stepuserid: any;
  promoterstepid: number = 0;
  scrutiny2stepid: number = 0;
  private steproleid: number = 0;
  queryChairRadiobtn: any;
  changeRole: boolean = false;
  isRejected: boolean = false;
  submitiontime: string = '';
  isDisplayed: boolean = false;
  userID: any;
  stephistory: any;
  applicationno: any;
  menutype: any;
  disabledQuery: boolean = false;
  hasValidQueryValue: boolean = false;
  scrutinyRadiobtn: any;
  secretaryid: number = 0;

  SECRETARY_ROLE_SEQ = '5';
  HOR_ROLE_SEQ = '2';
  CHAIRMAN_ROLE_SEQ = '3';

  regno: string = '';
  questions: any[] = [];
  internalNote: string = '';
  notes: any[] = [];
  private workflowstepworkid: number = 0;
  currentstepusers: any[] = [];
  currentstepuserid: any;
  private currentsteproleid: number = 0;
  raiseQuery: boolean = true;
  workflowbutton: any = '1';
  private roleid: any;
  queryanswerdetails: any[] = [];
  stepseqno: number = 0;

  INTERN_STEP_SEQ = 11;
  SCRUTINY2_STEP_SEQ = 9;
  SCRUTINY1_STEP_SEQ = 2;
  HOR_STEP_SEQ = 4;
  PROMOTER_STEP_SEQ = 10;
  SECRETARY_STEP_SEQ = 5;
  CHAIRMAN_STEP_SEQ = 7;
  MEMBER_STEP_SEQ = 6;
  CEO_STEP_SEQ = 12;

  querystepname = '';
  isdisplaynotequerytab: boolean = false;
  isdisplaynotetab: boolean = false;
  isdisplayceotab: boolean = false;
  displaynotequerysteps = [this.CEO_STEP_SEQ, this.SCRUTINY2_STEP_SEQ, this.HOR_STEP_SEQ, this.SECRETARY_STEP_SEQ, this.CHAIRMAN_STEP_SEQ, this.MEMBER_STEP_SEQ];
  displaynotesteps = [this.CEO_STEP_SEQ, this.INTERN_STEP_SEQ, this.HOR_STEP_SEQ, this.SECRETARY_STEP_SEQ, this.CHAIRMAN_STEP_SEQ, this.MEMBER_STEP_SEQ];
  displayceosteps = [this.CEO_STEP_SEQ, this.HOR_STEP_SEQ, this.SECRETARY_STEP_SEQ];
  notestepname: string = '';
  noteheadername: string = '';
  acceptrejecttype: number = 0;
  private answerdata: any;
  approvalTypes: any[] = [];
  approvaltypeid: string = '0';
  approvalNote: string = '';
  approvalnotes: any[] = [];
  isDecisionDone: boolean = true;
  certificate: string = '';
  approvedStatus: string = '';
  modifiedCert: string = '';
  suggesttypeid: string = '1';
  issueComment: string = '';
  showPromoter: boolean = false;
  workflowtype: number = 0;
  extensionId: any;
  APPROVED_TYPE_NO = '1';
  COND_APPROVE_TYPE_NO = '2';
  REJECT_TYPE_NO = '3';
  approvedid: string = '';
  registrationno: string = '';
  header: string = '';
  regnotes: any[] = [];
  regqueryanswerdetails: any[] = [];
  regplaceholder: string = '';
  agentId: any;
  userno: string = '';
  agentname: string = '';
  REGISTRATION_TYPE = 1;
  EXTENSION_TYPE = 2;
  AGENT_TYPE = 3;
  tabdetails1: any[]=[];
  constructor(private notifier: NotifierService, private roleApiService: MstWorkflowStepsRoleUserService, private route: Router, private projectlistService: ProjectListService,
              private modalService: NgbModal, private apiService: ProjectListService, private common: CommonService,
  ) {
  }

  ngOnInit(): void {

    this.username = this.common.getUsername();
    this.rolename = this.common.getRolename();
    this.roleid = this.common.getRoleId();
    this.roletype = this.common.getRoletype();
    this.projectId = this.common.getProjectId();
    this.extensionId = this.common.getExtensionId();
    this.userID = this.common.getUserId();
    this.agentId = this.common.getAgentId();
    this.workflowtype = this.common.getWorkflowType();
    // console.log(this.agentId);
    this.steps = [];
    // console.log(this.extensionId, typeof this.extensionId);
    this.fetchProjectDetailsById();
  }

  fetchProjectDetailsById(): void {
    let data: any = {};
    data = {
      reraid: this.common.getReraId(),
      workflowtype: this.workflowtype,
      userid:this.common.getUserId()
    };
    if (this.workflowtype === this.AGENT_TYPE) {
      data['agentid'] = this.agentId;
    } else {
      data['projectid'] = this.projectId;
      if (this.workflowtype === this.EXTENSION_TYPE) {
        data['extensionid'] = this.extensionId;
      }
    }
    this.common.loaderStart();
    this.apiService.fetchProjectDetailsById(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (res.response.length > 0) {
          this.promotername = res.response[0].username;
          this.projectname = res.response[0].projectfieldvalue;
          this.stepworkid = res.response[0].stepworkid;
          this.workflowstepworkid = res.response[0].id;
          this.entitytypeid = res.response[0].entitytypeid;
          this.common.setEntityTypeId(this.entitytypeid);
          this.workflowhistoryid = res.response[0].workflowhistoryid;
          this.currentstepid = res.response[0].tostepid;
          this.workflowid = res.response[0].workflowid;
          this.stepseqno = res.response[0].stepseqno;
          // this.workflowtype = res.response[0].workflowtype;
          this.userno = res.response[0].userno;
          this.agentname = res.response[0].agentname;
          this.promotorid = res.response[0].particularprofileid;
          // console.log(this.promotorid);
          this.showPromoter = true;
          this.submitiontime = res.response[0].submitiontime;
          this.applicationno = res.response[0].projectuid;
          this.certificate = res.response[0].certificate;
          this.registrationno = res.response[0].registrationno;
          if (this.workflowtype === 1) {
            this.header = 'Approval of Submitted Project';
          } else if (this.workflowtype === 2) {
            this.header = 'Approval of  Project Extension';
          }
          if (this.displaynotequerysteps.indexOf(this.stepseqno) > -1) {
            this.isdisplaynotequerytab = true;
          }
          if (this.stepseqno === this.SCRUTINY2_STEP_SEQ) {
            this.querystepname = 'Queries And Submission';
          } else {
            this.querystepname = 'Notes and Queries Raised';
          }

          if (this.displaynotesteps.indexOf(this.stepseqno) > -1) {
            this.isdisplaynotetab = true;
          }
          if (this.displayceosteps.indexOf(this.stepseqno) > -1) {
            this.isdisplayceotab = true;
          }
          if (this.stepseqno === this.INTERN_STEP_SEQ) {
            this.notestepname = 'Notes And Queries';
            this.noteheadername = 'Internal Note / Observation on the File';
          } else if (this.stepseqno === this.HOR_STEP_SEQ) {
            this.notestepname = 'Proposal';
            this.noteheadername = 'Proposal Notes';
          } else {
            this.notestepname = 'Proposal';
            this.noteheadername = 'Proposal By Head Of Registration';
          }


          this.menutype = this.common.getMenuType();
          // console.log(this.menutype)
          this.disabledQuery = false;
          if (this.roletype == 1 || this.menutype == 2) {
            this.disabledQuery = true;
          }
          // if (this.menutype != '2') {
          if (this.stepworkid === 1) {
            this.fetchTabbyEntityType()
          } else if (this.stepworkid === 2) {
            this.queries = [{query: "", docsrequired: "0", docs: "", time: 1}];
            this.fetchTabbyEntityType();
          } else {
            this.queries = [{query: "", docsrequired: "0", docs: "", time: 1}]
            this.getQueryCommentsByProject().then((res: any) => {
              if (res.success) {
                this.querydetails = res.response;
                if (this.querydetails.length > 0) {
                  this.stepworkid = 2;
                } else {
                  this.stepworkid = 1;

                }
                this.fetchTabbyEntityType();
              } else {
                this.notifier.notify('error', res.message);
              }
            });
          }
          if (this.menutype != '2') {
            this.getNextStepDetails()
          }
        }
        // this.listData = res.response;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  hasValidQuery(): void {
    const data = {
      projectid: this.common.getProjectId()
    }
    this.common.loaderStart();
    this.apiService.hasValidQuery(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.hasValidQueryValue = res.response.hasValidQuery;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getApprovalTypes(): void {
    const data = {
      reraid: this.common.getReraId(),
      userid:this.common.getUserId()
    };
    this.common.loaderStart();
    this.apiService.getApprovalTypes(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.approvalTypes = res.response;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getChairmanApprovalTypes(): void {
    let data: any = {};
    data = {
      reraid: this.common.getReraId(),
      workflowtype: this.workflowtype,
      userid:this.common.getUserId()
    };
    if (this.workflowtype === this.AGENT_TYPE) {
      data['agentid'] = this.agentId
    } else {
      data['projectid'] = this.projectId;
      if (this.workflowtype === this.EXTENSION_TYPE) {
        data['extensionid'] = this.extensionId;
      }
    }
    this.common.loaderStart();
    this.apiService.getChairmanApprovalTypes(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.approvalTypes = res.response;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  fetchTabbyEntityType(): void {
    const data = {
      reraid: this.common.getReraId(),
      entitytypeid: this.entitytypeid,
      userid:this.common.getUserId()
    };
    this.common.loaderStart();
    this.apiService.fetchTabbyEntityType(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.tabs = res.response;
        this.isDisplayed = true;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getNextStepDetails(): void {
    // console.log(this.workflowid)
    const data = {
      reraid: this.common.getReraId(),
      workflowid: this.workflowid,
      fromstepid: this.currentstepid,
      userid:this.common.getUserId()
    };
    this.common.loaderStart();
    this.apiService.getNextStepDetails(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (this.roletype !== '1') {
          res.response.unshift({id: 0, stepname: 'Send to'});
        }
        this.nextSteps = res.response;
        for (let i = 0; i < this.nextSteps.length; i++) {
          if (this.nextSteps[i].seqno === this.PROMOTER_STEP_SEQ) {
            this.promoterstepid = this.nextSteps[i].id
          } else if (this.nextSteps[i].seqno === this.SCRUTINY2_STEP_SEQ) {
            this.scrutiny2stepid = this.nextSteps[i].id
          } else if (this.nextSteps[i].seqno === this.SECRETARY_STEP_SEQ) {
            this.secretaryid = this.nextSteps[i].id
          } else {
            this.steps.push(this.nextSteps[i]);
          }
        }
        // if (this.roletype == this.SECRETARY_ROLE_SEQ) {
        //   this.nextstateid = this.secretaryid;
        // }
        if (this.nextSteps.length > 0) {
          this.stepid = this.nextSteps[0].id
        }
        //console.log(this.promoterstepid)
        // this.listData = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  fetchChecklistByTab(tabid: number): void {
    let data: any = {};
    data = {
      reraid: this.common.getReraId(),
      tabid: tabid,
      // projectid: this.common.getProjectId(),
      workflowstepsroleuserprojectid: this.workflowhistoryid,
      // promoterid: this.promotorid,
      workflowtype: this.workflowtype,
      userid:this.common.getUserId()
    };
    if (this.workflowtype === this.AGENT_TYPE) {
      data['promoterid'] = this.agentId
    } else {
      data['projectid'] = this.projectId;
      data['promoterid'] = this.promotorid;
      if (this.workflowtype === this.EXTENSION_TYPE) {
        data['extensionid'] = this.extensionId;
      }
    }
    this.common.loaderStart();
    if (this.workflowtype === this.EXTENSION_TYPE) {
      // data['extensionid'] = this.extensionId;
      this.apiService.fetchChecklistByTabExtension(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.tabdetails = res.response;
          for (let i = 0; i < this.tabdetails.length; i++) {
            for (let j = 0; j < this.tabdetails[i].details.length; j++) {
              const showIcon = (/\.(gif|jpg|jpeg|tiff|png|pdf)$/i).test(this.tabdetails[i].details[j].projectfieldvalue)

              this.tabdetails[i].details[j].showIcon = showIcon;
              if (this.tabdetails[i].details[j].details) {
                for (let k = 0; k < this.tabdetails[i].details[j].details.length; k++) {
                  const showIcon = (/\.(gif|jpg|jpeg|tiff|png|pdf)$/i).test(this.tabdetails[i].details[j].details[k].projectfieldvalue)

                  this.tabdetails[i].details[j].details[k].showIcon = showIcon;
                }
              }

            }
          }

          // this.listData = res.response;
        } else {
          this.tabdetails = [];
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    } else {
      this.apiService.fetchChecklistByTab(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.tabdetails = res.response;
          for (let i = 0; i < this.tabdetails.length; i++) {
            for (let j = 0; j < this.tabdetails[i].details.length; j++) {
              const showIcon = (/\.(gif|jpg|jpeg|tiff|png|pdf)$/i).test(this.tabdetails[i].details[j].projectfieldvalue)

              this.tabdetails[i].details[j].showIcon = showIcon;
              if (this.tabdetails[i].details[j].details) {
                for (let k = 0; k < this.tabdetails[i].details[j].details.length; k++) {
                  const showIcon = (/\.(gif|jpg|jpeg|tiff|png|pdf)$/i).test(this.tabdetails[i].details[j].details[k].projectfieldvalue)

                  this.tabdetails[i].details[j].details[k].showIcon = showIcon;
                }
              }

            }
          }

          // this.listData = res.response;
        } else {
          this.tabdetails = [];
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    }
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
    if (this.tabs.length > 0) {
      if (this.workflowtype === this.REGISTRATION_TYPE) {
        if (this.selectedTabIndex > 2 && this.selectedTabIndex < 3 + this.tabs.length) {
          this.fetchChecklistByTab(this.tabs[this.selectedTabIndex - 3].id)
        }
      } else if (this.workflowtype === this.EXTENSION_TYPE) {
        if (this.selectedTabIndex > 3 && this.selectedTabIndex < 4 + this.tabs.length) {
          this.fetchChecklistByTab(this.tabs[this.selectedTabIndex - 4].id)
        }
      } else {
        if (this.selectedTabIndex > 1 && this.selectedTabIndex < 2 + this.tabs.length) {
          this.fetchChecklistByTab(this.tabs[this.selectedTabIndex - 2].id)
        }
      }
    }
    if (event.tab.textLabel === 'Submit') {
      const data = {
        reraid: this.common.getReraId(),
        workflowtype: this.workflowtype,
        userid:this.common.getUserId()
      };
      this.common.loaderStart();
      this.apiService.getOfficerQuestion(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.questions = res.response;
          for (let i = 0; i < this.questions.length; i++) {
            this.questions[i].answer = '';
          }
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    } else if (event.tab.textLabel === 'Queries And Submission' || event.tab.textLabel === 'Notes and Queries Raised') {
      this.getInternalNotes(1, this.extensionId).then((resp: any) => {
        this.notes = resp;
      });
      this.getworkflowuser();
      this.raiseQuery = true;
      this.workflowbutton = '1';
      this.getSingleQueryAnswer(this.extensionId).then((resp: any) => {
        this.queryanswerdetails = resp;
      });
    } else if (event.tab.textLabel === 'Notes And Queries' || event.tab.textLabel === 'Proposal') {
      if (this.stepseqno === this.INTERN_STEP_SEQ) {
        this.getInternalNotes(1, this.extensionId).then((resp: any) => {
          this.notes = resp;
        });
      } else {
        this.getInternalNotes(2, this.extensionId).then((resp: any) => {
          this.notes = resp;
        });
      }
      if (this.stepseqno === this.CEO_STEP_SEQ || this.stepseqno === this.SECRETARY_STEP_SEQ || this.stepseqno === this.CHAIRMAN_STEP_SEQ || this.stepseqno === this.MEMBER_STEP_SEQ) {
        if (this.stepseqno === this.CHAIRMAN_STEP_SEQ) {
          this.getChairmanApprovalTypes();
        } else {
          this.getApprovalTypes();
        }
        this.getApprovalNotes().then(() => {
          if (this.stepseqno !== this.HOR_STEP_SEQ && this.stepseqno !== this.CEO_STEP_SEQ) {
            let match = false;
            for (let i = 0; i < this.approvalnotes.length; i++) {
              if (this.approvalnotes[i].userid == this.common.getUserId()) {
                match = true;
                break;
              }
            }
            if (!match) {
              this.isDecisionDone = false;
            }
          }
        });
      }
      this.raiseQuery = false;
    } else if (event.tab.textLabel === 'Issue Certificate') {
      if (this.workflowtype === this.EXTENSION_TYPE) {
        this.regplaceholder = 'Enter Extension No.';
      } else if (this.workflowtype === this.REGISTRATION_TYPE) {
        this.regplaceholder = 'Enter Registration No.';
      } else {
        this.regplaceholder = 'Enter Agent Registration No.';
      }
      this.getApprovalNotes().then(() => {
        let comment = ''
        for (let i = 0; i < this.approvalnotes.length; i++) {
          if (this.approvalnotes[i].roleseq == this.CHAIRMAN_ROLE_SEQ) {
            this.approvedStatus = this.approvalnotes[i].type;
            this.approvedid = this.approvalnotes[i].id
          }
        }
        if (this.approvalnotes.length > 0) {
          comment = this.approvalnotes[this.approvalnotes.length - 1].comment;
        }

        // if (this.stepseqno === this.CEO_STEP_SEQ && this.certificate !== null) {
        let val = 'A';
        if (this.approvedid == this.REJECT_TYPE_NO) {
          val = 'R';
        }
        if (this.workflowtype === this.EXTENSION_TYPE) {
          this.getExtensionCertificate('edit', val, comment);
        } else if (this.workflowtype === this.REGISTRATION_TYPE) {
          this.getRegistrationCertificate_v2('edit', val, comment)
        } else {
          this.getAgentRegistrationCertificate('edit', val, comment);
        }
        // }
      });
      this.getInternalNotes(3, this.extensionId).then((resp: any) => {
        this.notes = resp;

      });

      this.suggesttypeid = '1';
    } else if (event.tab.textLabel === 'View Registration Details') {
      this.selectedTabIndex1 = event.index;
      if (this.tabs.length > 0) {
        if (this.selectedTabIndex1 > 0 && this.selectedTabIndex1 < 1 + this.tabs.length) {
          this.fetchChecklistByTab(this.tabs[this.selectedTabIndex - 1].id)
        }

      }
    }
  }

  getworkflowuser() {
    const data = {
      reraid: this.common.getReraId(),
      roleid: this.roleid
    };
    this.common.loaderStart();
    this.roleApiService.getworkflowuser(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        res.response.unshift({"userid": 0, "username": "Send to User Within Same Role"})
        this.currentstepusers = res.response;
        this.currentstepuserid = 0;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getInternalNotes(type: number, extensionId: string) {
    let promise = new Promise((resolve, reject) => {
      let data: any = {};
      data = {
        reraid: this.common.getReraId(),
        type: type,
        workflowtype: this.workflowtype
      };
      if (this.workflowtype === this.AGENT_TYPE) {
        data['agentid'] = this.agentId
      } else {
        data['projectid'] = this.projectId;
        if (this.workflowtype === this.EXTENSION_TYPE) {
          data['extensionid'] = extensionId;
        }
      }
      this.common.loaderStart();
      this.apiService.getInternalNotes(data).subscribe((res: any) => {
        this.common.loaderEnd();

        if (res.success) {
          resolve(res.response)
          // this.notes = res.response;
        } else {
          this.notifier.notify('error', res.message);
          reject()
        }
      }, (err: any) => {
        this.common.loaderEnd();
        reject()
      })
    });
    return promise;
  }

  getApprovalNotes() {
    const promise = new Promise<void>((resolve, reject) => {
      let data: any = {}
      data = {
        reraid: this.common.getReraId(),
        workflowtype: this.workflowtype,
        userid:this.common.getUserId()
      };
      if (this.workflowtype === this.AGENT_TYPE) {
        data['agentid'] = this.agentId
      } else {
        data['projectid'] = this.projectId;
        if (this.workflowtype === this.EXTENSION_TYPE) {
          data['extensionid'] = this.extensionId;
        }
      }
      this.common.loaderStart();
      this.apiService.getApprovalNotes(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.approvalnotes = res.response;
          resolve();
        } else {
          this.notifier.notify('error', res.message);
          reject();
        }
      }, (err: any) => {
        this.common.loaderEnd();
        reject()
      })
    });
    return promise;
  }

  insertinternalnotes(type: number) {
    let data: any = {}
    data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      notes: this.internalNote,
      type: type,
      workflowtype: this.workflowtype
    };
    if (this.workflowtype === this.AGENT_TYPE) {
      data['agentid'] = this.agentId
    } else {
      data['projectid'] = this.projectId;
      if (this.workflowtype === this.EXTENSION_TYPE) {
        data['extensionid'] = this.extensionId;
      }
    }
    this.common.loaderStart();
    this.apiService.insertInternalNotes(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        // this.changeStep(nextstepid)
        this.notes.push({notes: this.internalNote, username: this.common.getUsername()});
        this.internalNote = '';
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getProjectHistory() {
    const data = {
      uniqueprojectid: this.projectId,
      userid:this.common.getUserId()
    };
    this.common.loaderStart();
    this.apiService.getProjectHistory(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.stephistory = res.response
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  radioChange() {
    // console.log(this.queryRadiobtn, this.workflowhistoryid)
    if (this.queryRadiobtn == '2') {
      this.stepusers = [];
      this.fetchUserFromStep(this.scrutiny2stepid);
    }
  }

  fetchUserFromStep(tostepid: number) {
    const data = {
      reraid: this.common.getReraId(),
      workflowid: this.workflowid,
      tostepid: tostepid,
      fromstepid: this.currentstepid,
      userid:this.common.getUserId()
    };
    this.common.loaderStart();
    this.apiService.fetchUserFromStep(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        res.response.unshift({"workflowuserid": 0, "username": "Select User"})
        this.stepusers = res.response;
        console.log(this.stepusers.length);
        if (this.stepusers.length > 0) {
          this.stepuserid = this.stepusers[0].workflowuserid;
        }
        // if (this.stepusers.length > 1) {
        //   this.steproleid = this.stepusers[1].roleid;
        // }
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  saveDetails() {
    // console.log(JSON.stringify(this.tabdetails))

    let promise = new Promise((resolve, reject) => {
      const details = JSON.parse(JSON.stringify(this.tabdetails))
      const val = [];
      for (let i = 0; i < details.length; i++) {
        for (let j = 0; j < details[i].details.length; j++) {
          if (details[i].details[j].details) {
            for (let k = 0; k < details[i].details[j].details.length; k++) {
              details[i].details[j].details[k].mstworkflowstepsroleuserchecklistid = details[i].details[j].details[k].id;
              // details[i].details[j].checklistcommentchecked = (details[i].details[j].checklistcommentchecked == "No" ? 0 : 1);
              delete details[i].details[j].details[k].id;
              delete details[i].details[j].details[k].olddata;
              val.push(details[i].details[j].details[k])
            }
          } else {
            details[i].details[j].mstworkflowstepsroleuserchecklistid = details[i].details[j].id;
            // details[i].details[j].checklistcommentchecked = (details[i].details[j].checklistcommentchecked == "No" ? 0 : 1);
            delete details[i].details[j].id;
            delete details[i].details[j].olddata;
            val.push(details[i].details[j])
          }
        }
      }
      // console.log(JSON.stringify(val))
      let data: any = {}
      data = {
        reraid: this.common.getReraId(),
        // uniqueprojectid: this.common.getProjectId(),
        workflowstepsroleuserprojectid: this.workflowhistoryid,
        userid: this.common.getUserId(),
        details: val,
        workflowtype: this.workflowtype
      };
      if (this.workflowtype === this.AGENT_TYPE) {
        data['agentid'] = this.agentId
      } else {
        data['uniqueprojectid'] = this.projectId;
        // data['uniquepromoterid'] = this.promotorid;
        if (this.workflowtype === this.EXTENSION_TYPE) {
          data['extensionid'] = this.extensionId;
        }
      }
      this.common.loaderStart();
      this.apiService.workflowStepChecklistComment(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', res.message);
          this.selectedTabIndex = this.selectedTabIndex + 1;
          // this.listData = res.response;
          // alert(res.message)
          resolve(true);
        } else {
          this.notifier.notify('error', res.message);
          resolve(false);
        }
      }, (err: any) => {
        this.common.loaderEnd();
        reject()
      })
    });
    return promise;
  }

  changeStep(id: any) {
    // console.log(id)
    if (id === 0 || id === null || id === undefined) {
      this.notifier.notify('error', "Select a valid step");
    } else {
      this.saveDetails().then((success) => {
        if (success) {
          this.moveWorkflow(id);
        }
      });
    }
  }

  moveWorkflow(id: any, roleid = 0, userid = 0) {
    // alert(JSON.stringify(this.nextSteps))
    // alert(id);
    let data: any = {};
    data = {
      reraid: this.common.getReraId(),
      // uniqueprojectid: this.common.getProjectId(),
      // uniquepromoterid: this.promotorid,
      userid: this.common.getUserId(),
      fromstepid: this.currentstepid,
      tostepid: id,
      forwardflg: 1,
      steproleid: roleid,
      stepuserid: userid,
      stepworkid: this.stepworkid,
      workflowtype: this.workflowtype
    };
    if (this.workflowtype === this.AGENT_TYPE) {
      data['agentid'] = this.agentId
    } else {
      data['uniqueprojectid'] = this.projectId;
      data['uniquepromoterid'] = this.promotorid;
      if (this.workflowtype === this.EXTENSION_TYPE) {
        data['extensionid'] = this.extensionId;
      }
    }
    this.common.loaderStart();
    this.apiService.moveWorkflow(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notifier.notify('success', res.message);
        sessionStorage.removeItem("pid")
        this.route.navigate(['user/projectList'])
        // alert(res.message)
      } else {
        this.notifier.notify('error', res.message);
        // alert(res.message)
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  changeUserInStep(roleid = 0, userid = 0) {
    let data: any = {};
    data = {
      reraid: this.common.getReraId(),
      uniqueprojectid: this.common.getProjectId(),
      workflowid: this.workflowid,
      userid: this.common.getUserId(),
      steproleid: roleid,
      stepuserid: userid,
      workflowtype: this.workflowtype
    };
    if (this.workflowtype === this.AGENT_TYPE) {
      data['agentid'] = this.agentId
    } else {
      data['uniqueprojectid'] = this.projectId;
      if (this.workflowtype === this.EXTENSION_TYPE) {
        data['extensionid'] = this.extensionId;
      }
    }
    this.common.loaderStart();
    this.apiService.changeUserInStep(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notifier.notify('success', res.message);
        sessionStorage.removeItem("pid")
        this.route.navigate(['user/projectList'])
        // alert(res.message)
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  addMoreQuery() {
    this.queries.push({query: "", docsrequired: "0", docs: "", time: 1});
  }

  uploadFile(e: any, i: any, type: any, j = 0) {
    console.log('inside aa')
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let file = e.target.files[0];
    // formData.append("user", JSON.stringify(user));
    formData.append("file", file);

    xhr.onreadystatechange = state => {
      // console.log(xhr.status);
      console.log(xhr.responseText)
      if (xhr.status === 200 && xhr.responseText !== '') {
        if (type === 'q') {
          this.querydetails[i].details[j].filepath = JSON.parse(xhr.responseText).response.fileName;
          this.querydetails[i].details[j].filedesc = JSON.parse(xhr.responseText).response.orgfilename;
        } else {
          // console.log(JSON.stringify(this.tabdetails));
          // console.log(JSON.stringify(this.tabdetails[i].details[j]));
          this.tabdetails[i].details[j].filepath = JSON.parse(xhr.responseText).response.fileName;
          this.tabdetails[i].details[j].filedesc = JSON.parse(xhr.responseText).response.orgfilename;
        }
      }
    };
    xhr.timeout = 5000;
    xhr.open("POST", this.projectlistService.API_ROOT + this.projectlistService.WORKFLOW_PATH + 'fileupload');
    xhr.send(formData);
  }

  changeQueryStep(id: any, roleid = 0, userid = 0) {

    this.saveQuery().then((ids:any) => {
      // if (success) {
      if(this.roletype===this.HOR_ROLE_SEQ && this.raiseQuery){
        this.acceptRejectQuery(ids,1).then(()=>{
          if (userid > 0) {
            this.moveWorkflow(id, roleid, userid);
          } else {
            this.moveWorkflow(id);
          }
        })
      }else {
        if (userid > 0) {
          this.moveWorkflow(id, roleid, userid);
        } else {
          this.moveWorkflow(id);
        }
      }
      // }
    })
  }

  saveQuery() {
    let promise = new Promise((resolve, reject) => {
      let blankQuery = false;
      let blankTime = false;
      // console.log(this.raiseQuery)
      if (this.raiseQuery) {
        for (let i = 0; i < this.queries.length; i++) {
          if (this.queries[i].query.trim() === '') {
            blankQuery = true;
            break;
          }
          // console.log(typeof this.queries[i].time)
          if (Number(this.queries[i].time) < 1) {
            blankTime = true;
            break;
          }
        }
        if (blankTime) {
          this.notifier.notify('error', "Respond time can't be less than 1");
          return;
        }
        if (!blankQuery) {
          let data: any = {}
          data = {
            reraid: this.common.getReraId(),
            // uniqueprojectid: this.common.getProjectId(),
            // uniquepromoterid: this.promotorid,
            workflowstepsroleuserprojectid: this.workflowhistoryid,
            userid: this.common.getUserId(),
            details: this.queries,
            workflowtype: this.workflowtype
          };
          if (this.workflowtype === this.AGENT_TYPE) {
            data['agentid'] = this.agentId
          } else {
            data['uniqueprojectid'] = this.projectId;
            data['uniquepromoterid'] = this.promotorid;
            if (this.workflowtype === this.EXTENSION_TYPE) {
              data['extensionid'] = this.extensionId;
            }
          }
          // console.log(JSON.stringify(data))
          this.common.loaderStart();
          this.apiService.workflowStepUserQuery(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
              this.notifier.notify('success', res.message);
              resolve(res.response);
            } else {
              // alert(res.message);
              this.notifier.notify('error', res.message);
              reject();
            }
          }, (err: any) => {
            this.common.loaderEnd();
            reject()
          })
        } else {
          this.notifier.notify('error', "Can't send blank query to next step.");
          resolve(false);
          // if (this.roletype == '2' || this.roletype == '1' || this.hasValidQueryValue) {
          //   resolve(true);
          // } else {
          //   this.notifier.notify('error', "Can't send blank query to next step.");
          //   resolve(false);
          // }
        }
      } else {
        resolve(true);
      }
    })
    return promise;

  }

  openAttachment(filepath: any) {
    // console.log(filepath)
    window.open(this.projectlistService.BASE_ROOT + 'uploadedFiles/' + filepath, '_blank');
  }

  getQueryCommentsByProject() {
    let promise = new Promise((resolve, reject) => {
      let type = [0, 1];
      if (this.roletype == 1) {
        type = [1];
      }
      const data = {
        reraid: this.common.getReraId(),
        projectid: this.common.getProjectId(),
        type: type,
        userid:this.common.getUserId()
      };
      this.common.loaderStart();
      this.apiService.getQueryCommentsByProject(data).subscribe((res: any) => {
        this.common.loaderEnd();
        resolve(res)
      }, (err: any) => {
        this.common.loaderEnd();
        reject()
      })
    })
    return promise;
  }

  addComment(q: any) {
    // console.log(JSON.stringify(this.querydetails));
    // console.log(JSON.stringify(q));
    if (q.answer == '' && q.filepath == null) {
      this.notifier.notify('error', 'Can not add blank comment');
    } else {
      let data: any = {};
      data = {
        reraid: this.common.getReraId(),
        // uniqueprojectid: this.common.getProjectId(),
        // uniquepromoterid: this.promotorid,
        workflowstepsroleuserprojectid: this.workflowhistoryid,
        workflowstepsroleuserqueryid: q.id,
        userid: this.common.getUserId(),
        answer: q.answer,
        filepath: q.filepath,
        filedesc: q.filedesc,
        workflowtype: this.workflowtype
      };
      if (this.workflowtype === this.AGENT_TYPE) {
        data['agentid'] = this.agentId
      } else {
        data['uniqueprojectid'] = this.projectId;
        data['uniquepromoterid'] = this.promotorid;
        if (this.workflowtype === this.EXTENSION_TYPE) {
          data['extensionid'] = this.extensionId;
        }
      }
      // console.log(JSON.stringify(data))
      this.common.loaderStart();
      this.apiService.workflowStepQueryAnswer(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', res.message);
          // console.log(JSON.stringify(q))
          // this.querydetails[i].details[j].details.push({
          //   "answer": q.usercomments,
          //   "filedesc": q.filedesc,
          //   "filepath": q.filepath,
          //   "roledesc": this.rolename,
          //   "username": this.username,
          //   "type": this.roletype,
          //   "dateofanswer": new Date()
          // });
          // q.filedesc = "";
          // this.querydetails[i].details[j].filepath = "";
          // this.querydetails[i].details[j].filedesc = "";
          // this.querydetails[i].details[j].usercomments = "";
          // console.log(q.filepath)
        } else {
          // alert(res.message);
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    }
  }

  invalidateQuery(q: any, number: number) {
    this.acceptRejectQuery([q.id],number).then(()=>{
          q.isvalidquery = number;
          this.addComment(q)
    })
  }
  acceptRejectQuery(ids:number[],number:number){
    let promise = new Promise<void>((resolve, reject) => {
      const data = {
        ids: ids,
        number: number,
        userid: this.common.getUserId()
      };
      this.common.loaderStart();
      this.apiService.invalidateQuery(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          // q.isvalidquery = number;
          // // this.hasValidQueryValue = true;
          // this.addComment(q)
          resolve();
          this.notifier.notify('success', res.message);
        } else {
          reject();
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.common.loaderEnd();
        reject()
      })
    });
    return promise;
  }
  openConfirmModal(data: any, type: number) {
    this.answerdata = data;
    this.acceptrejecttype = type;
    this.modalService.open(DeleteConfirmationModalComponent, {centered: true})
  }

  workflowStepResolvedQuery(q: any, number: number) {
    // q.queryresolved=number;
    const data = {
      id: q.id,
      userid: this.common.getUserId()
    };
    this.common.loaderStart();
    this.apiService.workflowStepResolvedQuery(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        q.queryresolved = number;
        this.notifier.notify('success', res.message);
      } else {
        // alert(res.message);
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  onStepChange() {
    if (this.nextstepid === 0 || this.nextstepid === null || this.nextstepid === undefined) {
      this.notifier.notify('error', "Select a valid step");
    } else {
      if (this.stepuserid > 0) {
        this.changeQueryStep(this.nextstepid, this.steproleid, this.stepuserid);
      } else {
        this.changeQueryStep(this.nextstepid);
      }
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  approval() {
    if (this.issueComment.trim() !== '') {
      let approved = 4;
      if (this.approvedid == this.APPROVED_TYPE_NO || this.approvedid == this.COND_APPROVE_TYPE_NO) {
        approved = 3
      }
      let isRegBlank = false;
      if (this.regno.trim() === '' && approved == 3) {
        isRegBlank = true;
      }

      if (!isRegBlank) {
        if (this.workflowtype === this.EXTENSION_TYPE) {
          const data = {
            extensionid: this.extensionId,
            userid: this.common.getUserId(),
            comment: this.issueComment,
            status: approved,
            extensionno: this.regno
          };
          this.common.loaderStart();
          this.apiService.updateExtensionStatus(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
              this.notifier.notify('success', res.message);
              sessionStorage.removeItem("pid");
              this.route.navigate(['user/projectList'])
            } else {
              this.notifier.notify('error', res.message);
            }
          }, (err: any) => {
            this.common.loaderEnd();
          })
        } else if (this.workflowtype === this.REGISTRATION_TYPE) {
          const data = {
            reraid: this.common.getReraId(),
            projectid: this.common.getProjectId(),
            userid: this.common.getUserId(),
            comment: this.issueComment,
            type: 2,
            isapproved: approved,
            promoterid: this.promotorid,
            regno: this.regno
          };
          // console.log(JSON.stringify(data))
          this.common.loaderStart();
          this.apiService.updateApprovalComments(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
              // this.closeModal();
              this.notifier.notify('success', res.message);
              sessionStorage.removeItem("pid");
              this.route.navigate(['user/projectList'])
            } else {
              this.notifier.notify('error', res.message);
            }
          }, (err: any) => {
            this.common.loaderEnd();
          })
        } else {
          const data = {
            agentid: this.agentId,
            userid: this.common.getUserId(),
            comment: this.issueComment,
            status: approved,
            regno: this.regno
          };
          this.common.loaderStart();
          this.apiService.updateAgentStatus(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
              this.notifier.notify('success', res.message);
              sessionStorage.removeItem("pid");
              this.route.navigate(['user/projectList'])
            } else {
              this.notifier.notify('error', res.message);
            }
          }, (err: any) => {
            this.common.loaderEnd();
          })
        }
      } else {
        this.notifier.notify('error', 'Registration number can not be blank.');
      }
    } else {
      this.notifier.notify('error', 'Approval comment can not be blank.');
    }
  }

  /*getRegistrationCertificate() {
    const data = {
      reraid: this.common.getReraId(),
      projectid: this.common.getProjectId(),
      userid: this.promotorid,
      fromchecklist: 1
    };
    this.common.loaderStart();
    this.apiService.getRegistrationCertificate(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        // this.notifier.notify('success', res.message);
        window.open(this.projectlistService.BASE_ROOT + 'certificate/' + res.response.fileName, '_blank');
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }*/


  getRegistrationCertificate_v2(type: string, fieldtype: string, reason: string) {
    const data = {
      reraid: this.common.getReraId(),
      projectid: this.projectId,
      userid: this.common.getUserId(),
      type: fieldtype,
      reason: reason,
      promoterid:this.promotorid,
    };
    this.common.loaderStart();
    this.apiService.getRegistrationCertificate_v2(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (type === 'open') {
          window.open(this.projectlistService.BASE_ROOT + 'certificate/' + res.response.fileName, '_blank');
        } else {
          this.modifiedCert = res.response.content;
        }// this.notifier.notify('success', res.message);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getExtensionCertificate(type: string, fieldtype: string, reason: string) {
    const data = {
      reraid: this.common.getReraId(),
      projectid: this.common.getProjectId(),
      userid: this.common.getUserId(),
      promoterid:this.promotorid,
      type: fieldtype,
      reason: reason,
      extensionid: this.extensionId
    };
    this.common.loaderStart();
    this.apiService.getExtensionCertificate(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (type === 'open') {
          window.open(this.projectlistService.BASE_ROOT + 'certificate/' + res.response.fileName, '_blank');
        } else {
          this.modifiedCert = res.response.content;
        }// this.notifier.notify('success', res.message);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getAgentRegistrationCertificate(type: string, fieldtype: string, reason: string) {
    const data = {
      reraid: this.common.getReraId(),
      agentid: this.agentId,
      userid: this.common.getUserId(),
      type: fieldtype,
      reason: reason,
      entitytypeid: this.entitytypeid
    };
    this.common.loaderStart();
    this.apiService.getAgentRegistrationCertificate(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.certificate = res.response.fileName;
        if (type === 'open') {
          window.open(this.projectlistService.BASE_ROOT + 'certificate/' + res.response.fileName, '_blank');
        } else {
          this.modifiedCert = res.response.content;
        }// this.notifier.notify('success', res.message);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  approved() {
    this.modalService.open(this.modal, {centered: true})
  }

  checkApprove() {
    const data = {
      reraid: this.common.getReraId(),
      projectid: this.common.getProjectId(),
      userid:this.common.getUserId()
    };
    this.common.loaderStart();
    this.apiService.isChairmanApprove(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if (res.response.isapproved === 1) {
          this.canApprove = true;
        } else if (res.response.isapproved === 2) {
          this.isRejected = true;
        } else {
          this.canApprove = false;
          this.isRejected = false;
        }

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  onStepChangeWithUser() {
    if (this.stepuserid == 0) {
      this.notifier.notify('error', 'Select a user to proceed');
    } else {
      this.saveQuery().then((success) => {
        if (success) {
          this.moveWorkflow(this.scrutiny2stepid, this.steproleid, this.stepuserid);
        }
      })
    }
  }

  onStepChangeWithUserDetails() {
    if (this.stepuserid == 0) {
      this.notifier.notify('error', 'Select a user to proceed');
    } else {
      this.saveDetails().then((success) => {
        if (success) {
          this.moveWorkflow(this.scrutiny2stepid, this.steproleid, this.stepuserid);
        }
      })
    }
  }

  goToPromoter() {
    this.saveDetails().then((success) => {
      if (success) {
        this.moveWorkflow(this.promoterstepid);
      }
    })
  }

  goToPromoterQuery() {
    this.saveQuery().then((success) => {
      if (success) {
        this.moveWorkflow(this.promoterstepid);
      }
    })
  }

  deleteQuery(i: any) {
    if (this.queries.length > 1) {
      this.queries.splice(i, 1)
    } else {
      this.notifier.notify('error', 'Can not delete all queries');
    }
  }

  radioChangeChair() {
    if (this.queryChairRadiobtn == '3') {
      this.changeRole = true;
    } else {
      this.changeRole = false;
    }
  }

  submitAnswerAndChangeStep(nextstepid: any) {
    if (nextstepid === 0 || nextstepid === null || nextstepid === undefined) {
      this.notifier.notify('error', "Select a valid step");
    } else {
      let data: any = {}
      data = {
        reraid: this.common.getReraId(),
        // projectid: this.common.getProjectId(),
        userid: this.common.getUserId(),
        answers: this.questions,
        workflowtype: this.workflowtype
      };
      if (this.workflowtype === this.AGENT_TYPE) {
        data['agentid'] = this.agentId
      } else {
        data['projectid'] = this.projectId;
        if (this.workflowtype === this.EXTENSION_TYPE) {
          data['extensionid'] = this.extensionId;
        }
      }
      this.common.loaderStart();
      this.apiService.insertOfficerAnswer(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          // this.changeStep(nextstepid)
          if (this.stepuserid > 0) {
            this.moveWorkflow(nextstepid, this.steproleid, this.stepuserid);
          } else {
            this.moveWorkflow(nextstepid);
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    }

  }

  onStateChange() {
    // console.log(this.currentstepid, this.nextstepid);
    this.fetchUserFromStep(this.nextstepid);

  }

  onUserChange(b: any) {
    let selectedIndex = b.target.selectedIndex;
    if (selectedIndex > 0) {
      this.steproleid = this.stepusers[selectedIndex].roleid;
    }
  }

  onCurrentUserChange(event: any) {
    let selectedIndex = event.target.selectedIndex;
    if (selectedIndex > 0) {
      this.currentsteproleid = this.roleid;
    }
  }

  onCurrentStepUserChange() {
    // console.log(this.currentstepuserid)
    if (this.currentstepuserid > 0) {
      this.saveQuery().then((success) => {
        if (success) {
          this.changeUserInStep(this.currentsteproleid, this.currentstepuserid)
        }
      })
    }
  }

  moveStepChange() {
    this.currentstepuserid = 0;
    this.currentsteproleid = 0;
    this.stepuserid = 0;
    this.steproleid = 0;
    this.nextstepid = 0;
  }

  getSingleQueryAnswer(extensionId: string) {
    let promise = new Promise((resolve, reject) => {
      let data: any = {};
      data = {
        reraid: this.common.getReraId(),
        workflowtype: this.workflowtype,
        userid:this.common.getUserId()
      };
      if (this.roletype == 1) {
        data['type'] = 1
      }
      if (this.workflowtype === this.AGENT_TYPE) {
        data['agentid'] = this.agentId
      } else {
        data['projectid'] = this.projectId;
        if (this.workflowtype === this.EXTENSION_TYPE) {
          data['extensionid'] = extensionId;
        }
      }

      this.common.loaderStart();
      this.apiService.getSingleQueryAnswer(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          resolve(res.response)
        } else {
          this.notifier.notify('error', res.message);
          reject()
        }
      }, (err: any) => {
        this.common.loaderEnd();
        reject()
      })
    });
    return promise;
  }

  addNotes() {
    if (this.stepseqno === this.INTERN_STEP_SEQ) {
      this.insertinternalnotes(1);
    } else if (this.stepseqno === this.HOR_STEP_SEQ) {
      this.insertinternalnotes(2);
    }
  }

  addApprovalNotes() {
    if (this.approvalNote.trim() !== '' && this.approvaltypeid !== '0') {
      let data: any = {}
      data = {
        reraid: this.common.getReraId(),
        workflowtype: this.workflowtype,
        approvaltypeid: this.approvaltypeid,
        comment: this.approvalNote,
        userid: this.common.getUserId(),
        roleseq: this.roletype
      };
      if (this.workflowtype === this.AGENT_TYPE) {
        data['agentid'] = this.agentId
      } else {
        data['projectid'] = this.projectId;
        if (this.workflowtype === this.EXTENSION_TYPE) {
          data['extensionid'] = this.extensionId;
        }
      }
      this.common.loaderStart();
      this.apiService.insertApprovalNotes(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', 'Comments added successfully');
          let name = '';
          for (let i = 0; i < this.approvalTypes.length; i++) {
            if (this.approvalTypes[i].id == this.approvaltypeid) {
              name = this.approvalTypes[i].type;
            }
          }
          this.approvalnotes.push({comment: this.approvalNote, username: this.username, type: name});
          this.isDecisionDone = true;
          if (this.roletype === this.CHAIRMAN_ROLE_SEQ) {
            let val = 'R';
            if (this.approvaltypeid == this.APPROVED_TYPE_NO || this.approvaltypeid == this.COND_APPROVE_TYPE_NO) {
              val = 'A';
            }
            if (this.workflowtype === this.EXTENSION_TYPE) {
              this.getExtensionCertificate('open', val, this.approvalNote);
            } else if (this.workflowtype === this.REGISTRATION_TYPE) {
              this.getRegistrationCertificate_v2('open', val, this.approvalNote);
            } else {
              this.getAgentRegistrationCertificate('open', val, this.approvalNote);
            }
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    } else {
      this.notifier.notify('error', 'All the fields are mandatory');
    }
  }

  openCertificate() {
    window.open(this.projectlistService.BASE_ROOT + 'certificate/' + this.certificate, '_blank');
  }

  onStepChangeWithoutComment() {
    if (this.nextstepid === 0 || this.nextstepid === null || this.nextstepid === undefined) {
      this.notifier.notify('error', "Select a valid step");
    } else {
      if (this.stepuserid > 0) {
        this.moveWorkflow(this.nextstepid, this.steproleid, this.stepuserid);
      } else {
        this.moveWorkflow(this.nextstepid);
      }
    }
  }

  onStepChangeFromProposal() {
    if (this.roletype === this.HOR_ROLE_SEQ) {
      if (this.notes.length > 0) {
        this.onStepChangeWithoutComment();
      } else {
        this.notifier.notify('error', "Please add some proposal first.");
      }
    } else {
      this.onStepChangeWithoutComment();
    }
  }

  updateCertificate() {
    // console.log(this.modifiedCert)
    if (this.workflowtype === this.REGISTRATION_TYPE) {
      const data = {
        reraid: this.common.getReraId(),
        projectid: this.common.getProjectId(),
        content: this.modifiedCert,
        userid: this.common.getUserId(),
      };
      this.common.loaderStart();
      this.apiService.saveCertificateContent(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', 'Certificate changed successfully');
          this.certificate = res.response.filename;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    } else if (this.workflowtype === this.EXTENSION_TYPE) {
      const data = {
        reraid: this.common.getReraId(),
        projectid: this.common.getProjectId(),
        content: this.modifiedCert,
        userid: this.common.getUserId(),
        extensionid: this.extensionId
      };
      this.common.loaderStart();
      this.apiService.saveExtensionCertificateContent(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', 'Certificate changed successfully');
          this.certificate = res.response.filename;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    } else if (this.workflowtype === this.AGENT_TYPE) {
      const data = {
        reraid: this.common.getReraId(),
        agentid: this.agentId,
        content: this.modifiedCert,
        userid:this.common.getUserId()
      };
      this.common.loaderStart();
      this.apiService.saveAgentCertificateContent(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', 'Certificate changed successfully');
          this.certificate = res.response.filename;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    }
  }

  onTabChange1(event: any) {
    if (this.selectedTabIndex1 > 0 && this.selectedTabIndex1 < 1 + this.tabs.length) {
      this.fetchRegistrationChecklistByTab(this.tabs[this.selectedTabIndex1 - 1].id)
    }
    if (event.tab.textLabel === 'Notes and Queries') {
      this.getInternalNotes(1, "null").then((resp: any) => {
        this.regnotes = resp;
      });
      this.getSingleQueryAnswer('null').then((resp: any) => {
        this.regqueryanswerdetails = resp;
      });
    }
  }

  fetchRegistrationChecklistByTab(tabid: number): void {
    let data: any = {};
    data = {
      reraid: this.common.getReraId(),
      tabid: tabid,
      workflowstepsroleuserprojectid: this.workflowhistoryid,
      promoterid: this.promotorid,
      projectid: this.projectId,
      workflowtype: this.REGISTRATION_TYPE,
      userid:this.common.getUserId()
    };

    this.common.loaderStart();

    this.apiService.fetchChecklistByTab(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.tabdetails1 = res.response;
        for (let i = 0; i < this.tabdetails1.length; i++) {
          for (let j = 0; j < this.tabdetails1[i].details.length; j++) {
            const showIcon = (/\.(gif|jpg|jpeg|tiff|png|pdf)$/i).test(this.tabdetails1[i].details[j].projectfieldvalue)

            this.tabdetails1[i].details[j].showIcon = showIcon;
            if (this.tabdetails1[i].details[j].details) {
              for (let k = 0; k < this.tabdetails1[i].details[j].details.length; k++) {
                const showIcon = (/\.(gif|jpg|jpeg|tiff|png|pdf)$/i).test(this.tabdetails1[i].details[j].details[k].projectfieldvalue)

                this.tabdetails1[i].details[j].details[k].showIcon = showIcon;
              }
            }

          }
        }

      } else {
        this.tabdetails1 = [];
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  submitAnswer(val: any) {
    let data: any = {}
    data = {
      reraid: this.common.getReraId(),
      workflowstepsroleuseranswerid: val.id,
      userid: this.common.getUserId(),
      comment: val.comments,
      workflowtype: this.workflowtype
    };
    if (this.workflowtype === this.AGENT_TYPE) {
      data['agentid'] = this.agentId
    } else {
      data['uniqueprojectid'] = this.projectId;
      data['uniquepromoterid'] = this.promotorid;
      if (this.workflowtype === this.EXTENSION_TYPE) {
        data['extensionid'] = this.extensionId;
      }
    }
    // console.log(JSON.stringify(data))
    this.common.loaderStart();
    this.apiService.workflowStepQueryAnswerComment(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        val.commentid=1;
        this.notifier.notify('success', res.message);
      } else {
        // alert(res.message);
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }
}
