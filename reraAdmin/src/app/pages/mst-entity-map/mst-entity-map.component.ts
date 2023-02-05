import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {MstEntityMapService} from "../../services/mst-entity-map.service";

@Component({
  selector: 'app-mst-entity-map',
  templateUrl: './mst-entity-map.component.html',
  styleUrls: ['./mst-entity-map.component.css']
})
export class MstEntityMapComponent implements OnInit {

  @ViewChild('modal') modal: any;
  modalHeader = '';
  name = '';
  errMsg = '';
  errTypeMsg = '';
  listData: any = [];
  entityList: any = [];
  entityTypeList: any = [];
  selectedId = 0;
  entityId = '';
  entityTypeId = '';
  selectedPosition = 0;
  constructor(private modalService: NgbModal, private apiService: MstEntityMapService, private common: CommonService,
              private notifier: NotifierService) { }

  ngOnInit(): void {
    this.getList();
    this.landingData()
  }

  landingData(): void {
    const data = {
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.landingData(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.entityList = res.response.entity;
        this.entityTypeList = res.response.entityType;
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

  openModal(flag= 0): void {
    this.name = flag === 0 ? '' : this.name;
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, {centered: true})
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  saveData(): any {
    this.errMsg = '';
    if (this.entityId === '') {
      this.errMsg = 'Please select the entity';
      return false;
    }
    if (this.entityTypeId === '') {
      this.errMsg = 'Please select the entity type';
      return false;
    }
    const data = {
      reraid: this.common.getReraId(),
      entitytypeid: this.entityTypeId,
      entityid: this.entityId
    };
    this.apiService.addData(data).subscribe((res: any) => {
      if (res.success) {
        this.getList();
        this.closeModal();
        this.notifier.notify('success', res.message);
        this.entityId = '';
        this.entityTypeId = '';
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }

  edit(obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = obj.entitytypemapid;
    this.entityId = obj.entityid;
    this.entityTypeId = obj.entitytypeid;
    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.entityId === '') {
      this.errMsg = 'Please select the entity';
      return false;
    }
    if (this.entityTypeId === '') {
      this.errMsg = 'Please select the entity type';
      return false;
    }
    const data = {
      reraid: this.common.getReraId(),
      entitytypeid: this.entityTypeId,
      entityid: this.entityId,
      id: this.selectedId
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.listData[this.selectedPosition].entitytypeid = this.entityTypeId;
        this.listData[this.selectedPosition].entityid = this.entityId;
        this.closeModal();
        this.notifier.notify( 'success', res.message);
        this.entityId = '';
        this.entityTypeId = '';
      } else {
        this.notifier.notify( 'error', res.message);
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
        this.notifier.notify( 'success', res.message);
        this.closeModal();
        this.listData.splice(this.selectedPosition, 1);
      } else {
        this.notifier.notify( 'error', res.message);
        this.closeModal();
      }
    })
  }

}
