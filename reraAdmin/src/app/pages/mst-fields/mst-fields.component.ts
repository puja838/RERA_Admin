import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {MstFieldsService} from "../../services/mst-fields.service";

@Component({
  selector: 'app-mst-fields',
  templateUrl: './mst-fields.component.html',
  styleUrls: ['./mst-fields.component.css']
})
export class MstFieldsComponent implements OnInit {

  @ViewChild('modal') modal: any;
  modalHeader = '';
  fieldDisplay = '';
  fieldName = '';
  fieldType = '';
  controlType = '';
  controlValue = '';
  isUnique = false;
  errMsg = '';
  listData: any = [];
  selectedId = 0;
  selectedPosition = 0;
  fieldTypeDict: any;
  controlTypeDict: any;
  controlTypeKeys: any = [];
  fieldTypeKeys: any = [];
  limit = 20;
  offset = 0;
  isNextStep = true;
  isPrevStep = false;
  searchText = '';
  busnessunittypeid = '';
  businessUnitType: any = [];
  businessunittypecode = '';
  constructor(private modalService: NgbModal, private apiService: MstFieldsService, private common: CommonService,
              private notifier: NotifierService) {
  }

  ngOnInit(): void {
    this.fieldTypeDict = this.common.fieldTypeDict;
    this.controlTypeDict = this.common.controlTypeDict;
    this.controlTypeKeys = Object.keys(this.common.controlTypeDict);
    this.fieldTypeKeys = Object.keys(this.common.fieldTypeDict);
    this.getList();
    this.businessUnitTypeData();
  }

  businessUnitTypeData(): void {
    const data = {
      reraid: this.common.getReraId()
    };
    this.apiService.businessUnitTypeData(data).subscribe((res: any) => {
      if (res.success) {
        this.businessUnitType = res.response;
      }
    });
  }

  onBusinessUnitTypeChange(): void {
    for(const obj of this.businessUnitType) {
      if (obj.id == this.busnessunittypeid) {
        this.businessunittypecode = obj.businessunittypecode;
        break;
      }
    }
  }

  getList(flag = 0): void {
    if (flag === 1) {
      this.offset = 0;
    }
    const data = {
      reraid: this.common.getReraId(),
      limit: this.limit + '',
      offset: this.offset + '',
      searchText: this.searchText
    };
    this.common.loaderStart();
    this.apiService.getList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.listData = res.response;
        this.isNextStep = this.listData.length >= this.limit;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  openModal(flag = 0): void {
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, {centered: true})
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  saveData(): any {
    this.errMsg = '';
    if (this.fieldName === '') {
      this.errMsg = 'Please enter the filed name';
      return false;
    }
    if (this.fieldDisplay === '') {
      this.errMsg = 'Please enter the filed display name';
      return false;
    }
    if (this.fieldType === '') {
      this.errMsg = 'Please enter the filed type';
      return false;
    }
    if (this.controlType === '') {
      this.errMsg = 'Please enter the control type';
      return false;
    }
    const data = {
      reraid: this.common.getReraId(),
      fielddesc: this.fieldName,
      fielddisplaydesc: this.fieldDisplay,
      fieldtype: this.fieldType,
      projectuniqueid: this.isUnique ? '1' : '0',
      controltype: this.controlType,
      controlvalue: this.controlValue,
      busnessunittypeid: this.busnessunittypeid
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
    this.fieldName = '';
    this.fieldDisplay = '';
    this.fieldType = '';
    this.isUnique = false;
    this.controlType = '';
    this.controlValue = '';
  }

  edit(obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = obj.fieldid;
    this.fieldName = obj.fielddesc;
    this.fieldDisplay = obj.fielddisplaydesc;
    this.fieldType = obj.fieldtype;
    this.controlType = obj.controltype;
    this.controlValue = obj.controlvalue;
    this.isUnique = obj.projectuniqueid == '1';
    this.busnessunittypeid = obj.busnessunittypeid;
    this.businessunittypecode = obj.businessunittypecode;
    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.fieldName === '') {
      this.errMsg = 'Please enter the filed name';
      return false;
    }
    if (this.fieldDisplay === '') {
      this.errMsg = 'Please enter the filed display name';
      return false;
    }
    if (this.fieldType === '') {
      this.errMsg = 'Please enter the filed type';
      return false;
    }
    if (this.controlType === '') {
      this.errMsg = 'Please enter the control type';
      return false;
    }
    const data = {
      reraid: this.common.getReraId(),
      id: this.selectedId,
      fielddesc: this.fieldName,
      fielddisplaydesc: this.fieldDisplay,
      fieldtype: this.fieldType,
      projectuniqueid: this.isUnique ? '1' : '0',
      controltype: this.controlType,
      controlvalue: this.controlValue,
      busnessunittypeid: this.busnessunittypeid
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.listData[this.selectedPosition].entitydesc = this.fieldName;
        this.listData[this.selectedPosition].fielddisplaydesc = this.fieldDisplay;
        this.listData[this.selectedPosition].fieldtype = this.fieldType;
        this.listData[this.selectedPosition].projectuniqueid = this.isUnique;
        this.listData[this.selectedPosition].controltype = this.controlType;
        this.listData[this.selectedPosition].controlvalue = this.controlValue;
        this.listData[this.selectedPosition].busnessunittypeid = this.busnessunittypeid;
        this.listData[this.selectedPosition].businessunittypecode = this.businessunittypecode;
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

  generateFieldId(event: any) {
    this.fieldName = event.target.value.replace(/[^a-zA-Z_ ]/g, " ").replace(' ', '_');
  }

  next(): void {
    if (this.isNextStep) {
      this.isPrevStep = true;
      this.offset += this.limit;
      this.getList();
    }
  }
  previous(): void {
    if (this.offset > 0) {
      this.offset = this.offset - this.limit;
      if (this.offset === 0) {
        this.isPrevStep = false;
      }
      this.getList();
    }
  }

}
