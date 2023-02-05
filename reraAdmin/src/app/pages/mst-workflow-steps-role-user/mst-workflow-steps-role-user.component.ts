import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import {MstWorkflowStepsRoleUserService} from 'src/app/services/mst-workflow-steps-role-user.service';

@Component({
  selector: 'app-mst-workflow-steps-role-user',
  templateUrl: './mst-workflow-steps-role-user.component.html',
  styleUrls: ['./mst-workflow-steps-role-user.component.css']
})
export class MstWorkflowStepsRoleUserComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  fstepworkname = '';
  tstepworkname = '';
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  listData: any = [];
  businessTypeList: any = [];
  workflowList: any = []
  workflowStepList: any = [];
  stepList: any = [];
  rolelists: any = [];
  workflowid = '';
  stepid = '';
  selectedRoleid = 0;
  stepworkid = ''
  workflowName = '';
  stepname = '';
  selectedRolename = '';
  workflowuserid = 0;
  workflowusername = '';
  workflowuserlist: any = [];
  isPromoter = false;
  promoterDisable = false;
  isRoleSelected = false;
  isSender = false;

  constructor(private modalService: NgbModal, private apiService: MstWorkflowStepsRoleUserService, private common: CommonService,
              private notifier: NotifierService) {
  }

  ngOnInit(): void {
    this.getworkflowid();
    this.getworkflowstepid();
    // this.getworkflowuser();

    this.getroles();
    this.getList();
  }

  getList(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    };
    this.common.loaderStart();
    this.apiService.getList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.listData = res.response;
        for (let i = 0; i < this.listData.length; i++) {
          if (this.listData[i].workflowuserid === 0) {
            this.listData[i].roledesc = "Go To Creator";
            this.listData[i].workflowusername = "Go To Creator";
          } else if (this.listData[i].workflowuserid === -1) {
            this.listData[i].workflowusername = "Go To Sender"
            this.listData[i].roledesc = "Go To Sender";
          }
        }
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getworkflowid(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getworkflowid(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.workflowList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getworkflowstepid(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getworkflowstepid(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.workflowStepList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getroles(): void {
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
    }
    this.common.loaderStart();
    this.apiService.getRole(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.rolelists = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getstepid(): void {
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      workflowid: this.workflowid
    }
    this.common.loaderStart();
    this.apiService.getstepid(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.stepList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getworkflowuser(): void {
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      roleid: this.selectedRoleid
    };
    this.common.loaderStart();
    this.apiService.getworkflowuser(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.workflowuserlist = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  promoterChange() {
    if (this.isPromoter === true) {
      this.selectedRoleid = 0;
      this.workflowuserid = 0;
      this.isSender = false;
    } else {

    }
  }

  openModal(flag = 0): void {
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, {centered: true})
    if (this.modalHeader === 'Add') {
      this.reset()
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  onWorkflowChange() {
    for (let i = 0; i < this.workflowList.length; i++) {
      if (this.workflowList[i].id == this.workflowid) {
        this.workflowName = this.workflowList[i].workflowname;
      }
    }
    this.getstepid();
  }

  stepChange() {
    for (let i = 0; i < this.workflowStepList.length; i++) {
      if (this.workflowStepList[i].id == this.stepid) {
        this.stepname = this.workflowStepList[i].stepname;
      }
    }
  }

  roleChange() {
    if (this.selectedRoleid == 0) {
      this.isRoleSelected = false;
    } else {
      this.isRoleSelected = true;
      this.isPromoter = false;
      this.isSender = false;
    }
    for (let i = 0; i < this.rolelists.length; i++) {
      if (this.rolelists[i].roleid == this.selectedRoleid) {
        this.selectedRolename = this.rolelists[i].roledesc;
      }
    }
    this.getworkflowuser();
  }

  onStepNameChange() {
    for (let i = 0; i < this.stepList.length; i++) {
      if (this.stepList[i].id == this.stepworkid) {
        this.fstepworkname = this.stepList[i].fromstepname;
        this.tstepworkname = this.stepList[i].tostepname;
      }
    }
  }

  workflowUserChange() {
    for (let i = 0; i < this.workflowuserlist.length; i++) {
      if (this.workflowuserlist[i].userid == this.workflowuserid) {
        this.workflowusername = this.workflowuserlist[i].username;
      }
    }
  }

  saveData(): any {
    this.errMsg = '';
    if (this.workflowid === '') {
      this.errMsg = 'Please enter the wrokflow name';
      return false;
    }

    if (this.stepid === '') {
      this.errMsg = 'Please enter the stape name';
      return false;
    }

    if (this.stepworkid === '') {
      this.errMsg = 'Please enter the stape work name';
      return false;
    }
    if (this.isPromoter === false && this.isSender === false) {
      if (this.selectedRoleid === 0) {
        this.errMsg = 'Please enter the role name';
        return false;
      }

      if (this.workflowuserid === 0) {
        this.errMsg = 'Please enter the workflow user name';
        return false;
      }
    }
    if (this.isPromoter) {
      this.selectedRoleid = 0;
      this.workflowuserid = 0;
    } else if (this.isSender) {
      this.selectedRoleid = 0;
      this.workflowuserid = -1;
    }

    const data = {
      reraid: this.common.getReraId(),
      workflowid: this.workflowid,
      stepid: this.stepid,
      workflowstepsworksid: this.stepworkid,
      roleid: this.selectedRoleid,
      workflowuserid: this.workflowuserid,
      userid: this.common.getUserId()
    };
    // console.log(JSON.stringify(data))
    this.apiService.addData(data).subscribe((res: any) => {
      if (res.success) {
        this.getList();
        this.closeModal();
        this.reset();
        this.notifier.notify('success', res.message);
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }

  reset(): void {
    this.workflowid = '';
    this.workflowName = '';
    this.stepid = '';
    this.stepname = '';
    this.stepworkid = '';
    this.fstepworkname = '';
    this.tstepworkname = '';
    this.selectedRoleid = 0;
    this.selectedRolename = '';
    this.workflowuserid = 0;
    this.workflowusername = '';
    this.isPromoter = false;
    this.isRoleSelected = false;
    this.isSender =false;
  }

  edit(obj: any, pos: number): void {
    this.stepList = [];
    this.workflowuserlist = []
    this.selectedPosition = pos;
    this.selectedId = obj.id;
    this.workflowid = obj.workflowid;
    this.getstepid();
    this.workflowName = obj.workflowname;
    this.stepid = obj.stepid;
    this.stepname = obj.stepname;
    this.stepworkid = obj.workflowstepsworksid;
    this.fstepworkname = obj.fromstepname;
    this.tstepworkname = obj.tostepname;
    this.selectedRoleid = obj.roleid;
    this.workflowuserid = obj.workflowuserid
    this.getworkflowuser();
    if (this.selectedRoleid === 0 && this.workflowuserid === 0) {
      this.isPromoter = true;
      this.selectedRolename = "Go To Creator";
      this.workflowusername = "Go To Creator";

    }else if (this.selectedRoleid === 0 && this.workflowuserid === -1) {
      this.isSender = true;
      this.selectedRolename = "Go To Sender";
      this.workflowusername = "Go To Sender";

    } else {
      this.isPromoter = false;
      this.isSender = false;
      this.selectedRolename = obj.roledesc;
      this.workflowusername = obj.workflowusername;
    }
    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.workflowid === '') {
      this.errMsg = 'Please enter the wrokflow name';
      return false;
    }

    if (this.stepid === '') {
      this.errMsg = 'Please enter the stape name';
      return false;
    }

    if (this.stepworkid === '') {
      this.errMsg = 'Please enter the stape work name';
      return false;
    }

    if (this.isPromoter === false || this.isSender===false) {
      this.selectedRolename;
      this.workflowusername;
      if (this.selectedRoleid === 0) {
        this.errMsg = 'Please enter the role name';
        return false;
      }

      if (this.workflowuserid === 0) {
        this.errMsg = 'Please enter the workflow user name';
        return false;
      }
    } else {
      if(this.isPromoter) {
        this.selectedRolename = "Go To Creator";
        this.workflowusername = "Go To Creator";
      }else if(this.isSender){
        this.selectedRolename = "Go To Sender";
        this.workflowusername = "Go To Sender";
      }
    }

    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      id: this.selectedId,
      workflowid: this.workflowid,
      stepid: this.stepid,
      workflowstepsworksid: this.stepworkid,
      roleid: this.selectedRoleid,
      workflowuserid: this.workflowuserid
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.listData[this.selectedPosition].workflowid = this.workflowid,
          this.listData[this.selectedPosition].workflowname = this.workflowName,
          this.listData[this.selectedPosition].stepid = this.stepid,
          this.listData[this.selectedPosition].stepname = this.stepname,
          this.listData[this.selectedPosition].workflowstepsworksid = this.stepworkid,
          this.listData[this.selectedPosition].fromstepname = this.fstepworkname;
        this.listData[this.selectedPosition].tostepname = this.tstepworkname;
        this.listData[this.selectedPosition].roleid = this.selectedRoleid,
          this.listData[this.selectedPosition].roledesc = this.selectedRolename,
          this.listData[this.selectedPosition].workflowuserid = this.workflowuserid,
          this.listData[this.selectedPosition].workflowusername = this.workflowusername
        this.closeModal();
        this.notifier.notify('success', res.message);
        this.reset();
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }

  openDeleteModal(deleteModal: any, id: number, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = id;
    this.modalService.open(deleteModal, {centered: true});
  }

  deleteData(): void {
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      id: this.selectedId
    };
    this.apiService.deleteData(data).subscribe((res: any) => {
      if (res.success) {
        this.notifier.notify('success', res.message);
        this.closeModal();
        this.listData.splice(this.selectedPosition, 1);
      } else {
        this.notifier.notify('error', res.message);
        this.closeModal();
      }
    })
  }

  senderChange() {
    if (this.isSender === true) {
      this.selectedRoleid = 0;
      this.workflowuserid = 0;
      this.isPromoter = false;
    } else {

    }
  }
}
