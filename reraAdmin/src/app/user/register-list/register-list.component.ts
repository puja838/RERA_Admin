import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/services/common.service';
import { ProjectListService } from 'src/app/services/project-list.service';
import { RegisterListService } from 'src/app/services/register-list.service';

@Component({
  selector: 'app-register-list',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.css']
})
export class RegisterListComponent implements OnInit {

  listData: any = []
  rolename: any = ''
  roletype: any = ''
  tiletype: number = 0
  limit = 10;
  offset = 0;
  pages : any = [];
  isNextStep = true;
  isPrevStep = false;
  isPageFont:any ='#007bff';
  isCurrentPageFont:any = ''
  isPageBackground:any ='#fff';
  isCurrentPageBackground:any = ''
  selectedPage:any = 0
  pageLimit = 10

  p: number = 1;
  constructor(private common: CommonService,private notifier: NotifierService,private apiService: RegisterListService,private projectlistService: ProjectListService) { }

  ngOnInit(): void {
    this.selectedPage = this.common.selectedPage
    this.isCurrentPageFont = this.common.isCurrentPageFont
    this.isCurrentPageBackground = this.common.isCurrentPageBackground
    this.limit = this.common.limit
    this.offset = this.common.offset
    sessionStorage.removeItem('pid');
    sessionStorage.removeItem('eid');
    sessionStorage.removeItem('aid');
    this.rolename = this.common.getRolename();
    this.roletype = this.common.getRoletype();
    this.tiletype = this.common.getTileType()
    this.common.setTileType(this.tiletype);
    this.fetchProjectDetails(this.tiletype,1)
    
  }

  fetchProjectDetails(type: number,flag = 0): void {
    if (flag === 1) {
      this.offset = 0;
    }
    const data = {
      reraid: this.common.getReraId(),
      roleid: this.common.getRoleId(),
      userid: this.common.getUserId(),
      // status: this.selectStatus1,
      type: type,
      // limit: this.limit + '',
      // offset: this.offset + '',
    };

    this.common.loaderStart();
    this.apiService.fetchProjectDetails(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        
        this.listData = res.response.resp;
        // this.pages = this.common.getPage(res.response.total,this.limit)
        // if(this.pages.length>1){
        //   this.isNextStep = true
        // } else{
        //   this.isNextStep = false
        // }

        // if(this.pages[this.pages.length-1]==this.selectedPage){
        //   this.isNextStep = false
        // } else {
        //   this.isNextStep = true
        // }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  viewCertificate(fileName:any){
    window.open(this.projectlistService.BASE_ROOT + 'certificate/' + fileName, '_blank');
  }


  // next() {
  //   if (this.isNextStep) {
  //     this.isPrevStep = true;
  //     this.selectedPage = this.common.next()
  //     this.isCurrentPageFont = this.common.isCurrentPageFont
  //     this.isCurrentPageBackground= this.common.isCurrentPageBackground
  //     this.offset = this.common.offset
      
  //     this.fetchProjectDetails(this.tiletype);
  //   }
  // }
  // previous() {
  //   if (this.common.offset > 0) {
  //     this.selectedPage = this.common.previous()
  //     this.isCurrentPageFont = this.common.isCurrentPageFont
  //     this.isCurrentPageBackground= this.common.isCurrentPageBackground
  //     this.offset = this.common.offset
     
  //     this.fetchProjectDetails(this.tiletype);
  //   }
  // }

  // pageChange(page:any){
  //   this.selectedPage = this.common.pageChange(page)
  //   if(page == this.pageLimit){
  //     this.pageLimit = this.pageLimit + this.pageLimit
  //   }
  //   if (this.common.offset === 0) {
  //     this.isPrevStep = false;
  //   } else {
  //     this.isPrevStep = true
  //   }
  //   this.isCurrentPageFont = this.common.isCurrentPageFont
  //   this.isCurrentPageBackground= this.common.isCurrentPageBackground
  //   this.offset = this.common.offset
    
  //   this.fetchProjectDetails(this.tiletype);
  // }

  // onTableDataChange(event: any) {
  //   this.selectedPage = event;
  //   this.fetchProjectDetails(this.tiletype);
  // }

  // onTableSizeChange(event: any): void {
  //   this.tableSize = event.target.value;
  //   this.selectedPage = 1;
  //   this.fetchProjectDetails(this.tiletype);
  // }
}
