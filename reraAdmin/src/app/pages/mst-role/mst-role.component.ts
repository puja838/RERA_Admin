import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import {MstProfileFieldsService} from '../../services/mst-profile-fields.service';
import {RestApiService} from '../../services/rest-api.service';

@Component({
  selector: 'app-mst-role',
  templateUrl: './mst-role.component.html',
  styleUrls: ['./mst-role.component.css']
})
export class MstRoleComponent implements OnInit {


  @ViewChild('modal') modal: any;
  modalHeader = '';
  fieldDisplay = '';
  fieldName = '';
  fieldType = '';
  controlType = '';
  controlValue = '';
  isUnique = false;
  errMsg = '';
  listData: any = [];
  selectedId = 0;
  selectedPosition = 0;
  fieldTypeDict: any;
  controlTypeDict: any;
  controlTypeKeys: any = [];
  fieldTypeKeys: any = [];

  // roleArray= [] as any;

  roleid = ''
  roleDesc = ''

  constructor(private modalService: NgbModal, private apiService: MstProfileFieldsService, private common: CommonService,
              private notifier: NotifierService, private rest: RestApiService) {
  }

  ngOnInit(): void {
    this.fieldTypeDict = this.common.fieldTypeDict;
    this.controlTypeDict = this.common.controlTypeDict;
    this.controlTypeKeys = Object.keys(this.common.controlTypeDict);
    this.fieldTypeKeys = Object.keys(this.common.fieldTypeDict);
    this.getData();
  }

  getData(): any {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.rest.rolelist(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.listData = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })

  }


  openModal(flag = 0): void {
    this.modalHeader = 'Update';
    this.modalService.open(this.modal, {centered: true})
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  reset(): void {
    this.roleDesc = '';
    this.roleid = ''
  }

  edit(obj: any, pos: number): void {
    this.selectedPosition = pos;
    this.roleDesc = obj.roledesc;
    this.roleid = obj.roleid;
    this.openModal(1);
  }

  updateData(): any {
    var err = 0;
    this.errMsg = '';
    if (this.roleDesc === '') {
      this.errMsg = 'Please enter the role';
      err++
    }
    const data = {
      reraid: this.common.getReraId(),
      roleid: this.roleid,
      roleName: this.roleDesc
    };

    if (err === 0) {
      this.rest.changeRoleName(data).subscribe((res: any) => {
        if (res.success) {
          this.closeModal();
          this.notifier.notify('success', res.message);
          this.reset();
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    }
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

  generateFieldId(event: any) {
    this.fieldName = event.target.value.replace(/[^a-zA-Z_ ]/g, "").replace(' ', '_');
  }

}
