import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MstProfileStepFieldsService} from "../../services/mst-profile-step-fields.service";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-mst-profile-step-fields',
  templateUrl: './mst-profile-step-fields.component.html',
  styleUrls: ['./mst-profile-step-fields.component.css']
})
export class MstProfileStepFieldsComponent implements OnInit {

  entityList: any = [];
  entityTypeList: any = [];
  fieldsList: any = [];
  groupList: any = [];
  stepList: any = [];
  errMsg = '';
  entityId = '';
  entityTypeId = '';
  fieldId = '';
  groupId = '';
  stepId = '';
  fieldType = 'field';
  isRequired = false;
  isApproval = false;
  selectedFields: any = [{
    fieldId: '',
    groupId: '',
    fieldType: 'field',
    isRequired: false,
    isApproval: false,
    sequence: 1,
    width: 0,
    size: 0,
    rowname: '',
    parentFieldId: '',
    parentFieldValue: [],
    parentValue: '',
    parentOptions: []
  }];
  listData: any = [];
  stepFieldList: any = [];
  flag = 0;
  width = 0;
  size = 0;
  parentFieldId = '';
  parentValue = [];
  parentOptions: any = [];
  sequence = 0;
  customClass = '';
  rowname = '';
  selectedId = 0;
  isTableView = '0';
  selectedPosition = 0;
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
  constructor(private modalService: NgbModal, private apiService: MstProfileStepFieldsService, private common: CommonService,
              private notifier: NotifierService) {
  }

