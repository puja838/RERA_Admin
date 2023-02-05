import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import { MstWorkflowStepsService } from 'src/app/services/mst-workflow-steps.service';


@Component({
  selector: 'app-mst-workflow-steps',
  templateUrl: './mst-workflow-steps.component.html',
  styleUrls: ['./mst-workflow-steps.component.css']
})
export class MstWorkflowStepsComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  stepname = '';
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  listData: any = [];
  businessTypeList:any = []
  constructor(private modalService: NgbModal, private apiService: MstWorkflowStepsService, private common: CommonService,
    private notifier: NotifierService) { }

    ngOnInit(): void {
      this.getList();
    }

    getList(): void {
      const data = {
        reraid: this.common.getReraId(),
        userid: this.common.getUserId(),
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
      if (this.stepname === '') {
        this.errMsg = 'Please enter the stape name';
        return false;
      }
      const data = {

        reraid: this.common.getReraId(),
        stepname: this.stepname,
        userid: this.common.getUserId()
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
      this.stepname = '';
    }

    edit(obj: any, pos: number): void {
      this.selectedPosition = pos;
      this.selectedId = obj.id;
      this.stepname = obj.stepname;
      this.openModal(1);
    }

    updateData(): any {
      this.errMsg = '';
      if (this.stepname === '') {
        this.errMsg = 'Please enter the step name';
        return false;
      }

      const data = {
        reraid: this.common.getReraId(),
        id: this.selectedId,
        stepname: this.stepname,
        userid: this.common.getUserId(),
      };
      this.apiService.updateData(data).subscribe((res: any) => {
        if (res.success) {
          this.listData[this.selectedPosition].stepname = this.stepname;
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
        userid: this.common.getUserId(),
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



