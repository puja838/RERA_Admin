import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.css']
})
export class WhatsNewComponent implements OnInit {
  newItems: any = [];
  constructor(private rest: RestApiService, private common: CommonService) { }

  ngOnInit(): void {
    this.getWhatsNew();
  }

  getWhatsNew() {
    this.common.loaderShow();
    this.rest.getWhatsNew().subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        for (const obj of res.response) {
          obj.approvaltime = new Date(obj.approvaltime).toLocaleDateString()
        }
        this.newItems = res.response;
      }
    })
  }

}
