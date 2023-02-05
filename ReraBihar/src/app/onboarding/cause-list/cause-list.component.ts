import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";

@Component({
  selector: 'app-cause-list',
  templateUrl: './cause-list.component.html',
  styleUrls: ['./cause-list.component.css']
})
export class CauseListComponent implements OnInit {
  nextOffset = 0;
  paginationType = 'next';
  pageSize = 10;
  previousOffset = 0;
  totalPage = 1;
  causeList: any = [];
  currentPage = 1;
  constructor(private rest: RestApiService) { }

  ngOnInit(): void {
    this.getCauseList();
  }

  getPageList() {
    const pageList: any = [];
    for(let i = 1; i <= this.totalPage; i++) {
      pageList.push(i);
    }
    return pageList;
  }

  getCauseList(): any {
    const data = {
      nextOffset: this.nextOffset,
      paginationType: this.paginationType,
      pageSize: this.pageSize
    };
    this.rest.getCauseList(data).subscribe((res: any) => {
      if (res.success) {
        this.causeList = res.details.dataObj;
        /*this.nextOffset = res.details.nextOffset;
        this.previousOffset = res.details.previousOffset;*/
        if (res.details.totalPage) {
          this.totalPage = res.details.totalPage;
        }
      }
    });
  }

  onPageClick(page: number) {
    this.currentPage = page;
    this.nextOffset = (Number(this.currentPage) - 1) * this.pageSize;
    this.getCauseList();
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
    this.nextOffset = (Number(this.currentPage) - 1) * this.pageSize;
    this.paginationType = page;
    this.getCauseList();
  }

}
