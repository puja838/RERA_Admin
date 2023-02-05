import { Component, OnInit,ViewChild } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {NotifierService} from 'angular-notifier';
import {MstProfileFieldsService} from '../../services/mst-profile-fields.service';
import {RestApiService} from '../../services/rest-api.service';
@Component({
  selector: 'app-mst-noticeboard',
  templateUrl: './mst-noticeboard.component.html',
  styleUrls: ['./mst-noticeboard.component.css']
})
export class MstNoticeboardComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  subject = '';
  dateofnotice = '';
  bannarimage = '';
  document = '';
  type = '';

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
  noticeEdit = {} as any;
  SptgrpSelected = '';
  email = '';
  address = '';
  mobile = '';  
  isNextStep = true;
  isPrevStep = false;
  limit = 20;
  offset = 0;
  searchText =''
  searchType ='';
  constructor(private modalService: NgbModal, private apiService: MstProfileFieldsService, private common: CommonService,
    private notifier: NotifierService, private rest: RestApiService) {
}


  ngOnInit(): void {
    this.getData()
  }
  openModal(flag = 0): void {
    this.modalHeader = flag === 0 ? 'Add' : 'Update';
    this.modalService.open(this.modal, {centered: true})
    this.reset();
  }
  reset(): void {
    this.subject = '';
    this.dateofnotice = '';
    this.bannarimage = '';
    this.document = '';
    this.type = '';
  }
  getData(flag = 0): any {
    if (flag === 1) {
      this.offset = 0;
    }
    const data = {
      limit: this.limit + '',
      offset: this.offset + '',
      searchText: this.searchText,
      searchType: this.searchType
    }
    this.common.loaderStart();
    this.rest.noticelist(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.listData = res.response;
        this.isNextStep = this.listData.length >= this.limit;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })

  }
  closeModal(): void {
    this.modalService.dismissAll();
  }
  uploadFile(event:any,fileType:any){
    if (event.target.files.length > 0) {
        const fd = new FormData();
        fd.append('file', event.target.files[0]);
        console.log(fd)
        this.rest.uploadFile(fd).subscribe((res: any) => {
            if (res.success) {
              console.log(fileType)
              if(fileType=='banner'){
                this.bannarimage = res.response.fileName
              }else if(fileType=='bannerEdit'){
                this.noticeEdit.bannarimage = res.response.fileName
              }else if(fileType=='doc'){
                this.document = res.response.fileName
              }else if(fileType=='docEdit'){
                this.noticeEdit.document = res.response.fileName
              }
              
            }
        })
    }
  }
  edit(obj: any, pos: number): void {
    this.noticeEdit = obj;
    this.selectedPosition = pos;
    this.openModal(1);
  }
  openDeleteModal(deleteModal: any, id: number, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = id;
    this.modalService.open(deleteModal, {centered: true});
  }
  saveData(): any {
    let err = 0;
    this.errMsg = '';
    if (this.subject === '') {
      this.errMsg = 'Please enter the subject';
      err++
    }else if (this.dateofnotice === '') {
      this.errMsg ='Please enter date of notice';
      err++;
    }else if (this.document=='') {
      this.errMsg ='Please upload document';
      err++;
    }else if (this.type === '') {
      this.errMsg = 'Please select type';
      err++
    }
    
    const data = {
      userid: this.common.getUserId(),
      subject: this.subject,
      dateofnotice: this.dateofnotice,
      bannarimage: this.bannarimage,
      document :this.document,
      type :this.type
    };
    console.log(data)

    if (err === 0) {
      this.rest.noticeadd(data).subscribe((res: any) => {
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
  openTab(data:any){
    window.open(this.rest.NEWS_ROOT+data)
  }
  updateData(): any {
    let err = 0;
    this.errMsg = '';
    if (this.noticeEdit.subject === '') {
      this.errMsg = 'Please enter the subject';
      err++
    }
  
    if (this.noticeEdit.dateofnotice === '') {
      this.errMsg ='Please enter date of notice';
      err++;
    } 

    if (this.noticeEdit.document=='') {
      this.errMsg ='Please upload document';
      err++;
    }
   
    
    if (this.noticeEdit.type === '') {
      this.errMsg = 'Please select type';
      err++
    }
    
    const data = {
      userid: this.common.getUserId(),
      noticeid: this.noticeEdit.noticeid,
      subject: this.noticeEdit.subject,
      dateofnotice: this.noticeEdit.dateofnotice,
      bannarimage: this.noticeEdit.bannarimage,
      document :this.noticeEdit.document,
      type :this.noticeEdit.type
    };


    if (err === 0) {
      this.rest.noticeupdate(data).subscribe((res: any) => {
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
  deleteData(): void {
    const data = {
      noticeid: this.selectedId
    };
    this.rest.noticedelete(data).subscribe((res: any) => {
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
  next(): void {
    if (this.isNextStep) {
      this.isPrevStep = true;
      this.offset += this.limit;
      this.getData();
    }
  }
  previous(): void {
    if (this.offset > 0) {
      this.offset = this.offset - this.limit;
      if (this.offset === 0) {
        this.isPrevStep = false;
      }
      this.getData();
    }
  }
}
