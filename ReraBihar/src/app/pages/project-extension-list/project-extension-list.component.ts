import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";
import {NotifierService} from "angular-notifier";
import {ConfigService} from "../../services/config.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-project-extension-list',
    templateUrl: './project-extension-list.component.html',
    styleUrls: ['./project-extension-list.component.css']
})
export class ProjectExtensionListComponent implements OnInit {
    FILE_ROOT = '';
    projectList: any = [];
    projectExtensionList: any = [];
    linkName = 'Project Extension';

    constructor(private router: Router, private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
                private notifier: NotifierService, private config: ConfigService, private modalService: NgbModal) {
        this.FILE_ROOT = this.rest.FILE_ROOT;
    }

    ngOnInit(): void {
        this.projectListForExtension()
    }

    backDash() {
        this.router.navigate(['/pages/project-dashboard']);
    }

    onTabChange(event: any) {
        if (event.index === 1) {
            this.getExtensionList();
        }
    }

    projectListForExtension() {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId()
        };
        this.rest.projectListForExtension(data).subscribe((res: any) => {
            if (res.success) {
                for (const obj of res.response) {
                    const diff = this.common.diffDate(new Date(obj.validatyenddate), new Date())
                    obj.remainingDays = diff.days;
                    obj.validatyenddate = this.common.formatDate(obj.validatyenddate);
                }
                this.projectList = res.response;
            }
        }, (err: any) => {
            this.common.loaderEnd();
        });
    }

    getExtensionList() {
        this.common.loaderStart();
        this.rest.getExtensionList({
            reraid: this.common.getReraId(),
            userid: this.common.getUserId()
        }).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                for (const obj of res.response) {
                    const diff = this.common.diffDate(new Date(obj.projectextexsionperiod), new Date(obj.createdat))
                    obj.remainingDays = diff.days;
                    obj.projectextexsionperiod = this.common.formatDate(obj.projectextexsionperiod);
                }
                this.projectExtensionList = res.response;
            }
        })
    }

    viewCertificateFile(fileName: string) {
        window.open(this.config.CRT_ROOT + fileName, '_blank');
    }

    goToExtension(projectId: number, projectuid: string, extensionId: number) {
        this.router.navigate(['/pages/project-extension-dtl/' + projectId + '/' + projectuid + '/' + extensionId])
    }

}
