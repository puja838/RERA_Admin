import {Component, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";
import {CommonService} from "../../services/common.service";
import {PromoterWorkflowService} from "../../services/promoter-workflow.service";

@Component({
    selector: 'app-promoter-query-dashboard',
    templateUrl: './promoter-query-dashboard.component.html',
    styleUrls: ['./promoter-query-dashboard.component.css']
})
export class PromoterQueryDashboardComponent implements OnInit {
    projects: any[] = [];
    name = '';
    linkName = 'Queries from RERA';
    workflowtype: number = 1;
    entityid: any;

    constructor(private notifier: NotifierService, private route: Router,
                private apiService: PromoterWorkflowService, private common: CommonService) {
    }

    ngOnInit(): void {
        this.name = this.common.getUserName();
        this.entityid = sessionStorage.getItem('entityid');
        sessionStorage.removeItem('eid');
        if (this.entityid === '2') {
            this.workflowtype = 3
        }
        this.getPromoterQueryDashboard(this.workflowtype);
    }

    goToProfile() {
        this.route.navigate(['/pages/profile-details'])
    }

    goToAnnualReport() {
        this.route.navigate(['/pages/annual-report'])
    }

    logout() {
        sessionStorage.clear();
        this.route.navigate(['/']);
    }

    backDash() {
        this.route.navigate(['/pages/project-dashboard'])
    }

    getPromoterQueryDashboard(workflowtype: number): any {
        const data = {reraid: this.common.getReraId(), userid: this.common.getUserId(), workflowtype: workflowtype};
        this.apiService.getPromoterQueryDashboard(data).subscribe((res: any) => {
            if (res.success) {
                this.projects = res.response;

            } else {
                this.notifier.notify('error', res.message)
            }
        });
    }

    openProject(projectid: number, extensionid: string='') {
        if(extensionid !== '') {
            sessionStorage.setItem('eid', extensionid);
        }
        this.common.setWorkflowType(this.workflowtype);
        this.route.navigate(['/pages/viewQuery/' + projectid]);
    }

    getDetails(number: number) {
        this.workflowtype = number;
        this.getPromoterQueryDashboard(this.workflowtype);
    }
}
