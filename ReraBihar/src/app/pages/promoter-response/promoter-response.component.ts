import { Component, OnInit } from '@angular/core';
import {NotifierService} from "angular-notifier";
import {ActivatedRoute, Router} from "@angular/router";
import {PromoterWorkflowService} from "../../services/promoter-workflow.service";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-promoter-response',
  templateUrl: './promoter-response.component.html',
  styleUrls: ['./promoter-response.component.css']
})
export class PromoterResponseComponent implements OnInit {
  private projectid: number=0;
  private queryid: number=0;
  private workflowhistoryid: any;
  query: string='';
  docs: string='N/A';
  response: any[]=[];
  private promoterid: number=0;
  linkName = 'Response to Query';
  REGISTRATION_TYPE = 1;
  EXTENSION_TYPE = 2;
  AGENT_TYPE = 3;
  agentid: number = 0;
  workflowtype: number = 0;
  private extensionId: any;
  promanswer: any[]=[];
  constructor(private notifier: NotifierService, private route: Router,
              private apiService: PromoterWorkflowService, private activeRoute: ActivatedRoute, private common: CommonService) {
  }

  ngOnInit(): void {
    this.projectid = Number(this.activeRoute.snapshot.paramMap.get('projectid'));
    this.queryid = Number(this.activeRoute.snapshot.paramMap.get('queryid'));
    this.extensionId = sessionStorage.getItem('eid');
    this.workflowhistoryid= sessionStorage.getItem('wh');
    this.workflowtype = this.common.getWorkflowType();
    if (this.workflowtype === this.AGENT_TYPE) {
      this.agentid = this.projectid;
      this.projectid = 0;
    }
    this.getQueryById();
    this.getPromoterAnswer()
    this.response=[{answer:'',filepath:'',filedesc:''}]
  }
  getQueryById(): any {
    const data = {reraid: this.common.getReraId(), id: this.queryid,userid: this.common.getUserId()};
    this.common.loaderStart();
    this.apiService.getQueryById(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        if(res.response.length>0){
          this.query = res.response[0].query;
          this.docs=res.response[0].comments;
          this.promoterid=res.response[0].uniquepromoterid;
        }else{
          this.notifier.notify('error', 'No Query Found')
        }
      } else {
        this.notifier.notify('error', res.message)
      }
    });
  }
  getPromoterAnswer(): any {
    let data:any={}
     data = {reraid: this.common.getReraId(), id: this.queryid,workflowtype:this.workflowtype,userid:this.common.getUserId()};
    if (this.workflowtype === this.AGENT_TYPE) {
      data['agentid'] = this.agentid
    } else {
      data['projectid'] = this.projectid;
      if (this.workflowtype === this.EXTENSION_TYPE) {
        data['extensionid'] = this.extensionId;
      }
    }
    this.common.loaderStart();
    this.apiService.getPromoterAnswer(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.promanswer = res.response;
        // if(res.response.length>0){
        //   this.promanswer = res.response;
        // }else{
        //   this.notifier.notify('error', 'No Query Found')
        // }
      } else {
        this.notifier.notify('error', res.message)
      }
    });
  }
  uploadFile(e: any, i: any) {
    // console.log('inside aa')
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let file = e.target.files[0];
    // formData.append("user", JSON.stringify(user));
    formData.append("file", file);

    xhr.onreadystatechange = state => {
      // console.log(xhr.status);
      console.log(xhr.responseText)
      if (xhr.status === 200 && xhr.responseText !== '') {

          this.response[i].filepath = JSON.parse(xhr.responseText).response.fileName;
        this.response[i].filedesc = JSON.parse(xhr.responseText).response.orgfilename;
      }
    };
    xhr.timeout = 5000;
    xhr.open("POST", this.apiService.API_ROOT + this.apiService.WORKFLOW_PATH + 'fileupload');
    xhr.send(formData);
  }

  addMore() {
    this.response.push({answer:'',filepath:'',filedesc:''})
  }

  save() {
    // console.log(JSON.stringify(this.response));
    let data:any={}
    data = {
      reraid: this.common.getReraId(),
      // uniqueprojectid: this.projectid,
      // uniquepromoterid: this.promoterid,
      workflowstepsroleuserprojectid: this.workflowhistoryid,
      workflowstepsroleuserqueryid: this.queryid,
      userid: this.common.getUserId(),
      response:this.response,
      workflowtype:this.workflowtype
    };
    // console.log(JSON.stringify(data));
    if (this.workflowtype === this.AGENT_TYPE) {
      data['agentid'] = this.agentid
    } else {
      data['uniqueprojectid'] = this.projectid;
      data['uniquepromoterid'] = this.promoterid;
      if (this.workflowtype === this.EXTENSION_TYPE) {
        data['extensionid'] = this.extensionId;
      }
    }
    this.common.loaderStart();
    this.apiService.workflowStepQueryAnswerMultiple(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.notifier.notify('success', res.message);

        for(let i=0;i<this.response.length;i++){
          this.promanswer.push({answer:this.response[i].answer,dateofanswer:new Date()})
        }
        this.response=[];
        this.response=[{answer:'',filepath:'',filedesc:''}];
      } else {
        // alert(res.message);
        this.notifier.notify('error', res.message);
      }
    }, (err: any) => {
      this.common.loaderEnd();
    })
  }

  close() {
    let projid=0;
    if(this.workflowtype===this.AGENT_TYPE){
      projid=this.agentid;
    }else{
      projid=this.projectid;
    }
    this.route.navigate(['/pages/viewQuery/' + projid]);
  }

  remove(i: any) {
    if(this.response.length>1) {
      this.response.splice(i, 1)
    }
  }
}
