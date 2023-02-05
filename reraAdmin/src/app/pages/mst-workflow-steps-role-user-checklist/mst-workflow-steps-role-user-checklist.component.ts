import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import {MstWorkflowStepsRoleUserChecklistService} from 'src/app/services/mst-workflow-steps-role-user-checklist.service';

@Component({
  selector: 'app-mst-workflow-steps-role-user-checklist',
  templateUrl: './mst-workflow-steps-role-user-checklist.component.html',
  styleUrls: ['./mst-workflow-steps-role-user-checklist.component.css']
})
export class MstWorkflowStepsRoleUserChecklistComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  checklistname = '';
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  listData: any = [];
  projectFieldList: any = [];
  projectfieldid = '';
  projectfieldname = '';
  groupnames: any;
  tabnames: any;
  tabid = '';
  tabgroupid = '';
  tabname = '';
  tabgroupname = '';

  constructor(private modalService: NgbModal, private apiService: MstWorkflowStepsRoleUserChecklistService, private common: CommonService,
              private notifier: NotifierService) {
  }


  ngOnInit(): void {
    this.getList();
    this.getProjectFieldid();
  }

  getList(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.listData = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getgroupnames(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    };
    this.common.loaderStart();
    this.apiService.getgroupnames(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.groupnames = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  gettabnames(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    };
    this.common.loaderStart();
    this.apiService.gettabnames(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.tabnames = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getProjectFieldid(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getProjectFieldid(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.projectFieldList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  openModal(flag = 0): void {
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, {centered: true})
    if (this.modalHeader === 'Add') {
      this.reset()
    }
    this.getgroupnames();
    this.gettabnames()
  }

  onProjectFieldChange() {
    for (let i = 0; i < this.projectFieldList.length; i++) {
      if (this.projectFieldList[i].fieldid == this.projectfieldid) {
        this.projectfieldname = this.projectFieldList[i].fielddesc;
      }
    }
  }

  onTabNameChange() {
    for (let i = 0; i < this.tabnames.length; i++) {
      if (this.tabnames[i].fieldid == this.tabid) {
        this.tabname = this.tabnames[i].tabname;
      }
    }
  }

  onTabGroupNameChange() {
    for (let i = 0; i < this.groupnames.length; i++) {
      if (this.groupnames[i].id == this.tabgroupid) {
        this.tabgroupname = this.groupnames[i].groupname;
      }
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  saveData(): any {
    this.errMsg = '';
    if (this.checklistname === '') {
      this.errMsg = 'Please enter the check list name';
      return false;
    }

    if (this.projectfieldid === '') {
      this.errMsg = 'Please enter the project field name';
      return false;
    }
    if (this.tabid === '') {
      this.errMsg = 'Please enter the tab name';
      return false;
    }
    if (this.tabgroupid === '') {
      this.errMsg = 'Please enter the tab group ';
      return false;
    }

    const data = {
      reraid: this.common.getReraId(),
      checklistname: this.checklistname,
      projectfieldid: this.projectfieldid,
      tabgroupid: this.tabgroupid,
      tabid: this.tabid,
      userid: this.common.getUserId()
    };
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
    this.checklistname = '';
    this.projectfieldid = '';
    this.projectfieldname = '';
    this.tabgroupid = '';
    this.tabid = '';
  }

  edit(obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = obj.id;
    this.checklistname = obj.checklistname;
    this.projectfieldid = obj.projectfieldid;
    this.projectfieldname = obj.projectfieldname;
    this.tabid = obj.tabid;
    this.tabgroupid = obj.tabgroupid;
    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.checklistname === '') {
      this.errMsg = 'Please enter the check list name';
      return false;
    }

    if (this.projectfieldid === '') {
      this.errMsg = 'Please enter the project field name';
      return false;
    }

    const data = {
      reraid: this.common.getReraId(),
      id: this.selectedId,
      checklistname: this.checklistname,
      projectfieldid: this.projectfieldid,
      userid: this.common.getUserId(),
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.listData[this.selectedPosition].checklistname = this.checklistname;
        this.listData[this.selectedPosition].projectfieldid = this.projectfieldid;
        this.listData[this.selectedPosition].projectfieldname = this.projectfieldname;
        this.listData[this.selectedPosition].tabname = this.tabname;
        this.listData[this.selectedPosition].tabid = this.tabid;
        this.listData[this.selectedPosition].tabgroupid = this.tabgroupid;
        this.listData[this.selectedPosition].groupname = this.tabgroupname;
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
      id: this.selectedId,
      userid: this.common.getUserId(),
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

}
