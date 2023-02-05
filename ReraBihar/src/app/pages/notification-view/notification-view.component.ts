import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notification-view',
  templateUrl: './notification-view.component.html',
  styleUrls: ['./notification-view.component.css']
})
export class NotificationViewComponent implements OnInit, OnChanges {
  notificationList: any = [];
  offset = 0;
  limit = 10;
  @Input() totalCount = 0;
  totalPage = 1;
  currentPage = 1;
  paginationType = '';
  constructor(private rest: RestApiService, private common: CommonService, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (this.totalCount > 0) {
      this.getNotificationList();
      // this.totalPage = Math.ceil(this.totalCount / this.limit);
    }
  }

  /*getPageList() {
    const pageList: any = [];
    for(let i = 1; i <= this.totalPage; i++) {
      pageList.push(i);
    }
    return pageList;
  }*/

  getNotificationList() {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    };
    this.rest.getAlerts(data).subscribe((res: any) => {
      if (res.success) {
        this.notificationList = res.response;
      }
    })
  }

  goToDetails(obj: any) {
    // /pages/update-project/212/1/3lkt61l7srbpin
    if (obj.type === 'update') {
      this.router.navigate(['/pages/update-project/'+ obj.id+'/1/' + obj.projectuid]);
    } else if (obj.type === 'extension') {
      this.router.navigate(['/pages/project-extension-dtl/'+ obj.id+'/' + obj.projectuid + '/0']);
    }
  }

  /*onPageClick(page: number) {
    this.currentPage = page;
    this.offset = (Number(this.currentPage) - 1) * this.limit;
    this.getNotificationList();
  }

  onBtnClick(page: string) {
    if(page === 'next') {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
      if (this.currentPage < 0) {
        this.currentPage = 0;
      }
    }
    this.offset = (Number(this.currentPage) - 1) * this.limit;
    this.paginationType = page;
    this.getNotificationList();
  }*/

}
