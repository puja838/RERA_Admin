import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import {MstBusinessUnitTypeService} from '../../services/mst-business-unit-type.service';

@Component({
  selector: 'app-mst-business-unit-type',
  templateUrl: './mst-business-unit-type.component.html',
  styleUrls: ['./mst-business-unit-type.component.css']
})
export class MstBusinessUnitTypeComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  busniesCode = '';
  businesDesc = '';
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  listData: any = [];
  
  constructor(private modalService: NgbModal, private apiService: MstBusinessUnitTypeService, private common: CommonService,
    private notifier: NotifierService) { }

  ngOnInit(): void {
    this.getList();
  }
  getList(): void {
    const data = {
      reraid: this.common.getReraId()
    };
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

  openModal(flag = 0): void {
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, {centered: true})
    if(this.modalHeader === 'Add')
    {
      this.reset()
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  saveData(): any {
    this.errMsg = '';
    if (this.busniesCode === '') {
      this.errMsg = 'Please enter the business code';
      return false;
    }
    if (this.businesDesc === '') {
      this.errMsg = 'Please enter the business describtion';
      return false;
    }
    
    const data = {
      reraid: this.common.getReraId(),
      businessunittypecode: this.busniesCode,
      businessunittypedesc: this.businesDesc,
      
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
    this.busniesCode = '';
    this.businesDesc = '';
   
  }

  edit(obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = obj.id;
    this.busniesCode = obj.businessunittypecode;
    this.businesDesc = obj.businessunittypedesc;

    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.busniesCode === '') {
      this.errMsg = 'Please enter the business code';
      return false;
    }
    if (this.businesDesc === '') {
      this.errMsg = 'Please enter the business describtion';
      return false;
    }
    const data = {
      reraid: this.common.getReraId(),
      id: this.selectedId,
      businessunittypedesc: this.businesDesc,
      businessunittypecode: this.busniesCode,
     
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.listData[this.selectedPosition].businessunittypecode = this.busniesCode;
        this.listData[this.selectedPosition].businessunittypedesc = this.businesDesc;
        
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

  // generateFieldId(event: any) {
  //   this.fieldName = event.target.value.replace(/[^a-zA-Z_ ]/g, "").replace(' ', '_');
  // }

}

