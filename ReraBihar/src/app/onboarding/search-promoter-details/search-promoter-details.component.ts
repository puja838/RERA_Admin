import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifierService} from "angular-notifier";
import {SearchService} from "../../services/search.service";
import {CommonService} from "../../services/common.service";
import {ConfigService} from "../../services/config.service";

@Component({
  selector: 'app-search-promoter-details',
  templateUrl: './search-promoter-details.component.html',
  styleUrls: ['./search-promoter-details.component.css']
})
export class SearchPromoterDetailsComponent implements OnInit {
  userno: string | null ='';
  private promoterid: number=0;
  username: string='';
  useremail: string='';
  usermobile: string='';
  entitytypeid: number=0;
  entitytypedesc: string='';

  PROFILE_STEP_ID = 9;

  NAME_FIELD_ID = 1;
  OCCUPATION_FIELD_ID = 13;
  GENDER_FIELD_ID = 9;
  BRIEF_FIELD_ID = 15;
  EXP_PROMOTER_FIELD_ID = 88;
  EXP_BIHAR_FIELD_ID = 89;
  EXP_OTHER_FIELD_ID = 9;
  DOB_FIELD_ID = 14;
  GUARDIAN_FIELD_ID = 8;
  EMAIL_FIELD_ID = 22;

  COMPANY_REG_CERT_FIELD_ID = 12;
  REGISTRATION_FIELD_ID = 10;
  DATE_REG_FIELD_NO = 11;
  ADDR1_FIELD_NO = 30;
  ADDR2_FIELD_NO = 31;
  STATE_FIELD_NO = 18;
  DISTRICT_FIELD_NO = 19;
  // BLOCK_FIELD_NO = 258;
  PIN_FIELD_NO = 21;
  WEBSITE_FIELD_NO = 16;
  COMPANY_CIN_FIELD_ID = 104;
  COMPANY_WEBSITE_FIELD_ID = 118;
  INCORPORATION_DATE_FIELD_ID = 105;
  INCORPORATION_CERT_FIELD_ID = 106;

  FIRM_ADDR1_FIELD_ID = 146;
  FIRM_ADDR2_FIELD_ID = 147;

  SOCIETY_REG_FIELD_ID = 157;
  SOCIETY_ADDR1_FIELD_ID = 159;
  SOCIETY_ADDR2_FIELD_ID = 160;
  SOCIETY_REG_CERT_FIELD_ID = 158;

  PARTNERSHIP_REG_FIELD_ID = 248;
  PARTNERSHIP_ADDR1_FIELD_ID = 249;
  PARTNERSHIP_ADDR2_FIELD_ID = 250;

  LLP_REG_FIELD_ID = 181;
  LLP_ADDR1_FIELD_ID = 110;
  LLP_ADDR2_FIELD_ID = 111;
  LLP_WEBSITE_FIELD_ID=183;

  TRUST_REG_FIELD_ID = 194;
  TRUST_REG_CERT_FIELD_ID = 195;
  TRUST_ADDR1_FIELD_ID = 196;
  TRUST_ADDR2_FIELD_ID = 197;
  TRUST_WEBSITE_FIELD_NO = 16;

  COSOC_REG_FIELD_ID = 207;
  COSOC_REG_CERT_FIELD_ID = 208;
  COSOC_ADDR1_FIELD_ID = 209;
  COSOC_ADDR2_FIELD_ID = 210;

  COM_AUTH_REG_FIELD_ID = 220;
  COM_AUTH_REG_CERT_FIELD_ID = 221;
  COM_AUTH_ADDR1_FIELD_ID = 222;
  COM_AUTH_ADDR2_FIELD_ID = 223;

  PARENT_COMPANY_FIELD_NO = 112;
  PARENT_ADDRESS1_FIELD_NO = 110;
  PARENT_ADDRESS2_FIELD_NO = 111;
  PARENT_STATE_FIELD_NO = 18;
  PARENT_DISTRICT_FIELD_NO = 19;
  PARENT_PIN_FIELD_NO = 21;
  PARENT_WEBSITE_FIELD_NO = 16;

  DESIGNATED_NAME_FIELD_ID = 361;
  DESIGNATON_FIELD_ID = 280;
  DESIGNATED_SECONDARY_FIELD_ID = 142;
  DESIGNATED_MOBILE_FIELD_ID = 367;

