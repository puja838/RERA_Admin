import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {ConfigService} from "../../services/config.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements OnInit {
  @Input() linkName = '';
  @Output() onDashboardClick:EventEmitter<string>= new EventEmitter();
  name = '';
  @Input() dashboardURL = 'project-dashboard';
  constructor(private router: Router, private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
              ) {
  }

  ngOnInit(): void {
    this.name = this.common.getUserName();
  }

  goToProfile() {
    this.router.navigate(['/pages/profile-details'])
  }

  goToAnnualReport() {
    this.router.navigate(['/pages/annual-report'])
  }

  backDash() {
    this.router.navigate(['/pages/' + this.dashboardURL]);
    this.onDashboardClick.emit('reset');
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}
