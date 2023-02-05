import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { NotifierService } from 'angular-notifier';
import { MstWorkflowStepsWorksService } from 'src/app/services/mst-workflow-steps-works.service';

@Component({
  selector: 'app-mst-workflow-steps-works',
  templateUrl: './mst-workflow-steps-works.component.html',
  styleUrls: ['./mst-workflow-steps-works.component.css']
})
export class MstWorkflowStepsWorksComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild('workflow') workflow:any
  @ViewChild('workflow1') workflow1:any
  modalHeader = '';
  workflowid = '';
  fromstepid = '';
  tostepid = '';
  stepworkid = ''
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  listData: any = [];
  workflowList: any = [];
  workflowStepList: any = [];
  stepList: any = []
  workflowName = '';
  fromstepname = '';
  tostepname = '';
  stepworkname = '';
  workflowidList: any = [];
  // fromstepids: any = [];
  // tostepids: any = [];
  fromstepnames : any = [];
  tostepnames : any = [];
  union : any = [];
  constructor(private modalService: NgbModal, private apiService: MstWorkflowStepsWorksService, private common: CommonService,
    private notifier: NotifierService) { }

  ngOnInit(): void {
    this.getworkflowid();
    this.getworkflowstepid();
    this.getstepid();
  }

  getList(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId(),
      workflowid: this.workflowid
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

  getworkflowid(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getworkflowid(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.workflowList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  // getworkflow(workflow:any,obj:any): void {
  //   this.reset()
  //   console.log(obj.workflowid)
  //   const data = {
  //     reraid: this.common.getReraId(),
  //     workflowid: obj.workflowid
  //   }
  //   this.common.loaderStart();
  //   this.apiService.getworkflow(data).subscribe((res: any) => {
  //     this.common.loaderEnd();
  //     if (res.response) {
  //       this.workflowidList = res.response;
  //       for (let i = 0; i <  this.workflowidList.length; i++) {
  //         this.fromstepnames.push(this.workflowidList[i].fromstepname);
  //         this.tostepnames.push(this.workflowidList[i].tostepname);
  //       }
  //       this.union = [...new Set([...this.fromstepnames, ...this.tostepnames])];
  //       this.openWorkflowModal(obj.workflowname);

  //     }
  //   }, (err: any) => {
  //     this.common.loaderEnd();
  //   })
  // }

  getworkflow(): void {
    this.fromstepnames = [];
    this.tostepnames = [];
    // console.log(workflowid)
    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      workflowid:this.workflowid
    }
    this.common.loaderStart();
    this.apiService.getworkflow(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.workflowidList = res.response;
        for (let i = 0; i < this.workflowidList.length; i++) {
          if (this.fromstepnames.indexOf(this.workflowidList[i].fromstepname) === -1) {
            this.fromstepnames.push(this.workflowidList[i].fromstepname);
          }

          this.tostepnames.push(this.workflowidList[i].tostepname);
          let index = this.tostepnames.indexOf(this.workflowidList[i].fromstepname);
          if (index > -1) {
            this.tostepnames.splice(index, 1);
          }
        }

        // console.log(this.fromstepnames, this.tostepnames)

        this.openWorkflowModal();

      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  openWorkflowModal(): void{
    this.modalService.open(this.workflow,{size:'xl'});
  }

  openWorkModal(): void{
    this.modalService.open(this.workflow1,{size:'md'});
  }

  getworkflowstepid(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getworkflowstepid(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.workflowStepList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getstepid(): void {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()

    }
    this.common.loaderStart();
    this.apiService.getstepid(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.stepList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  openModal(flag = 0): void {
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, { centered: true })
    if (this.modalHeader === 'Add') {
      this.reset()
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  onWorkflowChange() {
    for (let i = 0; i < this.workflowList.length; i++) {
      if (this.workflowList[i].id == this.workflowid) {
        this.workflowName = this.workflowList[i].workflowname;
      }
    }
  }

  onFromStepChange() {
    for (let i = 0; i < this.workflowStepList.length; i++) {
      if (this.workflowStepList[i].id == this.fromstepid) {
        this.fromstepname = this.workflowStepList[i].stepname;
      }
    }
  }

  onToStepChange() {
    for (let i = 0; i < this.workflowStepList.length; i++) {
      if (this.workflowStepList[i].id == this.tostepid) {
        this.tostepname = this.workflowStepList[i].stepname;

      }
    }
  }

  onStepNameChange(){
    for (let i = 0; i < this.stepList.length; i++) {
      if (this.stepList[i].id == this.stepworkid) {
        this.stepworkname = this.stepList[i].stepworkname;
      }
    }
  }

  saveData(): any {
    this.errMsg = '';
    if (this.workflowid === '') {
      this.errMsg = 'Please Select the Workflow';
      return false;
    }
    if (this.fromstepid === '') {
      this.errMsg = 'Please Select the From Step';
      return false;
    }
    if (this.tostepid === '') {
      this.errMsg = 'Please Select the To Step';
      return false;
    }
    if (this.stepworkid === '') {
      this.errMsg = 'Please Select the Step Work Type';
      return false;
    }

    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      workflowid: this.workflowid,
      fromstepid: this.fromstepid,
      tostepid: this.tostepid,
      stepworkid: this.stepworkid

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
    this.workflowid = '';
    this.fromstepid = '';
    this.tostepid = '';
    this.stepworkid = '';
    this.workflowName = '';
    this.fromstepname = '';
    this.tostepname = '';
    this.stepworkname = '';
    this.fromstepnames = [];
    this.tostepnames = [];
  }

  edit(obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = obj.id;
    this.workflowid = obj.workflowid;
    this.workflowName = obj.workflowname;
    this.fromstepid = obj.fromstepid;
    this.fromstepname = obj.fromstepname;
    this.tostepid = obj.tostepid;
    this.tostepname = obj.tostepname;
    this.stepworkid = obj.stepworkid;
    this.stepworkname = obj.stepworkname;
    this.openModal(1);
  }

  updateData(): any {
    this.errMsg = '';
    if (this.workflowid === '') {
      this.errMsg = 'Please Select the Workflow';
      return false;
    }
    if (this.fromstepid === '') {
      this.errMsg = 'Please Select the From Step';
      return false;
    }
    if (this.tostepid === '') {
      this.errMsg = 'Please Select the To Step';
      return false;
    }
    if (this.stepworkid === '') {
      this.errMsg = 'Please Select the Step Work Type';
      return false;
    }

    const data = {
      reraid: this.common.getReraId(),
      userid: this.common.getUserId(),
      id: this.selectedId,
      fromstepid: this.fromstepid,
      workflowid: this.workflowid,
      tostepid: this.tostepid,
      stepworkid: this.stepworkid
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
        this.listData[this.selectedPosition].workflowid = this.workflowid;
        this.listData[this.selectedPosition].workflowname = this.workflowName;
        this.listData[this.selectedPosition].fromstepid = this.fromstepid;
        this.listData[this.selectedPosition].fromstepname = this.fromstepname;
        this.listData[this.selectedPosition].tostepid = this.tostepid,
        this.listData[this.selectedPosition].tostepname = this.tostepname;
        this.listData[this.selectedPosition].stepworkid = this.stepworkid
        this.listData[this.selectedPosition].stepworkname = this.stepworkname
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
    this.modalService.open(deleteModal, { centered: true });
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