  promotername: string = '';
  occupation: string = '';
  brief: string = '';
  exppromoter: string = '';
  expbihar: string = '';
  expother: string = '';
  dob: string = '';
  guardian: string = '';
  regno: string = '';
  regdate: string = '';
  addr1: string = '';
  addr2: string = '';
  state: string = '';
  district: string = '';
  pin: string = '';
  website: string = '';
  comcert: string = '';
  parwebsite: string = '';
  parpin: string = '';
  pardistrict: string = '';
  parstate: string='';
  paraddr: string='';
  paraddr2: string='';
  parcmp: string='';
  gender: string='';
  email: string='';
  limit: number=9;
  page: any;
  ongoingSize: any;
  ongoingoffset = 0;
  completeoffset = 0;
  completeSize: any;
  ongoingprojects: any[]=[];
  completerojects: any[]=[];
  desmobile: string = 'N/A';
  desname: string = 'N/A';
  dessecondary: string = 'N/A';
  desg: string = 'N/A';
  
  constructor(private activeRoute: ActivatedRoute, private modalService: NgbModal, private notifier: NotifierService, private route: Router,
              private apiService: SearchService, private common: CommonService, private config: ConfigService) {
  }

  ngOnInit(): void {
    this.userno = this.activeRoute.snapshot.paramMap.get('promoterid');
    // console.log(this.promoterid)
    this.fetchPromoterDetails();
  }
  fetchPromoterDetails() {
    this.common.loaderShow();
    const data = {reraid: this.common.getReraId(), userno: this.userno};
    this.apiService.fetchPromoterDetails(data).subscribe((res: any) => {
      if (res.success) {
        this.common.loaderEnd();
        if (res.response.length > 0) {
          this.promoterid = res.response[0].userid;
          this.username = res.response[0].username;
          this.useremail = res.response[0].useremail;
          this.entitytypeid = res.response[0].entitytypeid;
          this.usermobile = res.response[0].usermobile;
          this.entitytypedesc = res.response[0].entitytypedesc;

          this.ongoingoffset = 0;
          this.completeoffset = 0;
          this.page=1;
          this.fetchPromoterAllDetails();
          this.fetchProjectByStatus(['ongoing','new'],this.ongoingoffset).then((details: any)=>{
            if(this.ongoingoffset===0){
              this.ongoingSize=details.count;
            }
            this.ongoingprojects=details.details;
          });
          this.fetchProjectByStatus(['completed'],this.completeoffset).then((details: any)=>{
            if(this.completeoffset===0){
              this.completeSize=details.count;
            }
            this.completerojects=details.details;
          });
        } else {
          this.notifier.notify('error', 'Promoter Details not found.')
        }

      } else {
        this.notifier.notify('error', res.message)
      }
    });
  }
  openProjects(id: any) {
    this.route.navigate(['/searchProject/'+id]);
  }
  fetchProfileValueDetails(stepid: number, fieldid: any[]) {
    const promise = new Promise((resolve, reject) => {
      const data = {
        reraid: this.common.getReraId(),
        promoterid: this.promoterid,
        stepid: stepid,
        fieldid: fieldid
      };
      this.apiService.fetchProfileValueDetails(data).subscribe((res: any) => {
        if (res.success) {
          if (res.response.length > 0) {
            resolve(res.response);
          } else {
            this.notifier.notify('error', 'Profile value not found for .' + stepid)
            reject();
          }
        } else {
          reject();
          this.notifier.notify('error', res.message)
        }
      });
    });
    return promise;
  }
  fetchProjectByStatus( status: any[],offset:number) {
    const promise = new Promise((resolve, reject) => {
      const data = {
        reraid: this.common.getReraId(),
        promoterid: this.promoterid,
        status: status,
        limit: this.limit,
        offset:offset,
      };
      this.apiService.fetchProjectByStatus(data).subscribe((res: any) => {
        if (res.success) {
            resolve(res.response);
        } else {
          reject();
          this.notifier.notify('error', res.message)
        }
      });
    });
    return promise;
  }
  fetchPromoterAllDetails(){
    if (this.entitytypeid === 1) {
      this.fetchProfileValueDetails(this.PROFILE_STEP_ID, [this.DESIGNATED_MOBILE_FIELD_ID, this.DESIGNATED_NAME_FIELD_ID, this.DESIGNATED_SECONDARY_FIELD_ID, this.DESIGNATON_FIELD_ID,
        this.COMPANY_REG_CERT_FIELD_ID, this.GENDER_FIELD_ID, this.NAME_FIELD_ID, this.OCCUPATION_FIELD_ID, this.BRIEF_FIELD_ID,
        this.EXP_PROMOTER_FIELD_ID, this.EXP_BIHAR_FIELD_ID, this.EXP_OTHER_FIELD_ID, this.DOB_FIELD_ID, this.REGISTRATION_FIELD_ID,
        this.GUARDIAN_FIELD_ID, this.EMAIL_FIELD_ID, this.DATE_REG_FIELD_NO, this.ADDR1_FIELD_NO, this.ADDR2_FIELD_NO,
        this.STATE_FIELD_NO, this.DISTRICT_FIELD_NO, this.PIN_FIELD_NO, this.WEBSITE_FIELD_NO]).then((details: any) => {
        for (let i = 0; i < details.length; i++) {
          if (details[i].fieldid === this.NAME_FIELD_ID) {
            this.promotername = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.GENDER_FIELD_ID) {
            this.gender = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.COMPANY_REG_CERT_FIELD_ID) {
            this.comcert = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.OCCUPATION_FIELD_ID) {
            this.occupation = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_MOBILE_FIELD_ID) {
            this.desmobile = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_NAME_FIELD_ID) {
            this.desname = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_SECONDARY_FIELD_ID) {
            this.dessecondary = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATON_FIELD_ID) {
            this.desg = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.BRIEF_FIELD_ID) {
            this.brief = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_PROMOTER_FIELD_ID) {
            this.exppromoter = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_BIHAR_FIELD_ID) {
            this.expbihar = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_OTHER_FIELD_ID) {
            this.expother = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DOB_FIELD_ID) {
            this.dob = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.GUARDIAN_FIELD_ID) {
            if (details[i].projectfieldvalue !== '' || details[i].projectfieldvalue !== null) {
              this.guardian = details[i].projectfieldvalue.split('|')[1];
            }
          } else if (details[i].fieldid === this.EMAIL_FIELD_ID) {
            this.email = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.REGISTRATION_FIELD_ID) {
            this.regno = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DATE_REG_FIELD_NO) {
            this.regdate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.ADDR1_FIELD_NO) {
            this.addr1 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.ADDR2_FIELD_NO) {
            this.addr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.STATE_FIELD_NO) {
            this.state = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DISTRICT_FIELD_NO) {
            this.district = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PIN_FIELD_NO) {
            this.pin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.WEBSITE_FIELD_NO) {
            this.website = details[i].projectfieldvalue;
          }
        }
      });

    } else if (this.entitytypeid === 2) {
      this.fetchProfileValueDetails(this.PROFILE_STEP_ID, [this.DESIGNATED_MOBILE_FIELD_ID, this.DESIGNATED_NAME_FIELD_ID, this.DESIGNATED_SECONDARY_FIELD_ID, this.DESIGNATON_FIELD_ID,
        this.COMPANY_CIN_FIELD_ID, this.COMPANY_WEBSITE_FIELD_ID, this.INCORPORATION_DATE_FIELD_ID,
        this.INCORPORATION_CERT_FIELD_ID, this.PARENT_COMPANY_FIELD_NO, this.PARENT_ADDRESS1_FIELD_NO, this.PARENT_ADDRESS2_FIELD_NO, this.PARENT_STATE_FIELD_NO,
        this.PARENT_DISTRICT_FIELD_NO, this.PARENT_PIN_FIELD_NO, this.PARENT_WEBSITE_FIELD_NO, this.ADDR1_FIELD_NO, this.ADDR2_FIELD_NO,
        this.STATE_FIELD_NO, this.DISTRICT_FIELD_NO, this.PIN_FIELD_NO, this.EXP_PROMOTER_FIELD_ID, this.EXP_BIHAR_FIELD_ID, this.EXP_OTHER_FIELD_ID]).then((details: any) => {
        for (let i = 0; i < details.length; i++) {
          if (details[i].fieldid === this.INCORPORATION_CERT_FIELD_ID) {
            this.comcert = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_PROMOTER_FIELD_ID) {
            this.exppromoter = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_BIHAR_FIELD_ID) {
            this.expbihar = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_OTHER_FIELD_ID) {
            this.expother = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.COMPANY_CIN_FIELD_ID) {
            this.regno = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.INCORPORATION_DATE_FIELD_ID) {
            this.regdate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.ADDR1_FIELD_NO) {
            this.addr1 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.ADDR2_FIELD_NO) {
            this.addr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.STATE_FIELD_NO) {
            this.state = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DISTRICT_FIELD_NO) {
            this.district = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PIN_FIELD_NO) {
            this.pin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.COMPANY_WEBSITE_FIELD_ID) {
            this.website = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_COMPANY_FIELD_NO) {
            this.parcmp = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS1_FIELD_NO) {
            this.paraddr = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS2_FIELD_NO) {
            this.paraddr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_STATE_FIELD_NO) {
            this.parstate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_DISTRICT_FIELD_NO) {
            this.pardistrict = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_PIN_FIELD_NO) {
            this.parpin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_WEBSITE_FIELD_NO) {
            this.parwebsite = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_MOBILE_FIELD_ID) {
            this.desmobile = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_NAME_FIELD_ID) {
            this.desname = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_SECONDARY_FIELD_ID) {
            this.dessecondary = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATON_FIELD_ID) {
            this.desg = details[i].projectfieldvalue;
          }
        }
      });
    }
    else if (this.entitytypeid === 3) {
      this.fetchProfileValueDetails(this.PROFILE_STEP_ID, [this.DESIGNATED_MOBILE_FIELD_ID, this.DESIGNATED_NAME_FIELD_ID, this.DESIGNATED_SECONDARY_FIELD_ID, this.DESIGNATON_FIELD_ID,
        this.REGISTRATION_FIELD_ID, this.WEBSITE_FIELD_NO, this.INCORPORATION_DATE_FIELD_ID,
        this.INCORPORATION_CERT_FIELD_ID, this.FIRM_ADDR1_FIELD_ID, this.FIRM_ADDR2_FIELD_ID,
        this.STATE_FIELD_NO, this.DISTRICT_FIELD_NO, this.PIN_FIELD_NO, this.EXP_PROMOTER_FIELD_ID, this.EXP_BIHAR_FIELD_ID, this.EXP_OTHER_FIELD_ID]).then((details: any) => {
        for (let i = 0; i < details.length; i++) {
          if (details[i].fieldid === this.INCORPORATION_CERT_FIELD_ID) {
            this.comcert = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_PROMOTER_FIELD_ID) {
            this.exppromoter = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_BIHAR_FIELD_ID) {
            this.expbihar = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_OTHER_FIELD_ID) {
            this.expother = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.REGISTRATION_FIELD_ID) {
            this.regno = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.INCORPORATION_DATE_FIELD_ID) {
            this.regdate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.FIRM_ADDR1_FIELD_ID) {
            this.addr1 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.FIRM_ADDR2_FIELD_ID) {
            this.addr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.STATE_FIELD_NO) {
            this.state = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DISTRICT_FIELD_NO) {
            this.district = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PIN_FIELD_NO) {
            this.pin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.WEBSITE_FIELD_NO) {
            this.website = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_MOBILE_FIELD_ID) {
            this.desmobile = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_NAME_FIELD_ID) {
            this.desname = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_SECONDARY_FIELD_ID) {
            this.dessecondary = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATON_FIELD_ID) {
            this.desg = details[i].projectfieldvalue;
          }
        }
      });
    }
    else if (this.entitytypeid === 4) {
      this.fetchProfileValueDetails(this.PROFILE_STEP_ID, [this.DESIGNATED_MOBILE_FIELD_ID, this.DESIGNATED_NAME_FIELD_ID, this.DESIGNATED_SECONDARY_FIELD_ID, this.DESIGNATON_FIELD_ID,
        this.SOCIETY_REG_FIELD_ID, this.WEBSITE_FIELD_NO, this.DATE_REG_FIELD_NO,
        this.SOCIETY_REG_CERT_FIELD_ID, this.PARENT_COMPANY_FIELD_NO, this.PARENT_ADDRESS1_FIELD_NO, this.PARENT_ADDRESS2_FIELD_NO, this.PARENT_STATE_FIELD_NO,
        this.PARENT_DISTRICT_FIELD_NO, this.PARENT_PIN_FIELD_NO, this.PARENT_WEBSITE_FIELD_NO, this.SOCIETY_ADDR1_FIELD_ID, this.SOCIETY_ADDR2_FIELD_ID,
        this.STATE_FIELD_NO, this.DISTRICT_FIELD_NO, this.PIN_FIELD_NO, this.EXP_PROMOTER_FIELD_ID, this.EXP_BIHAR_FIELD_ID, this.EXP_OTHER_FIELD_ID]).then((details: any) => {
        for (let i = 0; i < details.length; i++) {
          if (details[i].fieldid === this.SOCIETY_REG_CERT_FIELD_ID) {
            this.comcert = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_PROMOTER_FIELD_ID) {
            this.exppromoter = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_BIHAR_FIELD_ID) {
            this.expbihar = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_OTHER_FIELD_ID) {
            this.expother = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.SOCIETY_REG_FIELD_ID) {
            this.regno = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DATE_REG_FIELD_NO) {
            this.regdate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.SOCIETY_ADDR1_FIELD_ID) {
            this.addr1 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.SOCIETY_ADDR2_FIELD_ID) {
            this.addr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.STATE_FIELD_NO) {
            this.state = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DISTRICT_FIELD_NO) {
            this.district = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PIN_FIELD_NO) {
            this.pin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.WEBSITE_FIELD_NO) {
            this.website = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_COMPANY_FIELD_NO) {
            this.parcmp = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS1_FIELD_NO) {
            this.paraddr = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS2_FIELD_NO) {
            this.paraddr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_STATE_FIELD_NO) {
            this.parstate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_DISTRICT_FIELD_NO) {
            this.pardistrict = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_PIN_FIELD_NO) {
            this.parpin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_WEBSITE_FIELD_NO) {
            this.parwebsite = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_MOBILE_FIELD_ID) {
            this.desmobile = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_NAME_FIELD_ID) {
            this.desname = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_SECONDARY_FIELD_ID) {
            this.dessecondary = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATON_FIELD_ID) {
            this.desg = details[i].projectfieldvalue;
          }
        }
      });
    }
    else if (this.entitytypeid === 5) {
      this.fetchProfileValueDetails(this.PROFILE_STEP_ID, [this.DESIGNATED_MOBILE_FIELD_ID, this.DESIGNATED_NAME_FIELD_ID, this.DESIGNATED_SECONDARY_FIELD_ID, this.DESIGNATON_FIELD_ID,
        this.PARTNERSHIP_REG_FIELD_ID, this.WEBSITE_FIELD_NO, this.DATE_REG_FIELD_NO,
        this.COMPANY_REG_CERT_FIELD_ID, this.PARENT_COMPANY_FIELD_NO, this.PARENT_ADDRESS1_FIELD_NO, this.PARENT_ADDRESS2_FIELD_NO, this.PARENT_STATE_FIELD_NO,
        this.PARENT_DISTRICT_FIELD_NO, this.PARENT_PIN_FIELD_NO, this.PARENT_WEBSITE_FIELD_NO, this.PARTNERSHIP_ADDR1_FIELD_ID, this.PARTNERSHIP_ADDR2_FIELD_ID,
        this.STATE_FIELD_NO, this.DISTRICT_FIELD_NO, this.PIN_FIELD_NO, this.EXP_PROMOTER_FIELD_ID, this.EXP_BIHAR_FIELD_ID, this.EXP_OTHER_FIELD_ID]).then((details: any) => {
        for (let i = 0; i < details.length; i++) {
          if (details[i].fieldid === this.COMPANY_REG_CERT_FIELD_ID) {
            this.comcert = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_PROMOTER_FIELD_ID) {
            this.exppromoter = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_BIHAR_FIELD_ID) {
            this.expbihar = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_OTHER_FIELD_ID) {
            this.expother = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARTNERSHIP_REG_FIELD_ID) {
            this.regno = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DATE_REG_FIELD_NO) {
            this.regdate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARTNERSHIP_ADDR1_FIELD_ID) {
            this.addr1 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARTNERSHIP_ADDR2_FIELD_ID) {
            this.addr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.STATE_FIELD_NO) {
            this.state = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DISTRICT_FIELD_NO) {
            this.district = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PIN_FIELD_NO) {
            this.pin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.WEBSITE_FIELD_NO) {
            this.website = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_COMPANY_FIELD_NO) {
            this.parcmp = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS1_FIELD_NO) {
            this.paraddr = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS2_FIELD_NO) {
            this.paraddr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_STATE_FIELD_NO) {
            this.parstate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_DISTRICT_FIELD_NO) {
            this.pardistrict = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_PIN_FIELD_NO) {
            this.parpin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_WEBSITE_FIELD_NO) {
            this.parwebsite = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_MOBILE_FIELD_ID) {
            this.desmobile = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_NAME_FIELD_ID) {
            this.desname = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_SECONDARY_FIELD_ID) {
            this.dessecondary = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATON_FIELD_ID) {
            this.desg = details[i].projectfieldvalue;
          }
        }
      });
    }
    else if (this.entitytypeid === 6) {
      this.fetchProfileValueDetails(this.PROFILE_STEP_ID, [this.DESIGNATED_MOBILE_FIELD_ID, this.DESIGNATED_NAME_FIELD_ID, this.DESIGNATED_SECONDARY_FIELD_ID, this.DESIGNATON_FIELD_ID,
        this.LLP_REG_FIELD_ID, this.LLP_WEBSITE_FIELD_ID, this.INCORPORATION_DATE_FIELD_ID,
        this.INCORPORATION_CERT_FIELD_ID, this.PARENT_COMPANY_FIELD_NO, this.PARENT_ADDRESS1_FIELD_NO, this.PARENT_ADDRESS2_FIELD_NO, this.PARENT_STATE_FIELD_NO,
        this.PARENT_DISTRICT_FIELD_NO, this.PARENT_PIN_FIELD_NO, this.PARENT_WEBSITE_FIELD_NO, this.LLP_ADDR1_FIELD_ID, this.LLP_ADDR2_FIELD_ID,
        this.STATE_FIELD_NO, this.DISTRICT_FIELD_NO, this.PIN_FIELD_NO, this.EXP_PROMOTER_FIELD_ID, this.EXP_BIHAR_FIELD_ID, this.EXP_OTHER_FIELD_ID]).then((details: any) => {
        for (let i = 0; i < details.length; i++) {
          if (details[i].fieldid === this.INCORPORATION_CERT_FIELD_ID) {
            this.comcert = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_PROMOTER_FIELD_ID) {
            this.exppromoter = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_BIHAR_FIELD_ID) {
            this.expbihar = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_OTHER_FIELD_ID) {
            this.expother = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.LLP_REG_FIELD_ID) {
            this.regno = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.INCORPORATION_DATE_FIELD_ID) {
            this.regdate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.LLP_ADDR1_FIELD_ID) {
            this.addr1 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.LLP_ADDR2_FIELD_ID) {
            this.addr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.STATE_FIELD_NO) {
            this.state = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DISTRICT_FIELD_NO) {
            this.district = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PIN_FIELD_NO) {
            this.pin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.LLP_WEBSITE_FIELD_ID) {
            this.website = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_COMPANY_FIELD_NO) {
            this.parcmp = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS1_FIELD_NO) {
            this.paraddr = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS2_FIELD_NO) {
            this.paraddr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_STATE_FIELD_NO) {
            this.parstate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_DISTRICT_FIELD_NO) {
            this.pardistrict = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_PIN_FIELD_NO) {
            this.parpin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_WEBSITE_FIELD_NO) {
            this.parwebsite = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_MOBILE_FIELD_ID) {
            this.desmobile = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_NAME_FIELD_ID) {
            this.desname = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_SECONDARY_FIELD_ID) {
            this.dessecondary = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATON_FIELD_ID) {
            this.desg = details[i].projectfieldvalue;
          }
        }
      });
    }
    else if (this.entitytypeid === 7) {
      this.fetchProfileValueDetails(this.PROFILE_STEP_ID, [this.DESIGNATED_MOBILE_FIELD_ID, this.DESIGNATED_NAME_FIELD_ID, this.DESIGNATED_SECONDARY_FIELD_ID, this.DESIGNATON_FIELD_ID,
        this.TRUST_REG_FIELD_ID, this.TRUST_WEBSITE_FIELD_NO, this.DATE_REG_FIELD_NO,
        this.TRUST_REG_CERT_FIELD_ID, this.PARENT_COMPANY_FIELD_NO, this.PARENT_ADDRESS1_FIELD_NO, this.PARENT_ADDRESS2_FIELD_NO, this.PARENT_STATE_FIELD_NO,
        this.PARENT_DISTRICT_FIELD_NO, this.PARENT_PIN_FIELD_NO, this.PARENT_WEBSITE_FIELD_NO, this.TRUST_ADDR1_FIELD_ID, this.TRUST_ADDR2_FIELD_ID,
        this.STATE_FIELD_NO, this.DISTRICT_FIELD_NO, this.PIN_FIELD_NO, this.EXP_PROMOTER_FIELD_ID, this.EXP_BIHAR_FIELD_ID, this.EXP_OTHER_FIELD_ID]).then((details: any) => {
        for (let i = 0; i < details.length; i++) {
          if (details[i].fieldid === this.TRUST_REG_CERT_FIELD_ID) {
            this.comcert = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_PROMOTER_FIELD_ID) {
            this.exppromoter = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_BIHAR_FIELD_ID) {
            this.expbihar = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_OTHER_FIELD_ID) {
            this.expother = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.TRUST_REG_FIELD_ID) {
            this.regno = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DATE_REG_FIELD_NO) {
            this.regdate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.TRUST_ADDR1_FIELD_ID) {
            this.addr1 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.TRUST_ADDR2_FIELD_ID) {
            this.addr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.STATE_FIELD_NO) {
            this.state = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DISTRICT_FIELD_NO) {
            this.district = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PIN_FIELD_NO) {
            this.pin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.TRUST_WEBSITE_FIELD_NO) {
            this.website = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_COMPANY_FIELD_NO) {
            this.parcmp = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS1_FIELD_NO) {
            this.paraddr = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS2_FIELD_NO) {
            this.paraddr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_STATE_FIELD_NO) {
            this.parstate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_DISTRICT_FIELD_NO) {
            this.pardistrict = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_PIN_FIELD_NO) {
            this.parpin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_WEBSITE_FIELD_NO) {
            this.parwebsite = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_MOBILE_FIELD_ID) {
            this.desmobile = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_NAME_FIELD_ID) {
            this.desname = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_SECONDARY_FIELD_ID) {
            this.dessecondary = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATON_FIELD_ID) {
            this.desg = details[i].projectfieldvalue;
          }
        }
      })
    }
    else if (this.entitytypeid === 8) {
      this.fetchProfileValueDetails(this.PROFILE_STEP_ID, [this.DESIGNATED_MOBILE_FIELD_ID, this.DESIGNATED_NAME_FIELD_ID, this.DESIGNATED_SECONDARY_FIELD_ID, this.DESIGNATON_FIELD_ID,
        this.COSOC_REG_FIELD_ID, this.WEBSITE_FIELD_NO, this.DATE_REG_FIELD_NO,
        this.COSOC_REG_CERT_FIELD_ID, this.PARENT_COMPANY_FIELD_NO, this.PARENT_ADDRESS1_FIELD_NO, this.PARENT_ADDRESS2_FIELD_NO, this.PARENT_STATE_FIELD_NO,
        this.PARENT_DISTRICT_FIELD_NO, this.PARENT_PIN_FIELD_NO, this.PARENT_WEBSITE_FIELD_NO, this.COSOC_ADDR1_FIELD_ID, this.COSOC_ADDR2_FIELD_ID,
        this.STATE_FIELD_NO, this.DISTRICT_FIELD_NO, this.PIN_FIELD_NO, this.EXP_PROMOTER_FIELD_ID, this.EXP_BIHAR_FIELD_ID, this.EXP_OTHER_FIELD_ID]).then((details: any) => {
        for (let i = 0; i < details.length; i++) {
          if (details[i].fieldid === this.COSOC_REG_CERT_FIELD_ID) {
            this.comcert = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_PROMOTER_FIELD_ID) {
            this.exppromoter = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_BIHAR_FIELD_ID) {
            this.expbihar = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_OTHER_FIELD_ID) {
            this.expother = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.COSOC_REG_FIELD_ID) {
            this.regno = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DATE_REG_FIELD_NO) {
            this.regdate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.COSOC_ADDR1_FIELD_ID) {
            this.addr1 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.COSOC_ADDR2_FIELD_ID) {
            this.addr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.STATE_FIELD_NO) {
            this.state = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DISTRICT_FIELD_NO) {
            this.district = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PIN_FIELD_NO) {
            this.pin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.WEBSITE_FIELD_NO) {
            this.website = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_COMPANY_FIELD_NO) {
            this.parcmp = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS1_FIELD_NO) {
            this.paraddr = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS2_FIELD_NO) {
            this.paraddr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_STATE_FIELD_NO) {
            this.parstate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_DISTRICT_FIELD_NO) {
            this.pardistrict = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_PIN_FIELD_NO) {
            this.parpin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_WEBSITE_FIELD_NO) {
            this.parwebsite = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_MOBILE_FIELD_ID) {
            this.desmobile = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_NAME_FIELD_ID) {
            this.desname = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_SECONDARY_FIELD_ID) {
            this.dessecondary = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATON_FIELD_ID) {
            this.desg = details[i].projectfieldvalue;
          }
        }
      })
    }
    else if (this.entitytypeid === 9) {
      this.fetchProfileValueDetails(this.PROFILE_STEP_ID, [this.DESIGNATED_MOBILE_FIELD_ID, this.DESIGNATED_NAME_FIELD_ID, this.DESIGNATED_SECONDARY_FIELD_ID, this.DESIGNATON_FIELD_ID,
        this.COM_AUTH_REG_FIELD_ID, this.WEBSITE_FIELD_NO, this.DATE_REG_FIELD_NO,
        this.COM_AUTH_REG_CERT_FIELD_ID, this.PARENT_COMPANY_FIELD_NO, this.PARENT_ADDRESS1_FIELD_NO, this.PARENT_ADDRESS2_FIELD_NO, this.PARENT_STATE_FIELD_NO,
        this.PARENT_DISTRICT_FIELD_NO, this.PARENT_PIN_FIELD_NO, this.PARENT_WEBSITE_FIELD_NO, this.COM_AUTH_ADDR1_FIELD_ID, this.COM_AUTH_ADDR2_FIELD_ID,
        this.STATE_FIELD_NO, this.DISTRICT_FIELD_NO, this.PIN_FIELD_NO, this.EXP_PROMOTER_FIELD_ID, this.EXP_BIHAR_FIELD_ID, this.EXP_OTHER_FIELD_ID]).then((details: any) => {
        for (let i = 0; i < details.length; i++) {
          if (details[i].fieldid === this.COM_AUTH_REG_CERT_FIELD_ID) {
            this.comcert = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_PROMOTER_FIELD_ID) {
            this.exppromoter = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_BIHAR_FIELD_ID) {
            this.expbihar = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.EXP_OTHER_FIELD_ID) {
            this.expother = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.COM_AUTH_REG_FIELD_ID) {
            this.regno = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DATE_REG_FIELD_NO) {
            this.regdate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.COM_AUTH_ADDR1_FIELD_ID) {
            this.addr1 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.COM_AUTH_ADDR2_FIELD_ID) {
            this.addr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.STATE_FIELD_NO) {
            this.state = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DISTRICT_FIELD_NO) {
            this.district = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PIN_FIELD_NO) {
            this.pin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.WEBSITE_FIELD_NO) {
            this.website = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_COMPANY_FIELD_NO) {
            this.parcmp = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS1_FIELD_NO) {
            this.paraddr = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_ADDRESS2_FIELD_NO) {
            this.paraddr2 = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_STATE_FIELD_NO) {
            this.parstate = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_DISTRICT_FIELD_NO) {
            this.pardistrict = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_PIN_FIELD_NO) {
            this.parpin = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.PARENT_WEBSITE_FIELD_NO) {
            this.parwebsite = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_MOBILE_FIELD_ID) {
            this.desmobile = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_NAME_FIELD_ID) {
            this.desname = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATED_SECONDARY_FIELD_ID) {
            this.dessecondary = details[i].projectfieldvalue;
          } else if (details[i].fieldid === this.DESIGNATON_FIELD_ID) {
            this.desg = details[i].projectfieldvalue;
          }
        }
      })
    }
  }
  downloadCertificate(file: string) {
    window.open(this.config.CRT_ROOT + file, '_blank');
  }

  ongoingChange(page: any) {
    this.ongoingoffset = this.limit * (page - 1);
    this.fetchProjectByStatus(['ongoing','new'],this.ongoingoffset).then((details: any)=>{
      if(this.ongoingoffset===0){
        this.ongoingSize=details.count;
      }
      this.ongoingprojects=details.details;
    });
  }

  completeChange(page: any) {
    this.completeoffset = this.limit * (page - 1);
    this.fetchProjectByStatus(['completed'],this.completeoffset).then((details: any)=>{
      if(this.completeoffset===0){
        this.completeSize=details.count;
      }
      this.completerojects=details.details;
    });
  }
}
