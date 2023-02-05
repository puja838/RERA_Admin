import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { NotifierService } from 'angular-notifier';
import { MstFileVerifyService } from 'src/app/services/mst-file-verify.service';

@Component({
  selector: 'app-mst-file-verify',
  templateUrl: './mst-file-verify.component.html',
  styleUrls: ['./mst-file-verify.component.css']
})
export class MstFileVerifyComponent implements OnInit {
  @ViewChild('modal') modal: any;
  modalHeader = '';
  selectedId = 0;
  selectedPosition = 0;
  errMsg = '';
  listData: any = [];
  projectFieldList: any = [];
  fieldTypeList = [{id:1, fieldname: "Project"},{id:2, fieldname: "Profile"}]
  profileFieldList: any = [];
  selectedFieldid = 0
  selecedFieldName = '';
  isProjectFieldTypeHidden = true;
  isProfileFieldTypeHidden = true;
  selectedStrProjectid = 0;
  selectedFileProjectid = 0
  projectName = ''
  projectNameFileeeee = ''
  selectedStrProfileid = 0;
  selectedFileProfileid = 0;
  profileName = ''
  profileNameFile = ''
  isOnlyFile = false;
  isKeywordDisplay = true;
  keyword = '';
  verifyid = 0;
  constructor(private modalService: NgbModal,private apiService: MstFileVerifyService ,private common: CommonService, private notifier: NotifierService) { }

  ngOnInit(): void {
    // this.getworkflowuser();
    this.getList();
  }

