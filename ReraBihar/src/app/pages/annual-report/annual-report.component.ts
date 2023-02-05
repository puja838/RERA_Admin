import { Component, OnInit,ViewChild } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import {NotifierService} from "angular-notifier";
import { CommonService } from 'src/app/services/common.service';

import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-annual-report',
  templateUrl: './annual-report.component.html',
  styleUrls: ['./annual-report.component.css']
})
export class AnnualReportComponent implements OnInit {

  selectedTabIndex = 0;

  selectYearOption=[] as any

  selectDocumentOption=[] as any

  year='2022-2023' as any
  document='' as any
  otherDocument='' as any
  @ViewChild('confirmSubmitModal') confirmSubmitModal: any;

  showDiv=false

  pdfName='' as any

  listArray=[] as any

  annualReport = [] as any;

  

  p: number = 1;


  constructor(private rest:RestApiService, private notifier: NotifierService, private common: CommonService, private modalService: NgbModal) { }

  ngOnInit(): void {

    this.selectYearFunction()
    this.selectDocumentFunction()
    this.getAnnualListData()
    this.annualReport.push({ financial_report_year: this.getCurrentFinancialYear(), sub_doc: "", oth_doc: "", file_name: ""})
 
    // console.log(this.getCurrentFinancialYear())
  }

