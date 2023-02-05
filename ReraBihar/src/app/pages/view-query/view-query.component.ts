import {Component, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {ActivatedRoute, Router} from "@angular/router";
import {PromoterWorkflowService} from "../../services/promoter-workflow.service";
import {CommonService} from "../../services/common.service";
import {RestApiService} from "../../services/rest-api.service";

@Component({
    selector: 'app-view-query',
    templateUrl: './view-query.component.html',
    styleUrls: ['./view-query.component.css']
})
export class ViewQueryComponent implements OnInit {
    private projectid: number = 0;
    projName: string = '';
    applicationNo: string = '';
    projectType: string = '';
    address: string = '';
    startDate: string = '';
    status: string = '';
    queries: any[] = [];
    currentstepid: number = 0;
    workflowid: number = 0;
    private scrtiny2stepid: number = 0;
    SCRUTINY2_STEP_SEQ = 9;
    private promotorid: number = 0;
    stepworkid: any | number;
    private workflowhistoryid: string = '';
    private extensionId: any;
    workflowtype: number = 0;
    REGISTRATION_TYPE = 1;
    EXTENSION_TYPE = 2;
    AGENT_TYPE = 3;
    agentid: number = 0;
    userno: string = '';
    agentname: string = '';
    applicationType: string = '';

    constructor(private notifier: NotifierService, private route: Router,
                private apiService: PromoterWorkflowService, private activeRoute: ActivatedRoute,
                private common: CommonService, private rest: RestApiService) {
    }

    ngOnInit(): void {
        this.projectid = Number(this.activeRoute.snapshot.paramMap.get('projectid'));
        this.extensionId = sessionStorage.getItem('eid');
        this.workflowtype = this.common.getWorkflowType();
        if (this.workflowtype === this.AGENT_TYPE) {
            this.applicationType='Agent Registration';
            this.agentid = this.projectid;
            this.projectid = 0;
        }else if(this.workflowtype === this.EXTENSION_TYPE){
            this.applicationType='Project Extension';
        }else{
            this.applicationType='Project Registration'
        }
        this.getProjectDetail();
        this.getSingleQueryAnswer()
    }

    goToProjectDetails(): void {
        this.route.navigate([])
            .then((result: any) => {
                window.open(this.rest.BASE_PATH + '/pages/project-details/' + this.projectid + '/1' + '/' + this.applicationNo, '_blank');
            })
    }

    goToAgentDetails() {
        this.route.navigate([])
            .then((result: any) => {
                window.open(this.rest.BASE_PATH + 'pages/agent-registration-application', '_blank');
            })
    }

    getProjectDetail(): any {
        let data: any = {};
        data = {projectid: this.projectid, reraid: this.common.getReraId(), workflowtype: this.workflowtype,userid: this.common.getUserId()};
        // if (this.extensionId !== 'null') {
        //     data['extensionid'] = this.extensionId;
        // }
        if (this.workflowtype === this.AGENT_TYPE) {
            data['agentid'] = this.agentid;
        } else {
            data['projectid'] = this.projectid;
            if (this.workflowtype === this.EXTENSION_TYPE) {
                data['extensionid'] = this.extensionId;
            }
        }
        this.apiService.fetchProjectDetailsById(data).subscribe((res: any) => {
            if (res.success) {
                if (res.response.length > 0) {
                    const projectdetails = res.response[0];
                    this.projName = projectdetails.projectfieldvalue;
                    this.address = projectdetails.address;
                    this.projectType = projectdetails.projectType;
                    this.startDate = projectdetails.projectStartDate;
                    this.applicationNo = projectdetails.projectuid;
                    this.status = projectdetails.progressstatus;
                    this.currentstepid = projectdetails.tostepid;
                    this.workflowid = projectdetails.workflowid;
                    this.promotorid = projectdetails.particularprofileid;
                    this.stepworkid = projectdetails.stepworkid;
                    this.workflowhistoryid = projectdetails.workflowhistoryid;
                    // this.workflowtype = res.response[0].workflowtype;
                    this.userno = res.response[0].userno;
                    this.agentname = res.response[0].agentname;
                }
            } else {
                this.notifier.notify('error', res.message)
            }
        });
    }

    getSingleQueryAnswer(): any {
        // let data: any = {}
        // data = {reraid: this.common.getReraId(), type: [1], projectid: this.projectid};
        // if (this.extensionId !== 'null') {
        //     data['extensionid'] = this.extensionId
        // }
        let data: any = {};
        data = {

            reraid: this.common.getReraId(),
            workflowtype: this.workflowtype,
            type: [1],
            userid: this.common.getUserId()
        };
        if (this.workflowtype === this.AGENT_TYPE) {
            data['agentid'] = this.agentid
        } else {
            data['projectid'] = this.projectid;
            if (this.workflowtype === this.EXTENSION_TYPE) {
                data['extensionid'] = this.extensionId;
            }
        }
        this.common.loaderStart();
        this.apiService.getSingleQueryAnswer(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.queries = res.response;
                for (let i = 0; i < this.queries.length; i++) {
                    const date1: any = new Date(this.queries[i].dateofquery);
                    const date2: any = new Date();
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (this.queries[i].permissibletime > diffDays) {
                        this.queries[i].remaining = this.queries[i].permissibletime - diffDays;
                    } else {
                        this.queries[i].remaining = 0
                    }
                    // console.log(diffDays)
                }
            } else {
                this.notifier.notify('error', res.message)
            }
        });
    }

    gotoResponse(id: any) {
        sessionStorage.setItem('wh', this.workflowhistoryid);
        let projid=0;
        if(this.workflowtype===this.AGENT_TYPE){
            projid=this.agentid;
        }else{
            projid=this.projectid;
        }
        // console.log(projid);
        this.route.navigate(['/pages/queryResponse/' + projid + '/' + id]);
    };

    submit() {
        const data = {
            reraid: this.common.getReraId(),
            workflowid: this.workflowid,
            fromstepid: this.currentstepid
            ,userid: this.common.getUserId()
        };
        this.common.loaderStart();
        this.apiService.getNextStepDetails(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                const nextSteps = res.response;
                for (let i = 0; i < nextSteps.length; i++) {
                    if (nextSteps[i].seqno === this.SCRUTINY2_STEP_SEQ) {
                        this.scrtiny2stepid = nextSteps[i].id;
                        this.moveWorkflow(this.scrtiny2stepid)
                        break;
                    }
                }

            }
        }, (err: any) => {
            this.common.loaderEnd();
        })
    }

    moveWorkflow(id: any, roleid = 0, userid = 0) {
        // alert(JSON.stringify(this.nextSteps))
        // alert(id);
        let data: any = {};
        data = {
            reraid: this.common.getReraId(),
            // uniqueprojectid: this.projectid,
            // uniquepromoterid: this.promotorid,
            userid: this.common.getUserId(),
            fromstepid: this.currentstepid,
            tostepid: id,
            forwardflg: 1,
            steproleid: roleid,
            stepuserid: userid,
            stepworkid: this.stepworkid,
            workflowtype: this.workflowtype
        };
        if (this.workflowtype === this.AGENT_TYPE) {
            data['agentid'] = this.agentid
        } else {
            data['uniqueprojectid'] = this.projectid;
            data['uniquepromoterid'] = this.promotorid;
            if (this.workflowtype === this.EXTENSION_TYPE) {
                data['extensionid'] = this.extensionId;
            }
        }
        this.common.loaderStart();
        this.apiService.moveWorkflow(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.notifier.notify('success', res.message);
                // sessionStorage.removeItem("pid")
                this.route.navigate(['pages/queryDashboard'])
                // alert(res.message)
            } else {
                this.notifier.notify('error', res.message);
                // alert(res.message)
            }
        }, (err: any) => {
            this.common.loaderEnd();
        })
    }
}
