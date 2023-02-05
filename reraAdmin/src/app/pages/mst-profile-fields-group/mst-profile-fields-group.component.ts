import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {MstProfileFieldsGroupService} from "../../services/mst-profile-fields-group.service";
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-mst-profile-fields-group',
  templateUrl: './mst-profile-fields-group.component.html',
  styleUrls: ['./mst-profile-fields-group.component.css']
})
export class MstProfileFieldsGroupComponent implements OnInit {

  @ViewChild('modal') modal: any;
  modalHeader = '';
  name = '';
  errMsg = '';
  listData: any = [];
  fieldListData: any = [];
  selectedId = 0;
  selectedGroupId = 0;
  selectedPosition = 0;
  fieldsArr: any = [];
  selectedFieldsArr: any = [{
    fieldType: '1',
    fieldId: '',
    groupId: '',
    parentFieldId: '',
    parentOptions: [],
    parentFieldValue: [],
    fieldWidth: 0,
    fontSize: 0,
    isRequired: false
  }];
  dropdownSettings:IDropdownSettings = {
    singleSelection: true,
    idField: 'fieldid',
    textField: 'fielddisplaydesc',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    enableCheckAll: false
  };
  fieldType = '';
  fieldId = '';
  fieldgroupid = '';
  isRequired = false;
  width = 0;
  size = 0;
  parentFieldId = '';
  parentValue: any = [];
  parentOptions: any = [];
  constructor(private modalService: NgbModal, private apiService: MstProfileFieldsGroupService, private common: CommonService,
              private notifier: NotifierService) {
  }

  ngOnInit(): void {
    this.getList();
    this.getFieldList();
  }

