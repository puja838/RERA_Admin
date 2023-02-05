import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-alert-notifucation',
  templateUrl: './alert-notifucation.component.html',
  styleUrls: ['./alert-notifucation.component.css']
})
export class AlertNotifucationComponent implements OnInit {
  linkName = 'View Alerts/Notifications';
  workflowtype: number = 1;
  entityid: any;

  expDate = ''
  remaining: any = 0
  messages:any = []
  constructor(private rest: RestApiService, private common: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.getNotificationList();
  }

  goToNext(type:any){
    if(type == 'query'){
      this.router.navigate(['/pages/queryDashboard'])
    } else{
      this.router.navigate([ '/pages/agent-register'])
    }
  }


  getNotificationList() {
    const data = {
      userid: this.common.getUserId(),
      reraid: this.common.getReraId()
    };
    this.rest.getAlertsRenual(data).subscribe((res: any) => {
      if (res.success) {
        this.messages = res.response;
      }
    })
  }

}