  getCurrentFinancialYear():any {
    var fiscalyear = "";
    var today = new Date();
    if ((today.getMonth() + 1) <= 3) {
      fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear()
    } else {
      fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1)
    }
    return fiscalyear
  }

  addMoreFun():any {
    this.annualReport.push({financial_report_year: this.getCurrentFinancialYear(), sub_doc: "", oth_doc: "", file_name: ""})
  }

  closeSubmit(index: any): any {
    this.annualReport.splice(index, 1)
  }



  getAnnualListData():any{

    var data = {

      userid:this.common.getUserId()
    }


    this.rest.listAnnualReport(data).subscribe((res:any)=>{

      

      if(res.success){

        this.listArray = res.response
        console.log(this.listArray)
      }

    })


  }


  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }

  selectYearFunction():any{

    this.selectYearOption=[
      {name:'2018-2019',value:'2018-2019'},
      {name:'2019-2020',value:'2019-2020'},
      {name:'2020-2021',value:'2020-2021'},
      {name:'2021-2022',value:'2021-2022'},
      {name:'2022-2023',value:'2022-2023'},
      {name:'2023-2024',value:'2023-2024'}

    ]

  }

  selectDocumentFunction():any{

    this.selectDocumentOption=[
      {name:'ALL',value:'ALL'},
      {name:'ITR',value:'ITR'},
      {name:'AUDIT REPORT',value:'AUDIT REPORT'},
      {name:'DIRECTOR REPORT',value:'DIRECTOR REPORT'},
      {name:'BALANCE SHEET',value:'BALANCE SHEET'},
      {name:'P & L',value:'P & L'},
      {name:'CASH FLOW',value:'CASH FLOW'},
      {name:'FUND UTILISATION',value:'FUND UTILISATION'},
      {name:'COMPUTATION',value:'COMPUTATION'},
      {name:'OTHER',value:'OTHER'},
    ]

  }

  documentChangeFun(event:any, pos:any,arr:any):any{
    // console.log(event.target.value)
    // console.log(pos)

    if(event.target.value == 'OTHER' || event.target.value == 'ALL'){
      arr.showDiv=true
    }else{
      arr.showDiv=false
    }
  }


  

  uploadAnnual_report(event:any, array:any){
                if (event.target.files.length > 0) {
                    const fd = new FormData();
                    fd.append('file', event.target.files[0]);
                    console.log(fd)
                    this.rest.uploadFile(fd).subscribe((res: any) => {
                        if (res.success) {
                        array.file_name = res.response.fileName
                        // console.log(this.pdfName)
                        }
                    })
                }
  }

  ordinal_suf(i: any) {
    i = i + 1;
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

  onSubmit():any{


    for (let i = 0; i < this.annualReport.length; i++) {
      var annualReport = this.annualReport[i]

      if(annualReport.financial_report_year == '') {
        this.notifier.notify('error', 'Please select financial year for ' + (this.ordinal_suf(i)) + ' row');
        return false;
      } 
      else if (annualReport.sub_doc == '') {
        this.notifier.notify('error', ' Please select document for ' + (this.ordinal_suf(i)) + ' row');
        return false;

      }
      else if (annualReport.sub_doc == 'OTHER' || annualReport.sub_doc == 'ALL') {

        if(annualReport.oth_doc == ''){
          this.notifier.notify('error', ' Please select other document for ' + (this.ordinal_suf(i)) + ' row');
          return false;
        }

      }
      else if (annualReport.file_name == '') {
        this.notifier.notify('error', ' Please upload document for ' + (this.ordinal_suf(i)) + ' row');
        return false;

      }
    }





    // console.log(this.annualReport)

    var dataArray=[] as any

    for(let i = 0; i < this.annualReport.length; i++){
      var annualReport = this.annualReport[i]
      
      if(annualReport.sub_doc == 'OTHER' || annualReport.sub_doc == 'ALL'){

        annualReport.sub_doc = annualReport.oth_doc

      }
      dataArray.push({'financial_report_year':annualReport.financial_report_year, 'sub_doc':annualReport.sub_doc, 'file_name': annualReport.file_name})

      // console.log(dataArray)

    }

    // console.log(dataArray)

    var data = {

      userid: this.common.getUserId(),
      annualReport: dataArray,


    }


    // console.log(data)

    this.rest.addAnnualReport(data).subscribe((res:any)=>{
      console.log(res)
      if(res.success){
        this.notifier.notify('success', res.message);
        this.annualReport = [];
        this.annualReport.push({ financial_report_year: this.getCurrentFinancialYear(), sub_doc: "", oth_doc: "", file_name: ""})
        this.getAnnualListData()
      }
      

    })



    // if(this.year==""){
    //   this.notifier.notify('error', 'Select financial year');
    //   return false
    // }

    // if(this.document==""){
    //   this.notifier.notify('error', 'Select document');
    //   return false
    // }


    // var document = ''
    // if(this.document == 'OTHER'){

    //   if(this.otherDocument==""){
    //     this.notifier.notify('error', 'Enter other document');
    //     return false
    //   }else{
    //     document = this.otherDocument
    //   }

    // }else{
    //   document=this.document
    // }

    // if(this.pdfName==""){
    //   this.notifier.notify('error', 'Upload document');
    //   return false
    // }


    // var data = {

    //   userid: this.common.getUserId(),
    //   financial_report_year: this.year,
    //   sub_doc:document, 
    //   file_name:this.pdfName


    // }


    // // console.log(data)

    // this.rest.addAnnualReport(data).subscribe((res:any)=>{
    //   if(res.success){
    //     this.notifier.notify('success', res.message);
    //     this.getAnnualListData()
    //   }
      

    // })






  
  }

  selectedPosition='' as any
  selectedId='' as any

  openDeleteModal(deleteModal: any, id: number, pos: number): void {
    this.selectedPosition = pos;
    this.selectedId = id;
    this.modalService.open(deleteModal, {centered: true});
  }

  deleteData(): void {
    const data = {
      reportId: this.selectedId
    };
    this.rest.deleteReport(data).subscribe((res: any) => {
      if (res.success) {
        this.notifier.notify('success', res.message);
        this.closeModal();
        this.listArray.splice(this.selectedPosition, 1);
      } else {
        this.notifier.notify('error', res.message);
        this.closeModal();
      }
    })
  }


  goToLink(url: string){
    window.open(this.rest.FILE_URL + url);
  }
  closeModal(): void {
    this.modalService.dismissAll();
}

}


