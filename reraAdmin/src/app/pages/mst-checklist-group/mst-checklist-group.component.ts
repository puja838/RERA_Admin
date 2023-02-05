import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { NotifierService } from 'angular-notifier';
import { MstWorkflowStepsRoleUserChecklistService } from 'src/app/services/mst-workflow-steps-role-user-checklist.service';

@Component({
  selector: 'app-mst-checklist-group',
  templateUrl: './mst-checklist-group.component.html',
  styleUrls: ['./mst-checklist-group.component.css']
})
export class MstChecklistGroupComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  checklistgroupname = '';
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  groupNameList: any = [];
  constructor(private modalService: NgbModal, private apiService: MstWorkflowStepsRoleUserChecklistService, private common: CommonService,
    private notifier: NotifierService) { }

 
    ngOnInit(): void {
      this.getGroupNameList();
    }
  
    getGroupNameList(): void {
      const data = {
        reraid: this.common.getReraId()
      }
      this.common.loaderStart();
      this.apiService.getGroupNameList(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.response) {
          this.groupNameList = res.response;
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
      if (this.checklistgroupname === '') {
        this.errMsg = 'Please enter the check list group name';
        return false;
      }
      const data = {
        reraid: this.common.getReraId(),
        groupname: this.checklistgroupname, 
        userid: this.common.getUserId()   
      };
      this.apiService.addGroupName(data).subscribe((res: any) => {
        if (res.success) {
          this.getGroupNameList();
          this.closeModal();
          this.reset();
          this.notifier.notify('success', res.message);
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    }
  
    reset(): void {
      this.checklistgroupname = '';
    }
  
    edit(obj: any, pos: number): void {
      this.selectedPosition = pos;
      this.selectedId = obj.id;
      this.checklistgroupname = obj.groupname;
      this.openModal(1);
    }
  
    updateData(): any {
      this.errMsg = '';
      if (this.checklistgroupname === '') {
        this.errMsg = 'Please enter the check list group name';
        return false;
      }
      
      const data = {
        reraid: this.common.getReraId(),
        id: this.selectedId,
        groupname: this.checklistgroupname 
      };
      this.apiService.updateGroupName(data).subscribe((res: any) => {
        if (res.success) {
          this.groupNameList[this.selectedPosition].groupname = this.checklistgroupname;
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
      this.apiService.deleteGroupName(data).subscribe((res: any) => {
        if (res.success) {
          this.notifier.notify('success', res.message);
          this.closeModal();
          this.groupNameList.splice(this.selectedPosition, 1);
        } else {
          this.notifier.notify('error', res.message);
          this.closeModal();
        }
      })
    }
  
  }
