import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { NotifierService } from 'angular-notifier';
import { MstWorkflowStepsRoleUserChecklistService } from 'src/app/services/mst-workflow-steps-role-user-checklist.service';
import {MstEntityTypeService} from "../../services/mst-entity-type.service";

@Component({
  selector: 'app-mst-checklist-tab-map',
  templateUrl: './mst-checklist-tab-map.component.html',
  styleUrls: ['./mst-checklist-tab-map.component.css']
})
export class MstChecklistTabMapComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader: string = '';
  entityList: any = [];
  selectedEntityId: any = '';
  selectedEntityName: string = "";
  tabList: any = [];
  selectedTabId: any = '';
  selectedTabName: string = "";
  tabEntityList: any = [];
  selectedId: any = 0;
  selectedPosition: any = 0;
  selectedTabEntityId: any = '';
  errMsg = '';

  constructor(private modalService: NgbModal, private apiEntityService: MstEntityTypeService, private apiService: MstWorkflowStepsRoleUserChecklistService, private common: CommonService,
    private notifier: NotifierService) { }

 
    ngOnInit(): void {
      this.getEntityList();
      this.getTabNameList();
      this.getTabEntityMap();
    }

    getEntityList(): void {
      const data = {
        reraid: this.common.getReraId()
      }
      this.common.loaderStart();
      this.apiEntityService.getList(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.response) {
          this.entityList = res.response;
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    }
  
    getTabNameList(): void {
      const data = {
        reraid: this.common.getReraId()
      }
      this.common.loaderStart();
      this.apiService.getTabNameList(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.response) {
          this.tabList = res.response;
        }
      }, (err: any) => {
        this.common.loaderEnd();
      })
    }
  
  
  
    getTabEntityMap(): void {
      const data = {
        reraid: this.common.getReraId()
      }
      this.common.loaderStart();
      this.apiService.getTabEntityMap(data).subscribe((res: any) => {
        this.common.loaderEnd();
        if (res.response) {
          this.tabEntityList = res.response;
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

    onEntityFieldChange(){
      for (let i = 0; i < this.entityList.length; i++) {
        if (this.entityList[i].entitytypeid == this.selectedEntityId) {
          this.selectedEntityName = this.entityList[i].entitytypedesc;
        }
      }
    }

    onTabFieldChange(){
      for (let i = 0; i < this.tabList.length; i++) {
        if (this.tabList[i].id == this.selectedTabId) {
          this.selectedTabName = this.tabList[i].tabname;
        }
      }
    }
  
    closeModal(): void {
      this.modalService.dismissAll();
    }
  
    saveData(): any {
      this.errMsg = '';
      if (this.selectedEntityId === '') {
        this.errMsg = 'Please select the entity';
        return false;
      }

      if (this.selectedTabId === '') {
        this.errMsg = 'Please select the check list tab';
        return false;
      }

      const data = {
        reraid: this.common.getReraId(),
        entitytypeid: this.selectedEntityId,  
        tabid: this.selectedTabId,   
        userid: this.common.getUserId()   
      };
      this.apiService.addTabEntityMap(data).subscribe((res: any) => {
        if (res.success) {
          this.getTabEntityMap();
          this.closeModal();
          this.reset();
          this.notifier.notify('success', res.message);
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    }
  
    reset(): void {
      this.selectedEntityId = '';
      this.selectedTabId = '';
      this.selectedEntityName = '';
      this.selectedTabName = '';
    }
  
    edit(obj: any, pos: number): void {
      this.selectedPosition = pos;
      this.selectedId = obj.id;
      this.selectedEntityId = obj.entitytypeid;  
      this.selectedTabId = obj.tabid;
      this.selectedEntityName = obj.entitytypedesc;
      this.selectedTabName = obj.tabname;
      this.openModal(1);
    }
  
    updateData(): any {
      this.errMsg = '';
      if (this.selectedEntityId === '') {
        this.errMsg = 'Please select the entity';
        return false;
      }

      if (this.selectedTabId === '') {
        this.errMsg = 'Please select the check list tab';
        return false;
      }

      const data = {
        reraid: this.common.getReraId(),
        id: this.selectedId,
        entitytypeid: this.selectedEntityId,  
        tabid: this.selectedTabId,     
      };
      this.apiService.updateTabEntityMap(data).subscribe((res: any) => {
        if (res.success) {
          this.tabEntityList[this.selectedPosition].entitytypeid = this.selectedEntityId;
          this.tabEntityList[this.selectedPosition].tabid = this.selectedTabId;
          this.tabEntityList[this.selectedPosition].entitytypedesc = this.selectedEntityName;
          this.tabEntityList[this.selectedPosition].tabname = this.selectedTabName;
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
      this.apiService.deleteTabEntityMap(data).subscribe((res: any) => {
        if (res.success) {
          this.notifier.notify('success', res.message);
          this.closeModal();
          this.tabEntityList.splice(this.selectedPosition, 1);
        } else {
          this.notifier.notify('error', res.message);
          this.closeModal();
        }
      })
    }
  
  }
