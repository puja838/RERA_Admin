import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";

@Component({
  selector: 'app-court-proceedings',
  templateUrl: './court-proceedings.component.html',
  styleUrls: ['./court-proceedings.component.css']
})
export class CourtProceedingsComponent implements OnInit {

  nextOffset = 0;
  paginationType = 'next';
  pageSize = 10;
  previousOffset = 0;
  totalPage = 1;
  causeList: any = [];
  currentPage = 1;
  allocatedBench = 'Authority';
  constructor(private rest: RestApiService) { }

  ngOnInit(): void {
    this.getJudgmentList();
  }

  onRadioChange(event: any): void {
    this.nextOffset = 0;
    this.paginationType = 'next';
    this.getJudgmentList();
  }

  getPageList() {
    const pageList: any = [];
    for(let i = 1; i <= this.totalPage; i++) {
      pageList.push(i);
    }
    return pageList;
  }

  getJudgmentList(): any {
    const data = {
      nextOffset: this.nextOffset,
      paginationType: this.paginationType,
      pageSize: this.pageSize,
      AllocatedBench: this.allocatedBench,
      noteType: 'Proceeding Notes'
    };
    this.rest.getJudgmentList(data).subscribe((res: any) => {
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
    this.getJudgmentList();
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
    this.getJudgmentList();
  }

}
