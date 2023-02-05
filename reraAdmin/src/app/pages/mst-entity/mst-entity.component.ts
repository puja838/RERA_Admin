import {Component, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MstEntityService} from "../../services/mst-entity.service";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";


@Component({
  selector: 'app-mst-entity',
  templateUrl: './mst-entity.component.html',
  styleUrls: ['./mst-entity.component.css']
})
export class MstEntityComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  name = '';
  errMsg = '';
  listData: any = [];
  selectedId = 0;
  selectedPosition = 0;
  constructor(private modalService: NgbModal, private apiService: MstEntityService, private common: CommonService,
              private notifier: NotifierService) { }

  ngOnInit(): void {
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
    if (this.name === '') {
      this.errMsg = 'Please enter the entity name';
      return false;
    }
    const data = {
      reraid: this.common.getReraId(),
      entitydesc: this.name
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
        console.log(res.message)
        this.notifier.notify( 'success', res.message);
        this.name = '';
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
      entityid: this.selectedId
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
