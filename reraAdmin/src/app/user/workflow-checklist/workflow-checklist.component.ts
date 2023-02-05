import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectListService} from "../../services/project-list.service";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {MstWorkflowStepsRoleUserService} from "../../services/mst-workflow-steps-role-user.service";

@Component({
  selector: 'app-workflow-checklist',
  templateUrl: './workflow-checklist.component.html',
  styleUrls: ['./workflow-checklist.component.css']
})
export class WorkflowChecklistComponent implements OnInit {


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
  PROMOTER_STEP_SEQ = 10;
  SCRUTINY_2_STEP_SEQ = 9;
  SECRETARY_STEP_SEQ = 5;
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
    this.userID = this.common.getUserId();
    this.steps = [];
    this.fetchProjectDetailsById();
    if (this.roletype == '2' || this.roletype == '5') {
      this.checkApprove();
    }
    if (this.roletype == '4' || this.roletype == '2') {
      this.hasValidQuery()
    }
  }

  fetchProjectDetailsById(): void {
    const data = {
      projectid: this.common.getProjectId()
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
          this.promotorid = res.response[0].particularprofileid;
          this.submitiontime = res.response[0].submitiontime;
          this.applicationno = res.response[0].projectuid;
          // console.log(this.workflowhistoryid)
          this.menutype = this.common.getMenuType();
          // console.log(this.menutype)
          this.disabledQuery = false;
          if (this.roletype == 1 || this.menutype == 2) {
            this.disabledQuery = true;
          }
          if (this.menutype != '2') {
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

            this.getNextStepDetails()
          }
        }
        // this.listData = res.response;
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

  fetchTabbyEntityType(): void {
    const data = {
      reraid: this.common.getReraId(),
      entitytypeid: this.entitytypeid
    };
    this.common.loaderStart();
    this.apiService.fetchTabbyEntityType(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.tabs = res.response;
        this.isDisplayed = true;
        // setTimeout(()=>{
        //   this.selectedTabIndex = 0;
        // },50)

        // if (this.tabs.length > 0) {
        //   this.fetchChecklistByTab(this.tabs[0].id)
        // }
        // this.listData = res.response;
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
      fromstepid: this.currentstepid
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
          } else if (this.nextSteps[i].seqno === this.SCRUTINY_2_STEP_SEQ) {
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
    const data = {
      reraid: this.common.getReraId(),
      tabid: tabid,
      projectid: this.common.getProjectId(),
      workflowstepsroleuserprojectid: this.workflowhistoryid,
      promoterid: this.promotorid
    }
    this.common.loaderStart();
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

  onTabChange(event: any): void {
    // console.log(event.tab.textLabel)
    this.selectedTabIndex = event.index;
    // console.log(this.selectedTabIndex)
    if (this.tabs.length > 0) {
      if (this.stepworkid == 1) {
        if (this.selectedTabIndex > 2 && this.selectedTabIndex < 3 + this.tabs.length) {
          this.fetchChecklistByTab(this.tabs[this.selectedTabIndex - 3].id)
        }
      } else {
        // this.fetchChecklistByTab(this.tabs[this.selectedTabIndex].id)
      }
    }
    if (event.tab.textLabel === 'Submit') {
      const data = {
        reraid: this.common.getReraId()
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
    }
  }

  onTabChange1(event: any): void {
    // console.log(event.index)
    /*if (event.index === 2) {
      this.fetchTabbyEntityType();
    } else if (event.index === 4) {
      this.getQueryCommentsByProject().then((res: any) => {
        if (res.success) {
          this.querydetails = res.response;
        } else {
          this.notifier.notify('error', res.message);
          // alert(res.message)
        }
      });
    }*//* else if (event.index === 3) {
      if (this.roletype != this.HOR_ROLE_SEQ && this.roletype != '3') {
        this.changeRole = true;
      } else {
        this.changeRole = false;
      }
      if (this.canApprove && this.roletype == this.HOR_ROLE_SEQ) {
        this.nextstateid = this.secretaryid;
      }
      this.getInternalNotes();
      this.fetchRoleUserInStep();
    }*/ /*else if (event.index === 5) {
      this.getProjectHistory()
    }*/
    if (this.selectedTabIndex1 > 2 && this.selectedTabIndex1 < 3 + this.tabs.length) {
      this.fetchChecklistByTab(this.tabs[this.selectedTabIndex1 - 3].id)
    }
    if (event.tab.textLabel === 'Queries And Submission') {
      /*if (this.roletype != this.HOR_ROLE_SEQ && this.roletype != '3') {
        this.changeRole = true;
      } else {
        this.changeRole = false;
      }
      if (this.canApprove && this.roletype == this.HOR_ROLE_SEQ) {
        this.nextstateid = this.secretaryid;
      }*/
      this.getInternalNotes();
      this.getworkflowuser();
      this.raiseQuery = true;
      this.workflowbutton = '1';
      this.getSingleQueryAnswer();
    }else if (event.tab.textLabel === 'Notes And Queries') {
      this.getInternalNotes();
      this.raiseQuery = false;
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

  getInternalNotes() {
    const data = {
      reraid: this.common.getReraId(),
      projectid: this.common.getProjectId()
    };
    this.common.loaderStart();
    this.apiService.getInternalNotes(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notes = res.response;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  // fetchRoleUserInStep() {
  //   const data = {
  //     reraid: this.common.getReraId(),
  //     workflowid: this.workflowid,
  //     workflowstepsworksid: this.workflowstepworkid
  //   };
  //   this.common.loaderStart();
  //   this.apiService.fetchRoleUserInStep(data).subscribe((res: any) => {
  //     this.common.loaderEnd();
  //     if (res.success) {
  //       res.response.unshift({"roleid": 0, "workflowuserid": 0, "username": "Send to user from same step"})
  //       this.currentstepusers = res.response;
  //       this.currentstepuserid = 0;
  //     } else {
  //       this.notifier.notify('error', res.message);
  //     }
  //   }, (err: any) => {
  //     this.common.loaderEnd();
  //   })
  // }

  insertinternalnotes() {
    const data = {
      reraid: this.common.getReraId(),
      projectid: this.common.getProjectId(),
      userid: this.common.getUserId(),
      notes: this.internalNote
    };
    this.common.loaderStart();
    this.apiService.insertInternalNotes(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        // this.changeStep(nextstepid)
        this.notes.push({notes: this.internalNote});
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
      uniqueprojectid: this.projectId
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

  radioChangeDetails() {
    // console.log(this.queryRadiobtn, this.workflowhistoryid)
    if (this.queryRadiobtn == '2') {
      this.stepusers = [];
      this.fetchUserFromStep(this.scrutiny2stepid);
    }
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
      const data = {
        reraid: this.common.getReraId(),
        uniqueprojectid: this.common.getProjectId(),
        workflowstepsroleuserprojectid: this.workflowhistoryid,
        userid: this.common.getUserId(),
        details: val
      };
      // console.log(JSON.stringify(data))
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
    const data = {
      reraid: this.common.getReraId(),
      uniqueprojectid: this.common.getProjectId(),
      uniquepromoterid: this.promotorid,
      userid: this.common.getUserId(),
      fromstepid: this.currentstepid,
      tostepid: id,
      forwardflg: 1,
      steproleid: roleid,
      stepuserid: userid,
      stepworkid: this.stepworkid
    };
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
    const data = {
      reraid: this.common.getReraId(),
      uniqueprojectid: this.common.getProjectId(),
      workflowid: this.workflowid,
      userid: this.common.getUserId(),
      steproleid: roleid,
      stepuserid: userid
    };
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
    if (id === 0 || id === null || id === undefined) {
      this.notifier.notify('error', "Select a valid step");
    } else {
      this.saveQuery().then((success) => {
        if (success) {
          if (userid > 0) {
            this.moveWorkflow(id, roleid, userid);
          } else {
            this.moveWorkflow(id);
          }
        }
      })
    }
  }

  saveQuery() {
    let promise = new Promise((resolve, reject) => {
      let blankQuery = false;
      let blankTime = false;
      console.log(this.raiseQuery)
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
          const data = {
            reraid: this.common.getReraId(),
            uniqueprojectid: this.common.getProjectId(),
            uniquepromoterid: this.promotorid,
            workflowstepsroleuserprojectid: this.workflowhistoryid,
            userid: this.common.getUserId(),
            details: this.queries
          };
          // console.log(JSON.stringify(data))
          this.common.loaderStart();
          this.apiService.workflowStepUserQuery(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
              this.notifier.notify('success', res.message);
              resolve(true);
            } else {
              // alert(res.message);
              this.notifier.notify('error', res.message);
              resolve(false);
            }
          }, (err: any) => {
            this.common.loaderEnd();
            reject()
          })
        } else {
          if (this.roletype == '2' || this.roletype == '1' || this.hasValidQueryValue) {
            resolve(true);
          } else {
            this.notifier.notify('error', "Can't send blank query to next step.");
            resolve(false);
          }
        }
      }else{
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
        type: type
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

  addComment(i: any, j: number, q: any) {
    // console.log(JSON.stringify(this.querydetails));
    // console.log(JSON.stringify(q));
    if (q.usercomments == null && q.filepath == null) {
      this.notifier.notify('error', 'Can not add blank comment');
    } else {
      const data = {
        reraid: this.common.getReraId(),
        uniqueprojectid: this.common.getProjectId(),
        uniquepromoterid: this.promotorid,
        workflowstepsroleuserprojectid: this.workflowhistoryid,
        workflowstepsroleuserqueryid: q.id,
        userid: this.common.getUserId(),
        answer: q.usercomments,
        filepath: q.filepath,
        filedesc: q.filedesc

      };
      // console.log(JSON.stringify(data))
      this.common.loaderStart();
      this.apiService.workflowStepQueryAnswer(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.success) {
          this.notifier.notify('success', res.message);
          // console.log(JSON.stringify(q))
          this.querydetails[i].details[j].details.push({
            "answer": q.usercomments,
            "filedesc": q.filedesc,
            "filepath": q.filepath,
            "roledesc": this.rolename,
            "username": this.username,
            "type": this.roletype,
            "dateofanswer": new Date()
          });
          q.filedesc = "";
          this.querydetails[i].details[j].filepath = "";
          this.querydetails[i].details[j].filedesc = "";
          this.querydetails[i].details[j].usercomments = "";
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
    // q.isvalidquery=number;
    const data = {
      id: q.id,
      number: number,
      userid: this.common.getUserId()
    };
    this.common.loaderStart();
    this.apiService.invalidateQuery(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        q.isvalidquery = number;
        this.hasValidQueryValue = true;
        this.notifier.notify('success', res.message);
      } else {
        // alert(res.message);
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
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
    // this.moveWorkflow(this.stepid);
    if (this.stepuserid > 0) {
      this.changeQueryStep(this.nextstepid, this.steproleid, this.stepuserid);
    } else {
      this.changeQueryStep(this.nextstepid);
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  approval() {
    if (this.approvalComment.trim() !== '') {
      let type = 1;
      let isRegBlank = false;
      let approved = Number(this.queryChairRadiobtn);
      if (this.roletype == '2') {
        type = 2;
        if (this.canApprove) {
          approved = 3;
          if (this.regno.trim() === '') {
            isRegBlank = true;
          }
        } else {
          approved = 4;
        }
      }
      if (!isRegBlank) {
        const data = {
          reraid: this.common.getReraId(),
          projectid: this.common.getProjectId(),
          userid: this.common.getUserId(),
          comment: this.approvalComment,
          type: type,
          isapproved: approved,
          promoterid: this.promotorid,
          regno: this.regno
        };
        // console.log(JSON.stringify(data))
        this.common.loaderStart();
        this.apiService.updateApprovalComments(data).subscribe((res: any) => {
          this.common.loaderEnd();
          if (res.success) {
            this.closeModal();
            this.notifier.notify('success', res.message);
            if (this.roletype == this.SECRETARY_ROLE_SEQ) {
              if (this.canApprove) {
                this.getRegistrationCertificate()
              }
              sessionStorage.removeItem("pid");
              this.route.navigate(['user/projectList'])
            } else {
              this.moveWorkflow(this.nextstateid);
            }
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err: any) => {
          this.common.loaderEnd();
        })
      } else {
        this.notifier.notify('error', 'Registration number can not be blank.');
      }
    } else {
      this.notifier.notify('error', 'Approval comment can not be blank.');
    }
  }

  getRegistrationCertificate() {
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
        this.notifier.notify('success', res.message);
        window.open(this.projectlistService.BASE_ROOT + 'certificate/' + res.response.fileName, '_blank');
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
      const data = {
        reraid: this.common.getReraId(),
        projectid: this.common.getProjectId(),
        userid: this.common.getUserId(),
        answers: this.questions
      };
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

  getSingleQueryAnswer() {
    let type = [0, 1];
    if (this.roletype == 1) {
      type = [1];
    }
    const data = {
      reraid: this.common.getReraId(),
      projectid: this.common.getProjectId(),
      type: type
    };
    this.common.loaderStart();
    this.apiService.getSingleQueryAnswer(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.queryanswerdetails = res.response;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }
}