  ngOnInit(): void {
    this.landingData();
    this.getList();
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

  getFieldList(stepId: any, entityId: any, entityTypeId: string): void {
    this.stepId = stepId;
    this.entityId = entityId;
    this.entityTypeId = entityTypeId;
    const data = {
      reraid: this.common.getReraId(),
      stepid: stepId,
      entityid: entityId,
      entitytypeid: entityTypeId
    };
    this.common.loaderStart();
    this.apiService.getFieldList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.stepFieldList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  landingData(): void {
    const data = {
      reraid: this.common.getReraId()
    };
    this.apiService.landingData(data).subscribe((res: any) => {
      if (res.success) {
        this.entityList = res.response.entity;
        this.fieldsList = res.response.field;
        this.groupList = res.response.group;
        this.stepList = res.response.step;
      }
    });
  }

  openModal(modal: any, flag: number = 0) {
    this.flag = flag;
    if (this.entityId !== '' && flag === 1) {
      this.getEntityTypeByEntity();
    }
    if (this.stepId !== '' && flag === 1) {
      this.onStepChange();
    }
    if (flag === 0) {
      this.entityId = '';
      this.entityTypeId = '';
      this.stepId = '';
      this.entityTypeList = [];
    }

    this.modalService.open(modal, {centered: true, size: 'xl'});
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  getEntityTypeByEntity(): any {
    if (this.entityId !== '') {
      const data = {
        reraid: this.common.getReraId(),
        entityid: this.entityId
      };
      this.apiService.getEntityTypeByEntity(data).subscribe((res: any) => {
        if (res.success) {
          console.log('this.entityTypeId', this.entityTypeId)
          this.entityTypeList = res.response;
        }
      });
    }
  }

  removeItem(i: number): void {
    if (this.selectedFields.length > 1) {
      this.selectedFields.splice(i, 1);
    }
  }

  addItem(): void {
    this.selectedFields.push({
      fieldId: '',
      groupId: '',
      fieldType: 'field',
      isRequired: false,
      isApproval: false,
      sequence: this.selectedFields.length === 0 ? 1 : this.selectedFields[this.selectedFields.length - 1].sequence + 1,
      width: 0,
      size: 0,
      rowname: '',
      parentFieldId: '',
      parentFieldValue: [],
      parentValue: '',
      parentOptions: []
    });
  }

  saveData(): any {
    if (this.entityId === '') {
      this.errMsg = 'Entity is required';
      return false;
    }
    if (this.entityTypeId === '') {
      this.errMsg = 'Entity is required';
      return false;
    }
    if (this.stepId === '') {
      this.errMsg = 'Entity is required';
      return false;
    }
    for (const obj of this.selectedFields) {
      if (obj.fieldType === 'field' && obj.fieldId === '') {
        this.errMsg = 'Field is not selected';
        return false;
      }
      if (obj.fieldType === 'group' && obj.groupId === '') {
        this.errMsg = 'Group is not selected';
        return false;
      }
      if (obj.width === 0) {
        this.errMsg = 'Field with is mandatory';
        return false;
      }
      if (obj.size === 0) {
        this.errMsg = 'Field with is mandatory';
        return false;
      }
    }
    for(const obj of this.selectedFields) {
      obj.fieldId = obj.fieldId.length > 0 ? obj.fieldId[0].fieldid : '';
      obj.parentValue = obj.parentFieldValue.join(',');
    }
    const data = {
      reraid: this.common.getReraId(),
      entityid: this.entityId,
      entitytypeid: this.entityTypeId,
      stepid: this.stepId,
      fieldList: this.selectedFields
    };
    // console.log(JSON.stringify(data));
    this.apiService.addData(data).subscribe((res: any) => {
      this.closeModal();
      if (res.success) {
        this.notifier.notify('success', res.message);
        this.reset();
        if (this.flag === 1) {
          this.getFieldList(Number(this.stepId), Number(this.entityId), this.entityTypeId);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
    });
  }

  reset(): void {
    this.selectedFields = [{
      fieldId: '',
      groupId: '',
      fieldType: 'field',
      isRequired: false,
      isApproval: false,
      sequence: 1,
      width: 0,
      size: 0,
      rowname: '',
      parentFieldId: '',
      parentValue: '',
      parentOptions: []
    }]
  }

  onSelectParentField(item: any): void {
    for (const obj of this.fieldsList) {
      if (obj.fieldid == item.parentFieldId) {
        if (obj.controlvalue !== null && obj.controlvalue !== '') {
          item.parentOptions = obj.controlvalue.split('|')
        }
        break;
      }
    }
  }

  onSelectParentFieldEdit(): void {
    for (const obj of this.fieldsList) {
      if (obj.fieldid == this.parentFieldId) {
        if (obj.controlvalue !== null && obj.controlvalue !== '') {
          this.parentOptions = obj.controlvalue.split('|')
        }
        break;
      }
    }
  }

  onFieldTypeChange(obj: any, flag = 0): void {
    if (flag === 0) {
      obj.fieldId = '';
      obj.groupId = '';
    } else {
      this.fieldId = '';
      this.groupId = '';
    }
  }

  edit(obj: any, i: number, editmodal: any): any {
    console.log(JSON.stringify(obj));
    this.sequence = obj.sequence;
    this.isRequired = obj.isRequired == 1;
    this.isApproval = obj.isApproval == 1;
    this.fieldId = obj.fieldId;
    this.groupId = obj.groupId;
    this.rowname = obj.rowname;
    this.width = obj.width;
    this.size = obj.size;
    this.fieldType = obj.fieldType;
    this.parentFieldId = obj.parentFieldId;
    this.parentValue = obj.parentValue !== null ? obj.parentValue.split(',') : [];
    this.customClass = '';
    this.selectedId = obj.id;
    if (obj.parentFieldId !== null) {
      this.onSelectParentFieldEdit();
    }
    this.modalService.open(editmodal, {centered: true})
  }

  updateData(): any {
    const data = {
      id: this.selectedId,
      sequence: this.sequence,
      isRequired: this.isRequired ? '1' : '0',
      isApproval: this.isApproval ? '1' : '0',
      fieldId: this.fieldId,
      groupId: this.groupId,
      rowname: this.rowname,
      width: this.width,
      size: this.size,
      fieldType: this.fieldType,
      parentFieldId: this.parentFieldId,
      parentValue: this.parentValue !== null ? this.parentValue.join(',') : null,
      stepId: this.stepId,
      reraId: this.common.getReraId(),
      entiryid: this.entityId,
      entitytypeid: this.entityTypeId
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      this.closeModal();
      if (res.success) {
        this.notifier.notify('success', res.message);
        this.getFieldList(this.stepId, this.entityId, this.entityTypeId);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
    });
  }

  onStepChange(): void {
    for (let obj of this.stepList) {
      if (obj.stepid == this.stepId) {
        this.isTableView = obj.istableview;
        break;
      }
    }
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
        this.stepFieldList.splice(this.selectedPosition, 1);
      } else {
        this.notifier.notify('error', res.message);
        this.closeModal();
      }
    })
  }

}
