import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { MstWorkflowService } from 'src/app/services/mst-workflow.service';

@Component({
  selector: 'app-mst-workflow',
  templateUrl: './mst-workflow.component.html',
  styleUrls: ['./mst-workflow.component.css']
})
export class MstWorkflowComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  workflowname = '';
  fromDate ='';
  startDate :any;
  userId ='';
  isDefaultFlg = true;
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  listData: any = [];
  constructor(private modalService: NgbModal, private apiService: MstWorkflowService, private common: CommonService,
    private notifier: NotifierService) { }

  ngOnInit(): void {
    this.getList();
  }


  getList(): void {
    const data = {
      reraid: this.common.getReraId(),
      userid:this.common.getUserId()
    }
    this.common.loaderStart();
    this.apiService.getList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.listData = res.response;
        for (let i = 0; i < this.listData.length; i++) {
          let startDate1 = this.listData[i].fromdate.replace('T',', ')
          startDate1 = startDate1.replace('.000Z','')
          startDate1 = startDate1.split(',')
          let startDate = startDate1[0].split('-')
          let displaydate = startDate[2]+'-'+startDate[1]+'-'+startDate[0]+','+startDate1[1]
          this.listData[i].fromdate = displaydate
        }

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
    if (this.workflowname === '') {
      this.errMsg = 'Please enter the business code';
      return false;
    }
    if (this.fromDate === '') {
      this.errMsg = 'Please enter the business describtion';
      return false;
    }
    const data = {
      reraid: this.common.getReraId(),
      workflowname: this.workflowname,
      fromdate: this.fromDate,
      defaultflg: this.isDefaultFlg == true ?1:0,
      userid:this.common.getUserId()
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
    this.workflowname = "";
    this.fromDate = '';
    this.isDefaultFlg = true
  }

  edit(obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = obj.id;
    this.workflowname = obj.workflowname;
    this.fromDate = this.dateConvert(obj.fromdate)
    this.isDefaultFlg = obj.defaultflg == 1 ? true: false
    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.workflowname === '') {
      this.errMsg = 'Please enter the business code';
      return false;
    }
    if (this.fromDate === '') {
      this.errMsg = 'Please enter the business describtion';
      return false;
    }

    const data = {
      reraid: this.common.getReraId(),
      id: this.selectedId,
      workflowname: this.workflowname,
      fromdate: this.fromDate,
      defaultflg: this.isDefaultFlg == true ? 1 : 0,
      userid:this.common.getUserId()
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.getList()
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
      id: this.selectedId,
      userid:this.common.getUserId()
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

  dateConvert(date:any){
    let startDate2 =  date.split(',')
    startDate2[1]=startDate2[1].replace(' ','')
    let startDate3 = startDate2[0].split('-')
    let startDate4 = startDate2[1].split(':')
    let displayDate = startDate3[2]+'-'+startDate3[1]+'-'+startDate3[0]+'T'+ startDate4[0]+':'+startDate4[1]
    return displayDate
  }


}
