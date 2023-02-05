import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { NotifierService } from 'angular-notifier';
import { MstWorkflowStepsRoleUserChecklistService } from 'src/app/services/mst-workflow-steps-role-user-checklist.service';

@Component({
  selector: 'app-mst-checklist-tab-master',
  templateUrl: './mst-checklist-tab-master.component.html',
  styleUrls: ['./mst-checklist-tab-master.component.css']
})
export class MstChecklistTabMasterComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  checklisttabname = '';
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  tabNameList: any = [];
  constructor(private modalService: NgbModal, private apiService: MstWorkflowStepsRoleUserChecklistService, private common: CommonService,
    private notifier: NotifierService) { }

 
    ngOnInit(): void {
      this.getTabNameList();
    }
  
    getTabNameList(): void {
      const data = {
        reraid: this.common.getReraId()
      }
      this.common.loaderStart();
      this.apiService.getTabNameList(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.response) {
          this.tabNameList = res.response;
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
      if (this.checklisttabname === '') {
        this.errMsg = 'Please enter the check list tab name';
        return false;
      }
      const data = {
        tabname: this.checklisttabname,
      };
      this.apiService.addTabName(data).subscribe((res: any) => {
        if (res.success) {
          this.getTabNameList();
          this.closeModal();
          this.reset();
          this.notifier.notify('success', res.message);
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    }
  
    reset(): void {
      this.checklisttabname = '';
    }
  
    edit(obj: any, pos: number): void {
      this.selectedPosition = pos;
      this.selectedId = obj.id;
      this.checklisttabname = obj.tabname;
      this.openModal(1);
    }
  
    updateData(): any {
      this.errMsg = '';
      if (this.checklisttabname === '') {
        this.errMsg = 'Please enter the check list Tab name';
        return false;
      }
      
      const data = {
        id: this.selectedId,
        tabname: this.checklisttabname 
      };
      this.apiService.updateTabName(data).subscribe((res: any) => {
        if (res.success) {
          this.tabNameList[this.selectedPosition].tabname = this.checklisttabname;
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
        id: this.selectedId
      };
      this.apiService.deleteTabName(data).subscribe((res: any) => {
        if (res.success) {
          this.notifier.notify('success', res.message);
          this.closeModal();
          this.tabNameList.splice(this.selectedPosition, 1);
        } else {
          this.notifier.notify('error', res.message);
          this.closeModal();
        }
      })
    }
  
  }
