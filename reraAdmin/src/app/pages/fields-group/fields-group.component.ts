import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {FieldGroupService} from "../../services/field-group.service";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-fields-group',
  templateUrl: './fields-group.component.html',
  styleUrls: ['./fields-group.component.css']
})
export class FieldsGroupComponent implements OnInit {
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
    rowName: ''
  }];
  isTableView = false;
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
  groupView = '';
  constructor(private modalService: NgbModal, private apiService: FieldGroupService, private common: CommonService,
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
  onItemSelect(item: any) {
    console.log(item);
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
      this.isTableView = false;
      this.selectedFieldsArr = [{
        fieldType: '1',
        fieldId: '',
        groupId: '',
        parentFieldId: '',
        parentOptions: [],
        parentFieldValue: [],
        fieldWidth: 0,
        fontSize: 0,
        rowName: ''
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
      rowName: ''
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
      obj.parentValue = obj.parentFieldValue.join(',')
    }
    const data = {
      reraid: this.common.getReraId(),
      groupname: this.name,
      groupView: this.groupView,
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

  edit(obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = obj.entityid;
    this.name = obj.entitydesc;
    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.name === '') {
      this.errMsg = 'Please enter the entity name';
      return false;
    }
    const data = {
      reraid: this.common.getReraId(),
      entityid: this.selectedId,
      entitydesc: this.name
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.listData[this.selectedPosition].entitydesc = this.name;
        this.closeModal();
        this.notifier.notify('success', res.message);
        this.name = '';
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
      obj.fieldId = obj.fieldId.length > 0 ? obj.fieldId[0].fieldid : ''
      obj.parentValue = obj.parentFieldValue.join(',')
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
      rowName: ''
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