  getFieldList(): void {
    const data = {
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getFieldList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.fieldsArr = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getList(): void {
    const data = {
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.listData = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getFieldsByGroupId(groupid: number) {
    this.selectedGroupId = groupid;
    const data = {
      groupid: groupid,
      reraid: this.common.getReraId()
    };
    this.apiService.getFieldListByGroup(data).subscribe((res: any) => {
      if (res.success) {
        this.fieldListData = res.response;
      }
    });
  }

  openModal(flag = 0): void {
    this.name = flag === 0 ? '' : this.name;
    if (flag === 0) {
      this.selectedFieldsArr = [{
        fieldType: '1',
        fieldId: '',
        groupId: '',
        parentFieldId: '',
        parentOptions: [],
        parentFieldValue: [],
        fieldWidth: 0,
        fontSize: 0,
        isRequired: false
      }];
    }
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, {centered: true, size: 'xl'});
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  onSelectParentField(item: any): void {
    for (const obj of this.fieldsArr) {
      if (obj.fieldid == item.parentFieldId) {
        if (obj.controlvalue !== null && obj.controlvalue !== '') {
          item.parentOptions = obj.controlvalue.split('|')
        }
        break;
      }
    }
  }

  onSelectParentFieldEdit(): void {
    for (const obj of this.fieldsArr) {
      if (obj.fieldid == this.parentFieldId) {
        if (obj.controlvalue !== null && obj.controlvalue !== '') {
          this.parentOptions = obj.controlvalue.split('|')
        }
        break;
      }
    }
  }

  addMoreField(): void {
    this.selectedId = 0;
    this.selectedFieldsArr.push({
      fieldType: '1',
      fieldId: '',
      groupId: '',
      parentFieldId: '',
      parentOptions: [],
      parentFieldValue: [],
      fieldWidth: 0,
      fontSize: 0,
      isRequired: false
    });
  }

  removeField(pos: number): void {
    if (this.selectedFieldsArr.length > 1) {
      this.selectedFieldsArr.splice(pos, 1);
    }
  }

  saveData(): any {
    this.errMsg = '';
    if (this.name === '') {
      this.errMsg = 'Please enter the entity name';
      return false;
    }
    if (this.selectedFieldsArr.length === 0) {
      this.errMsg = 'Please select at least one fields';
      return false;
    }
    for(const obj of this.selectedFieldsArr) {
      obj.fieldId = obj.fieldId.length > 0 ? obj.fieldId[0].fieldid : '';
      obj.parentValue = obj.parentFieldValue.join(',');
      obj.isRequired = obj.isRequired ? 1 : 0
    }
    const data = {
      reraid: this.common.getReraId(),
      groupname: this.name,
      filedIds: this.selectedFieldsArr
    };
    this.apiService.addData(data).subscribe((res: any) => {
      if (res.success) {
        this.getList();
        this.closeModal();
        this.notifier.notify('success', res.message);
        this.name = '';
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }

  edit(editmodal: any, obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.isRequired = obj.isrequired == 1;
    this.fieldId = obj.fieldid;
    this.fieldgroupid = obj.fieldgroupid;
    this.width = obj.fieldwidth;
    this.size = obj.fontsize;
    this.fieldType = obj.fieldType;
    this.parentFieldId = obj.parentfieldid;
    this.parentValue = obj.parentfieldvalue !== null ? obj.parentfieldvalue.split(',') : [];
    this.selectedId = obj.id;
    if (obj.parentFieldId !== null) {
      this.onSelectParentFieldEdit();
    }
    this.modalService.open(editmodal, {centered: true});
  }

  updateData(): any {
    this.errMsg = '';
    const data = {
      reraid: this.common.getReraId(),
      fieldid: this.fieldId,
      parentfieldid: this.parentFieldId,
      parentfieldvalue: this.parentValue !== null ? this.parentValue.join(',') : null,
      fieldgroupid: this.fieldgroupid,
      fieldwidth: this.width,
      fontsize: this.size,
      isrequired: this.isRequired ? 1 : 0,
      id: this.selectedId
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.closeModal();
        this.getFieldsByGroupId(this.selectedGroupId);
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
      id: this.selectedId
    };
    this.apiService.deleteData(data).subscribe((res: any) => {
      if (res.success) {
        this.notifier.notify('success', res.message);
        this.closeModal();
        this.fieldListData.splice(this.selectedPosition, 1);
      } else {
        this.notifier.notify('error', res.message);
        this.closeModal();
      }
    })
  }

  addFieldData(): any {
    if (this.selectedFieldsArr.length === 0) {
      this.errMsg = 'Please select at least one fields';
      return false;
    }
    for(const obj of this.selectedFieldsArr) {
      obj.fieldId = obj.fieldId.length > 0 ? obj.fieldId[0].fieldid : '';
      obj.parentValue = obj.parentFieldValue.join(',')
      obj.isRequired = obj.isRequired ? 1 : 0
    }
    const data = {
      reraid: this.common.getReraId(),
      filedIds: this.selectedFieldsArr,
      groupid: this.selectedGroupId
    };
    this.apiService.addFieldsInGroup(data).subscribe((res: any) => {
      if (res.success) {
        this.notifier.notify('success', res.message);
        this.closeModal();
        this.getFieldsByGroupId(this.selectedGroupId);
      }
    }, (err: any) => {})
  }

  openAddModal(modal: any): void {
    this.selectedFieldsArr = [{
      fieldType: '1',
      fieldId: '',
      groupId: '',
      parentFieldId: '',
      parentOptions: [],
      parentFieldValue: [],
      fieldWidth: 0,
      fontSize: 0,
      isRequired: false
    }];
    this.modalService.open(modal, {centered: true, size: 'xl'})
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldListData, event.previousIndex, event.currentIndex);
    for(const [index, item] of this.fieldListData.entries()) {
      item.sequence = index + 1;
    }
    setTimeout(() => {
      this.updateSequence();
    }, 50);
  }

  updateSequence(): void {
    const data = {
      reraid: this.common.getReraId(),
      groupid: this.selectedGroupId,
      data: this.fieldListData
    }
    this.apiService.updateSequence(data).subscribe((res: any) => {
    }, (err: any) => {});
  }

}
