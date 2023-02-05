import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import {MstProfileFieldsService} from '../../services/mst-profile-fields.service';
import {RestApiService} from '../../services/rest-api.service';

@Component({
  selector: 'app-mst-users',
  templateUrl: './mst-users.component.html',
  styleUrls: ['./mst-users.component.css']
})
export class MstUsersComponent implements OnInit {

  @ViewChild('modal') modal: any;
  modalHeader = '';
  userName = '';
  password = '';
  roles = '';

  isUnique = false;
  errMsg = '';
  listData: any = [];
  rolelistData: any = [];
  selectedId = 0;
  selectedPosition = 0;
  fieldTypeDict: any;
  controlTypeDict: any;
  controlTypeKeys: any = [];
  fieldTypeKeys: any = [];
  userEdit = {} as any;
  userLoginType = '1';
  SptgrpSelected = '';
  email = '';
  address = '';
  mobile = '';  
  constructor(private modalService: NgbModal, private apiService: MstProfileFieldsService, private common: CommonService,
              private notifier: NotifierService, private rest: RestApiService) {
  }

  ngOnInit(): void {
    this.fieldTypeDict = this.common.fieldTypeDict;
    this.controlTypeDict = this.common.controlTypeDict;
    this.controlTypeKeys = Object.keys(this.common.controlTypeDict);
    this.fieldTypeKeys = Object.keys(this.common.fieldTypeDict);
    this.getData();
    this.getRoleData();
  }

  getRoleData(): any {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.rest.rolelist(data).subscribe((res: any) => {
      this.common.loaderEnd();
      // console.log(res)
      if (res.success) {
        this.rolelistData = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })

  }

  getData(): any {
    const data = {
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.rest.list(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.listData = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })

  }

  openModal(flag = 0): void {
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, {centered: true})
    this.reset();
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }
  mailformat = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$";
  saveData(): any {
    let err = 0;
    this.errMsg = '';
    if (this.userName === '') {
      this.errMsg = 'Please enter the username';
      err++
    }
    if (this.password === '') {
      this.errMsg = 'Please enter the filed password';
      err++
    }
    if (this.email.trim() === '') {
      this.errMsg ='Please enter email';
      err++;
    } 

    if (!this.email.match(this.mailformat)) {
      this.errMsg ='Please enter valid email';
      err++;
    }
    if (this.roles === '') {
      this.errMsg = 'Please enter the roles';
      err++
    }
    if(this.userLoginType!= '1' && this.SptgrpSelected==''){
      this.errMsg = 'Please select support group';
      err++
    }
    if(this.userLoginType== '1'){
      this.SptgrpSelected='';
    }
    const data = {
      username: this.userName,
      password: this.password,
      reraid: this.common.getReraId(),
      roleid: this.roles,
      userLoginType :this.userLoginType,
      SptgrpSelected :this.SptgrpSelected,
      useremail:this.email,
      address:this.address,
      usermobile:this.mobile
    };
    if (err === 0) {
      this.rest.add(data).subscribe((res: any) => {
        if (res.success) {
          this.getData();
          this.closeModal();
          this.reset();
          this.notifier.notify('success', res.message);
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    }

  }

  reset(): void {
    this.userName = '';
    this.password = '';
    this.roles = '';
  }

  edit(obj: any, pos: number): void {
    this.userEdit = obj;
    this.selectedPosition = pos;
    this.openModal(1);
  }

  updateData(): any {
    let err = 0;
    this.errMsg = '';
    if (this.userEdit.username === '') {
      this.errMsg = 'Please enter the username';
      err++
    }
  
    if (this.userEdit.useremail.trim() === '') {
      this.errMsg ='Please enter email';
      err++;
    } 

    if (!this.userEdit.useremail.match(this.mailformat)) {
      this.errMsg ='Please enter valid email';
      err++;
    }
   
    if(this.userEdit.userLoginType!= '1' && this.userEdit.SptgrpSelected==''){
      this.errMsg = 'Please select support group';
      err++
    }
    if (this.userEdit.roleid === '') {
      this.errMsg = 'Please select roles';
      err++
    }
    if(this.userEdit.userLoginType== '1'){
      this.userEdit.SptgrpSelected='';
    }
    const data = {
      userid: this.userEdit.userid,
      username: this.userEdit.username,
      reraid: this.common.getReraId(),
      roleid: this.userEdit.roleid,
      userLoginType :this.userEdit.userLoginType,
      SptgrpSelected :this.userEdit.SptgrpSelected,
      useremail:this.userEdit.useremail,
      address:this.userEdit.address,
      usermobile:this.userEdit.usermobile
    };


    if (err === 0) {
      this.rest.update(data).subscribe((res: any) => {
        if (res.success) {
          this.closeModal();
          this.notifier.notify('success', res.message);
          this.reset();
          this.getData();
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
      userid: this.selectedId
    };
    this.rest.delete(data).subscribe((res: any) => {
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