  getList(): void {
    const data = {
      reraid: this.common.getReraId()
    };
    this.common.loaderStart();
    this.apiService.getList(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.listData = res.response;
        for (let i = 0; i < this.listData.length; i++) {
            if(this.listData[i].fromwhich === 1){
              this.listData[i].fromwhichname = "Project"
            }
            else{
              this.listData[i].fromwhichname = "Profile"
            }
        }
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getFieldNameForProject(): void {
    const data = {
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getFieldNameForProject(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.projectFieldList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  getFieldNameForProfile(): void {
    const data = {
      reraid: this.common.getReraId()
    }
    this.common.loaderStart();
    this.apiService.getFieldNameForProfile(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.response) {
        this.profileFieldList = res.response;
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  onFieldChange() {
    console.log(this.selectedFieldid)
    for (let i = 0; i < this.fieldTypeList.length; i++) {
        if(this.fieldTypeList[i].id === this.selectedFieldid){
          this.selecedFieldName = this.fieldTypeList[i].fieldname
        }
    }
    if(this.selectedFieldid == 1){
      this.isProfileFieldTypeHidden = true;
      this.profileFieldList = [];
      this.selectedStrProfileid = 0;
      this.isProjectFieldTypeHidden = false
      this.getFieldNameForProject();
    }
    else if(this.selectedFieldid == 2){
      this.isProjectFieldTypeHidden = true;
      this.projectFieldList = [];
      this.selectedStrProjectid = 0
      this.isProfileFieldTypeHidden = false
      this.getFieldNameForProfile();
    }
    else{
      this.profileFieldList = [];
      this.projectFieldList = [];
      this.selectedStrProjectid = 0;
      this.selectedStrProfileid = 0;
      this.isProfileFieldTypeHidden = true;
      this.isProjectFieldTypeHidden = true;
    }

  }

  onFileCheck(){
    if(this.isOnlyFile === true){
      this.isKeywordDisplay = false;
      this.selectedStrProfileid = 0;
      this.selectedStrProjectid = 0;
    }
    else{
      this.isKeywordDisplay = true
      this.keyword = ''
    }
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

  onProjectChange() {
    for (let i = 0; i < this.projectFieldList.length; i++) {
      if (this.projectFieldList[i].id == this.selectedStrProjectid) {
        this.projectName = this.projectFieldList[i].fielddisplaydesc;
      }
    }
  }

  onFileProjectChange() {
    for (let i = 0; i < this.projectFieldList.length; i++) {
      if (this.projectFieldList[i].id == this.selectedFileProjectid) {
        this.profileNameFile = this.projectFieldList[i].fielddisplaydesc;
      }
    }
  }

  onProfileChange() {
    for (let i = 0; i < this.profileFieldList.length; i++) {
      if (this.profileFieldList[i].id == this.selectedStrProfileid) {
        this.profileName = this.profileFieldList[i].fielddisplaydesc;
      }
    }
  }

  onFileProfileChange(){
    for (let i = 0; i < this.profileFieldList.length; i++) {
      if (this.profileFieldList[i].id == this.selectedFileProfileid) {
        this.profileNameFile = this.profileFieldList[i].fielddisplaydesc;
      }
    }
  }

  saveData(): any {
    let strfieldid
    let filefieldid
    this.errMsg = '';
    if (this.selectedFieldid == 0) {
      this.errMsg = 'Please select the field type';
      return false;
    }

    if(this.selectedFieldid == 1 && this.isOnlyFile == false){
      if (this.selectedStrProjectid === 0) {
        this.errMsg = 'Please select the project';
        return false;
      }
      if (this.selectedFileProjectid === 0) {
        this.errMsg = 'Please select the project';
        return false;
      }
      strfieldid = this.selectedStrProjectid
      filefieldid = this.selectedFileProjectid
    }
    else if(this.selectedFieldid == 2 && this.isOnlyFile == false) {
      if (this.selectedStrProfileid == 0) {
        this.errMsg = 'Please select the profile';
        return false;
      }
      if (this.selectedFileProfileid == 0) {
        this.errMsg = 'Please select the profile';
        return false;
      }
      strfieldid = this.selectedStrProfileid
      filefieldid = this.selectedFileProfileid
    }

    if(this.selectedFieldid == 1 && this.isOnlyFile === true){
      if (this.keyword == '') {
        this.errMsg = 'Please Enter the keyword';
        return false;
      }
      if (this.selectedFileProjectid === 0) {
        this.errMsg = 'Please select the project';
        return false;
      }

      filefieldid = this.selectedFileProjectid
    } else if(this.selectedFieldid == 2 && this.isOnlyFile === true){
      if (this.keyword == '') {
        this.errMsg = 'Please Enter the keyword';
        return false;
      }
      if (this.selectedFileProfileid == 0) {
        this.errMsg = 'Please select the profile';
        return false;
      }
      filefieldid = this.selectedFileProfileid
    }
    const data = {
      reraid: this.common.getReraId(),
      fromwhich : this.selectedFieldid,
      strfieldid: strfieldid,
      filefieldid: filefieldid,
      onlyfile : this.isOnlyFile == true? 1:2,
      keyword : this.keyword
    };
    console.log(JSON.stringify(data))
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
    this.selectedFieldid = 0;
    this.isOnlyFile = false;
    this.keyword = '';
    this.selectedStrProfileid = 0;
    this.selectedFileProfileid = 0;
    this.selectedStrProjectid = 0;
    this.selectedFileProjectid = 0;
    this.isProjectFieldTypeHidden = true;
    this.isProfileFieldTypeHidden = true;
    this.isKeywordDisplay = true;
    this.errMsg = '';
  }

  edit(obj: any, pos: number): void {
    console.log(obj)
    this.selectedPosition = pos;
    this.selectedId = obj.id;
    this.verifyid = obj.vefificationid;
    this.selectedFieldid = obj.fromwhich;
    this.selecedFieldName = obj.fromwhichname
    if(this.selectedFieldid == 1){
      this.projectFieldList = []
      this.isProjectFieldTypeHidden = false;
      this.isProfileFieldTypeHidden = true;
      this.getFieldNameForProject();
      this.selectedStrProjectid = obj.strfieldid;
      this.selectedFileProjectid = obj.filefieldid
    }
    else{
      this.profileFieldList = []
      this.isProjectFieldTypeHidden = true;
      this.isProfileFieldTypeHidden = false;
      this.getFieldNameForProfile();
      this.selectedStrProfileid = obj.strfieldid;
      this.selectedFileProfileid = obj.filefieldid
    }
    this.isOnlyFile = obj.onlyfile== 2? false:true
    if(this.isOnlyFile === true){
      this.isKeywordDisplay = false
      this.keyword = obj.keywords,
      this.selectedStrProjectid = obj.fieldid
    }
    this.openModal(1);
  }

  updateData(): any {
    let strfieldid :any
    let filefieldid : any;
    this.errMsg = '';
    if (this.selectedFieldid == 0) {
      this.errMsg = 'Please select the field type';
      return false;
    }

    if(this.selectedFieldid == 1 && this.isOnlyFile == false){
      if (this.selectedStrProjectid === 0) {
        this.errMsg = 'Please select the project';
        return false;
      }
      if (this.selectedFileProjectid === 0) {
        this.errMsg = 'Please select the project';
        return false;
      }
      strfieldid = this.selectedStrProjectid
      filefieldid = this.selectedFileProjectid
    }
    else if(this.selectedFieldid == 2 && this.isOnlyFile == false) {
      if (this.selectedStrProfileid == 0) {
        this.errMsg = 'Please select the profile';
        return false;
      }
      if (this.selectedFileProfileid == 0) {
        this.errMsg = 'Please select the profile';
        return false;
      }
      strfieldid = this.selectedStrProfileid
      filefieldid = this.selectedFileProfileid
    }

    if(this.selectedFieldid == 1 && this.isOnlyFile === true){
      if (this.keyword == '') {
        this.errMsg = 'Please Enter the keyword';
        return false;
      }
      if (this.selectedFileProjectid === 0) {
        this.errMsg = 'Please select the project';
        return false;
      }

      filefieldid = this.selectedFileProjectid
    } else if(this.selectedFieldid == 2 && this.isOnlyFile === true){
      if (this.keyword == '') {
        this.errMsg = 'Please Enter the keyword';
        return false;
      }
      if (this.selectedFileProfileid == 0) {
        this.errMsg = 'Please select the profile';
        return false;
      }
      filefieldid = this.selectedFileProfileid
    }

    const data = {
      reraid: this.common.getReraId(),
      id: this.selectedId,
      vefificationid: this.verifyid,
      fromwhich : this.selectedFieldid,
      strfieldid: strfieldid,
      filefieldid: filefieldid,
      onlyfile : this.isOnlyFile == true? 1:2,
      keyword : this.keyword
    };
    this.apiService.updateData(data).subscribe((res: any) => {
      if (res.success) {
          // this.listData[this.selectedPosition].fromwhich = this.selectedFieldid,
          // this.listData[this.selectedPosition].fromwhichname = this.selecedFieldName,
          // this.listData[this.selectedPosition].strfieldid = strfieldid,
          // // this.listData[this.selectedPosition].strfieldname = this.stepname,
          // this.listData[this.selectedPosition].filefieldid = filefieldid,
          // // this.listData[this.selectedPosition].filefieldname = this.fstepworkname;
          // this.listData[this.selectedPosition].onlyfile = this.isOnlyFile == true ? 'None':'Only File';
          // this.listData[this.selectedPosition].keyword = this.keyword,
          this.getList()
          this.closeModal();
        this.notifier.notify('success', res.message);
        this.reset();
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }

  openDeleteModal(deleteModal: any, id: number, onlyfile:number, pos: number): void {
    console.log(id,onlyfile)
    this.selectedPosition = pos;
    this.selectedId = id;
    this.verifyid = onlyfile;
    console.log( this.selectedId,this.verifyid)
    this.modalService.open(deleteModal, { centered: true });
  }

  deleteData(): void {
    const data = {
      reraid: this.common.getReraId(),
      id: this.selectedId,
      vefificationid:this.verifyid
    };
    console.log(JSON.stringify(data))
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

