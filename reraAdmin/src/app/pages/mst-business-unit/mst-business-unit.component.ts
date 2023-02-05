import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import { MstBusinessUnitService } from 'src/app/services/mst-business-unit.service';


@Component({
  selector: 'app-mst-business-unit',
  templateUrl: './mst-business-unit.component.html',
  styleUrls: ['./mst-business-unit.component.css']
})
export class MstBusinessUnitComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  businessUnitId = '';
  businesName = '';
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  listData: any = [];
  businessTypeList:any = []
  constructor(private modalService: NgbModal, private apiService: MstBusinessUnitService, private common: CommonService,
    private notifier: NotifierService) { }

  ngOnInit(): void {
    this.businessTypeData()
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

  businessTypeData(): void {
    const data = {
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.businesstypelist(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.businessTypeList = res.response;
        console.log(this.businessTypeList)
        // this.entityTypeList = res.response.entityType;
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
    if (this.businessUnitId === '') {
      this.errMsg = 'Please enter the business id';
      return false;
    }
    if (this.businesName === '') {
      this.errMsg = 'Please enter the business name';
      return false;
    }
    
    const data = {
      reraid: this.common.getReraId(),
      businessunittypeid: this.businessUnitId,
      businessunittypename: this.businesName,
      
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
    this.businessUnitId = '';
    this.businesName = '';
   
  }

  edit(obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = obj.id;
    this.businessUnitId = obj.businessunittypeid;
    this.businesName = obj.businessunittypename;

    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.businessUnitId === '') {
      this.errMsg = 'Please enter the business id';
      return false;
    }
    if (this.businesName === '') {
      this.errMsg = 'Please enter the business name';
      return false;
    }
    
    const data = {
      reraid: this.common.getReraId(),
      id: this.selectedId,
      businessunittypename: this.businesName,
      businessunittypeid: this.businessUnitId,
     
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.listData[this.selectedPosition].businessunittypeid = this.businessUnitId;
        this.listData[this.selectedPosition].businessunittypename = this.businesName;
        
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

}


