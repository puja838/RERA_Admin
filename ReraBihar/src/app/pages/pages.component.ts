import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor(private route: Router, private common: CommonService,public translate: TranslateService) { }

  ngOnInit(): void {
    // this.common.generateYearList();
    this.common.getLanguage();
    if (this.common.language != null || this.common.language != undefined) {
      this.switchLang(this.common.language);
      // this.translate.use(this.common.language);
    } else {
      this.switchLang('en');
      this.translate.use('en');
    }
  }

  switchLang(lang: string) {
    this.common.setLanguage(lang);
    this.translate.use(lang);
  }

}
