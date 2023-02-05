import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {MstStageService} from "../../services/mst-stage.service";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-mst-stage',
  templateUrl: './mst-stage.component.html',
  styleUrls: ['./mst-stage.component.css']
})
export class MstStageComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  name = '';
  errMsg = '';
  listData: any = [];
  selectedId = 0;
  selectedPosition = 0;
  isTableView = false;
  stepType = '1';
  constructor(private modalService: NgbModal, private apiService: MstStageService, private common: CommonService,
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
      this.errMsg = 'Please enter the step name';
      return false;
    }
    const data = {
      reraid: this.common.getReraId(),
      stepdesc: this.name,
      istableview: this.isTableView ? '1' : '0',
      steptype: this.stepType
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
    this.selectedId = obj.stepid;
    this.name = obj.stepdesc;
    this.isTableView = obj.istableview === '1' ? true : false
    this.stepType = obj.steptype;
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
      stepid: this.selectedId,
      stepdesc: this.name,
      istableview: this.isTableView ? '1' : '0',
      steptype: this.stepType
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.listData[this.selectedPosition].stepdesc = this.name;
        this.listData[this.selectedPosition].istableview = this.isTableView ? '1' : '0';
        this.closeModal();
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
      stepid: this.selectedId
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listData, event.previousIndex, event.currentIndex);
    for(const [index, item] of this.listData.entries()) {
      item.sequenceno = index + 1;
    }
    setTimeout(() => {
      this.updateSequence();
    }, 50);
  }

  updateSequence(): void {
    const data = {
      reraid: this.common.getReraId(),
      data: this.listData
    }
    this.apiService.updateSequence(data).subscribe((res: any) => {
    }, (err: any) => {})
  }

}
