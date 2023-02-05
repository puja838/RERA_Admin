import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import {MstWorkflowStepsRoleUserChecklistService} from 'src/app/services/mst-workflow-steps-role-user-checklist.service';
import {MstChecklistFieldMapService} from 'src/app/services/mst-checklist-field-map.service';

@Component({
  selector: 'app-mst-checklist-field-map',
  templateUrl: './mst-checklist-field-map.component.html',
  styleUrls: ['./mst-checklist-field-map.component.css']
})
export class MstChecklistFieldMapComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  checklistname = '';
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  listData: any = [];
  projectFieldList: any = [];
  groupnames: any;
  tabnames: any;
  tabid = '';
  tabgroupid = '';
  tabname = '';
  tabgroupname = '';
  fromWhichList: any = [
    {id: 1, value: 'Project'},
    {id: 2, value: 'Profile'},
  ];
  whichfrom: any = '';
  whichfromname: any = '';
  fieldTypes: any = [
    {id: 1, value: 'Field'},
    {id: 2, value: 'Group Field'},
  ];
  fieldTypeId: any = '';
  fieldTypeName: any = '';
  stepList: any = [];
  stepid: any = '';
  stepname: any = '';
  isGroup: boolean = false;
  fieldLists: any = [];
  fieldid: any = '';
  fieldname: any = '';
  groupFieldLists: any = [];
  groupfieldid: any = '';
  groupfieldname: any = '';

  constructor(private modalService: NgbModal, private apiService: MstWorkflowStepsRoleUserChecklistService, private common: CommonService,
              private apiService2: MstChecklistFieldMapService, private notifier: NotifierService) {
  }


  ngOnInit(): void {
    this.getList();
    this.gettabnames();
    this.getgroupnames();
  }

  getList(): void {
    const data = {
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService2.getList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.listData = res.response;
        if(this.listData.length > 0){
          for(let i=0;i<this.listData.length;i++){
            if(this.listData[i].groupid === null){
              this.listData[i].groupfieldname = null;
              this.listData[i].fieldtypename = this.fieldTypes[0].value;
            } else {
              this.listData[i].fieldtypename = this.fieldTypes[1].value;
              if(this.listData[i].profilegroupname !== null){
                this.listData[i].groupfieldname = this.listData[i].profilegroupname;
              } else if(this.listData[i].projectgroupname !== null){
                this.listData[i].groupfieldname = this.listData[i].projectgroupname;
              } 
            }
            for(let j=0;j<this.fromWhichList.length;j++){
              if(Number(this.fromWhichList[j].id) === Number(this.listData[i].fromwhich)){
                this.listData[i].fromwhichname = this.fromWhichList[j].value;
              }
            }
          }
        }
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getgroupnames(): void {
    const data = {
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


  openModal(flag = 0): void {
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, {centered: true})
    if (this.modalHeader === 'Add') {
      this.reset();
    }
  }

  onTabNameChange(type: any) {
    for (let i = 0; i < this.tabnames.length; i++) {
      if (this.tabnames[i].fieldid == this.tabid) {
        this.tabname = this.tabnames[i].tabname;
      }
    }
  }

  onTabGroupNameChange(type: any) {
    for (let i = 0; i < this.groupnames.length; i++) {
      if (this.groupnames[i].id == this.tabgroupid) {
        this.tabgroupname = this.groupnames[i].groupname;
      }
    }
  }

  onWhichFromChange(type: any){
    if(type === 'i'){
      this.stepList = [];
      this.stepid = '';
      this.fieldid = '';
      this.fieldTypeId = '';
      this.fieldLists = [];
    }
    for (let i = 0; i < this.fromWhichList.length; i++) {
      if (this.fromWhichList[i].id == this.whichfrom) {
        this.whichfromname = this.fromWhichList[i].value;
      }
    }
    const data = {
      reraid: this.common.getReraId(),
      steptype: Number(this.whichfrom)
    }
    this.common.loaderStart();
    this.apiService2.getSteps(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.stepList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    });
  }
  onStepChange(type: any){
    if(type === 'i'){
      this.fieldid = '';
      this.fieldTypeId = '';
      this.fieldLists = [];
    }
    for (let i = 0; i < this.stepList.length; i++) {
      if (this.stepList[i].id == this.stepid) {
        this.stepname = this.stepList[i].value;
      }
    }
  }

  onFieldTypeChange(type: any){
    if(type === 'i'){
      this.fieldid = '';
      this.fieldLists = [];
      this.groupfieldid = '';
      this.groupFieldLists = [];
    }
    if(Number(this.fieldTypeId) === 1){
      this.isGroup = false;
      const data = {
        reraid: this.common.getReraId(),
        stepid: Number(this.stepid),
        whichfrom: Number(this.whichfrom)
      };
      this.common.loaderStart();
      this.apiService2.getFields(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.response) {
          this.fieldLists = res.response;
        }
      }, (err: any) => {
        this.common.loaderEnd();
      });
    } else if(Number(this.fieldTypeId) === 2){
      this.isGroup = true;
      const data = {
        reraid: this.common.getReraId(),
        whichfrom: Number(this.whichfrom)
      };
      this.common.loaderStart();
      this.apiService2.getGroups(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.response) {
          this.groupFieldLists = res.response;
        }
      }, (err: any) => {
        this.common.loaderEnd();
      });
    }
  }

  onGroupFieldChange(type: any) {
    if(type === 'i'){
      this.fieldid = '';
      this.fieldLists = [];
    }
    for (let i = 0; i < this.groupFieldLists.length; i++) {
      if (this.groupFieldLists[i].fieldid == this.groupfieldid) {
        this.groupfieldname = this.groupFieldLists[i].fielddesc;
      }
    }
    const data = {
      reraid: this.common.getReraId(),
      groupid: Number(this.groupfieldid),
      whichfrom: Number(this.whichfrom)
    };
    this.common.loaderStart();
    this.apiService2.getGroupFields(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.fieldLists = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    });
  }

  onFieldChange(type: any) {
    for (let i = 0; i < this.fieldLists.length; i++) {
      if (this.fieldLists[i].fieldid == this.fieldid) {
        this.fieldname = this.fieldLists[i].fielddesc;
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
    if (this.tabid === '') {
      this.errMsg = 'Please enter the tab name';
      return false;
    }
    if (this.tabgroupid === '') {
      this.errMsg = 'Please enter the tab group ';
      return false;
    }
    if (this.whichfrom === '') {
      this.errMsg = 'Please enter the which from ';
      return false;
    }
    if (this.stepid === '') {
      this.errMsg = 'Please enter the step name ';
      return false;
    }
    if (this.fieldid === '') {
      this.errMsg = 'Please enter the field name ';
      return false;
    }
    if (this.fieldTypeId === '') {
      this.errMsg = 'Please enter the field type ';
      return false;
    }
    if(Number(this.fieldTypeId) === 2){
      if (this.groupfieldid === '') {
        this.errMsg = 'Please enter the group name ';
        return false;
      }
    }

    let data;
    data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      checklistname: this.checklistname,
      tabid: Number(this.tabid),
      tabgroupid: Number(this.tabgroupid),
      fromwhich: Number(this.whichfrom),
      stepid: Number(this.stepid),
      groupid: 0,
      fieldid: Number(this.fieldid)
    };
    if(Number(this.fieldTypeId) === 2){
      data.groupid = Number(this.groupfieldid);
    }
    this.apiService2.addChecklist(data).subscribe((res: any) => {
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
    this.tabgroupid = '';
    this.tabid = '';
    this.isGroup = false;
    this.whichfrom = '';
    this.stepList = [];
    this.stepid = '';
    this.fieldid = '';
    this.fieldTypeId = '';
    this.fieldLists = [];
    this.groupfieldid = '';
    this.groupFieldLists = [];
  }

  edit(obj: any, pos: number): void {
    this.reset();
    this.selectedPosition = pos;
    this.selectedId = obj.id;
    this.checklistname = obj.checklistname;
    this.tabid = obj.tabid;
    this.tabgroupid = obj.tabgroupid;
    this.whichfrom = obj.fromwhich;
    this.stepid = obj.stepid;
    this.groupfieldid = obj.groupid;
    this.fieldid = obj.fieldid;
    if(this.groupfieldid !== null){
      this.isGroup = true;
      this.fieldTypeId = 2;
      this.onGroupFieldChange('u');
    } else {
      this.fieldTypeId = 1;
    }
    this.onTabNameChange('u');
    this.onTabGroupNameChange('u');
    this.onWhichFromChange('u');
    this.onStepChange('u');
    this.onFieldTypeChange('u');
    this.onFieldChange('u');
    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.checklistname === '') {
      this.errMsg = 'Please enter the check list name';
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
    if (this.whichfrom === '') {
      this.errMsg = 'Please enter the which from ';
      return false;
    }
    if (this.stepid === '') {
      this.errMsg = 'Please enter the step name ';
      return false;
    }
    if (this.fieldid === '') {
      this.errMsg = 'Please enter the field name ';
      return false;
    }
    if (this.fieldTypeId === '') {
      this.errMsg = 'Please enter the field type ';
      return false;
    }
    if(Number(this.fieldTypeId) === 2){
      if (this.groupfieldid === '') {
        this.errMsg = 'Please enter the group name ';
        return false;
      }
    }

    let data;
    data = {
      id: Number(this.selectedId),
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      checklistname: this.checklistname,
      tabid: Number(this.tabid),
      tabgroupid: Number(this.tabgroupid),
      fromwhich: Number(this.whichfrom),
      stepid: Number(this.stepid),
      groupid: 0,
      fieldid: Number(this.fieldid)
    };
    if(Number(this.fieldTypeId) === 2){
      data.groupid = Number(this.groupfieldid);
    }
    this.apiService2.updateChecklist(data).subscribe((res: any) => {
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

  openDeleteModal(deleteModal: any, id: number, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = id;
    this.modalService.open(deleteModal, {centered: true});
  }

  deleteData(): void {
    const data = {
      reraid: this.common.getReraId(),
      id: Number(this.selectedId)
    };
    this.apiService2.deleteChecklist(data).subscribe((res: any) => {
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
