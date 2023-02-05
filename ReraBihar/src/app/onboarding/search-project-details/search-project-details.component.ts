import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GalleryItem, ImageItem} from 'ng-gallery';
import {ActivatedRoute, Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {SearchService} from "../../services/search.service";
import {CommonService} from "../../services/common.service";
import {ConfigService} from "../../services/config.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-search-project-details',
    templateUrl: './search-project-details.component.html',
    styleUrls: ['./search-project-details.component.css']
})
export class SearchProjectDetailsComponent implements OnInit, OnDestroy {
    selectedTabIndex = 0;
    images: GalleryItem[] = [];
    projectuid: string | null = '';
    projectid: number = 0;
    projectname: string = '';

    PROJECT_INFORMATION_STEP_ID = 1;
    COMMON_AMENITIES_STEP_ID = 17;
    PROFILE_STEP_ID = 9;
    LAND_DETAILS_STEP_ID = 6;
    SANCTION_STEP_ID = 2;
    PROFESSIONAL_DETAILS_STEP_ID = 3;
    FINANCIAL_DETAILS_STEP_ID = 14;

    COMMON_AMENITIES_GROUP_ID = 22;
    ARCHITECT_GROUP_ID = 9;
    ENGINEER_GROUP_ID = 10;
    DEVELOPMENT_DETAILS_GROUP_ID = 24;
    FINANCIAL_DOC_GROUP_ID = 20;

    START_DATE_FIELD_ID = 496;
    END_DATE_FIELD_ID = 497;
    PROJECT_STATUS_FIELD_ID = 502;
    PROJECT_TYPE_FIELD_ID = 1;
    LAND_AREA_FIELD_ID = 523;
    PROJECT_ADDRESS_FIELD_ID = 387;
    NAME_FIELD_ID = 1;

    DESCRIPTION_FIELD_ID = 937;
    ESTIMATED_DEV_COST_FIELD_ID = 931;
    ESTIMATED_LAND_COST_FIELD_ID = 932;
    PROJ_WEBSITE_FIELD_ID = 935;
    PROJECT_STATE_FIELD_ID = 513;
    PROJECT_DISTRICT_FIELD_ID = 514;
    PROJECT_SUBDIVISION_FIELD_ID = 9;
    PROJECT_BLOCK_FIELD_ID = 11;
    PROJECT_CITY_FIELD_ID = 7;
    EAST_FIELD_ID = 24;
    WEST_FIELD_ID = 25;
    NORTH_FIELD_ID = 26;
    SOUTH_FIELD_ID = 27;
    LATITUDE_FIELD_ID = 21;
    LONGITUDE_FIELD_ID = 347;


    OCCUPATION_FIELD_ID = 13;
    GENDER_FIELD_ID = 9;
    BRIEF_FIELD_ID = 15;
    EXP_PROMOTER_FIELD_ID = 88;
    EXP_BIHAR_FIELD_ID = 89;
    EXP_OTHER_FIELD_ID = 9;
    DOB_FIELD_ID = 14;
    GUARDIAN_FIELD_ID = 8;
    EMAIL_FIELD_ID = 22;
    ADDR1_FIELD_NO = 30;
    ADDR2_FIELD_NO = 31;
    STATE_FIELD_NO = 18;
    DISTRICT_FIELD_NO = 19;
    // BLOCK_FIELD_NO = 258;
    PIN_FIELD_NO = 21;


    WEBSITE_FIELD_NO = 16;
    COMPANY_REG_CERT_FIELD_ID = 12;
    REGISTRATION_FIELD_ID = 10;
    DATE_REG_FIELD_NO = 11;

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

    FIRE_NOC_FIELD_ID = 657;
    AAI_NOC_FIELD_ID = 667;
    ENV_NOC_FIELD_ID = 668;
    SANC_LAYOUT_FIELD_ID = 317;
    SANC_BUILDING_FIELD_ID = 520;
    BROCHURE_FIELD_ID = 936;

    ARCHITECT_NAME_FIELD_ID = 104;
    ARCHITECT_MOBILE_FIELD_ID = 89;
    ARCHITECT_LICENSE_FIELD_ID = 106;
    ENGINEER_NAME_FIELD_ID = 116;
    ENGINEER_MOBILE_FIELD_ID = 89;
    ENGINEER_EMAIL_FIELD_ID = 373;

    GARAGE_AVAILABLE_FIELD_ID = 645;
    GARAGE_TOTAL_FIELD_ID = 649;
    OPEN_PARKING_FIELD_ID = 634;
    TOTAL_BUILT_UP_FIELD_ID=625;
    TOTAL_OPEN_PARKING_FIELD_ID = 637;
    COVER_PARKING_FIELD_ID = 640;
    TOTAL_COVER_PARKING_FIELD_ID = 643;
    PERMISSIBLE_FAR_FIELD_ID = 610;
    SANCTIONED_FAR_FIELD_ID = 510;
    RECREATIONAL_SPACE_FIELD_ID = 631;
    ARCHITECTURE_FIELD_ID = 33;
    CONSTRUCTION_FIELD_ID = 611;
    EARTHQUAKE_FIELD_ID = 42;
    PROFIT_LOSS_FIELD_ID = 473;
    BALANCE_SHEET_FIELD_ID = 474;
    CASH_FLOW_FIELD_ID = 475;
    DIRECTOR_REPORT_FIELD_ID = 476;
    COMMENCEMENT_NOTICE_FIELD_ID = 926;
    AFFIDAVIT_FIELD_ID = 927;
    /**new**/
    DESIGNATED_NAME_FIELD_ID = 361;
    DESIGNATON_FIELD_ID = 280;
    DESIGNATED_SECONDARY_FIELD_ID = 142;
    DESIGNATED_MOBILE_FIELD_ID = 367;

    startDate: string = '';
    endDate: string = '';
    projectStatus: string = '';
    projectType: string = '';
    landArea: string = '0';
    projectAddress: string = '';
    carpetAreaUnits: string = '';
    amenities: any[] = [];
    certificate: string = '';
    entitytypeid: number = 0;
    totalunit: number = 0;
    available: number = 0;
    totalbulding: number = 0;
    authority: string = '';
    approvaltime: string = '';
    promotername: string = '';
    occupation: string = '';
    brief: string = '';
    exppromoter: string = '';
    expbihar: string = '';
    expother: string = '';
    dob: string = '';
    guardian: string = '';
    email: string = '';
    gender: string = '';
    promoterid: number = 0;
    @ViewChild('attachcontent') private attachcontent: any;
    private attachmentService: NgbModalRef | undefined;
    attachments: any[] = [];
    regno: string = '';
    regdate: string = '';
    addr1: string = '';
    addr2: string = '';
    state: string = '';
    district: string = '';
    pin: string = '';
    website: string = '';
    comcert: string = '';
    architect: any[] = [];
    Object = Object;
    engineer: any[] = [];
    parwebsite: string = '';
    parpin: string = '';
    pardistrict: string = '';
    parstate: string = '';
    paraddr: string = '';
    paraddr2: string = '';
    parcmp: string = '';

    parent_details = [2, 4];
    projectregno: string = '';
    description: string = '';
    estdevcost: string = '';
    estlandcost: string = '';
    projwebsite: string = '';
    projstate: string = '';
    projdistrict: string = '';
    projsubdiv: string = '';
    projblock: string = '';
    projcity: string = '';
    west: string = '';
    east: string = '';
    south: string = '';
    north: string = '';
    latitude: string = '';
    longitude: string = '';
    openarea: string = '';
    entitytypedesc: string = '';
    desmobile: string = '';
    desname: string = '';
    dessecondary: string = '';
    desg: string = '';
    directors: any = [];
    pastprojects: any = [];
    garageAval: string = '';
    garageTotal: string = '';
    openParking: string = '';
    totalOpenParking: string = '';
    coverParking: string = '';
    totalCoverParking: string = '';
    recreationalField: string = '';
    permissibleFAR: string = '';
    sanctionedFAR: string = '';
    architecture: string = '';
    construction: string = '';
    earthquake: string = '';
    fullbuildings: any[] = [];
    sanctionDocDetails: any[] = [];
    projectDocDetails: any[] = [];
    financialDocDetails: any[] = [];
    totalbuiltup: string='';

    constructor(private activeRoute: ActivatedRoute, private modalService: NgbModal, private notifier: NotifierService, private route: Router,
                private apiService: SearchService, private common: CommonService, private config: ConfigService) {
    }

    ngOnInit(): void {
        this.projectuid = this.activeRoute.snapshot.paramMap.get('projectuid');
        this.fetchProjectDetails();
        this.images = [
            new ImageItem({src: 'assets/images/no-preview.png', thumb: 'assets/images/no-preview.png'}),
            // new ImageItem({src: 'assets/images/no-preview.png', thumb: 'assets/images/no-preview.png'}),
            // new ImageItem({src: 'assets/images/no-preview.png', thumb: 'assets/images/no-preview.png'}),
        ];
    }

    fetchProjectDetails() {
        this.common.loaderShow();
        const data = {reraid: this.common.getReraId(), projectuid: this.projectuid};
        this.apiService.fetchProjectDetails(data).subscribe((res: any) => {
            if (res.success) {
                this.common.loaderEnd();
                if (res.response.length > 0) {
                    this.projectid = res.response[0].id;
                    this.projectname = res.response[0].projectfieldvalue;
                    this.certificate = res.response[0].certificate;
                    this.entitytypeid = res.response[0].entitytypeid;
                    this.entitytypedesc = res.response[0].entitytypedesc;
                    this.approvaltime = res.response[0].approvaltime;
                    this.promoterid = res.response[0].particularprofileid;
                    this.projectregno = res.response[0].registrationno;

                    this.fetchProjectValueDetails(this.PROJECT_INFORMATION_STEP_ID, [this.START_DATE_FIELD_ID, this.END_DATE_FIELD_ID,
                        this.PROJECT_STATUS_FIELD_ID, this.PROJECT_TYPE_FIELD_ID, this.LAND_AREA_FIELD_ID, this.PROJECT_ADDRESS_FIELD_ID,
                        this.DESCRIPTION_FIELD_ID, this.ESTIMATED_DEV_COST_FIELD_ID, this.ESTIMATED_LAND_COST_FIELD_ID, this.PROJ_WEBSITE_FIELD_ID,
                        this.PROJECT_DISTRICT_FIELD_ID, this.PROJECT_SUBDIVISION_FIELD_ID, this.PROJECT_BLOCK_FIELD_ID, this.PROJECT_CITY_FIELD_ID,
                        this.EAST_FIELD_ID, this.WEST_FIELD_ID, this.SOUTH_FIELD_ID, this.NORTH_FIELD_ID, this.LATITUDE_FIELD_ID, this.LONGITUDE_FIELD_ID]).then((details: any) => {
                        for (let i = 0; i < details.length; i++) {
                            if (details[i].fieldid === this.START_DATE_FIELD_ID) {
                                this.startDate = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.END_DATE_FIELD_ID) {
                                this.endDate = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.PROJECT_STATUS_FIELD_ID) {
                                this.projectStatus = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.PROJECT_TYPE_FIELD_ID) {
                                this.projectType = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.LAND_AREA_FIELD_ID) {
                                this.landArea = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.PROJECT_ADDRESS_FIELD_ID) {
                                this.projectAddress = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.DESCRIPTION_FIELD_ID) {
                                this.description = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.ESTIMATED_DEV_COST_FIELD_ID) {
                                this.estdevcost = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.ESTIMATED_LAND_COST_FIELD_ID) {
                                this.estlandcost = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.PROJ_WEBSITE_FIELD_ID) {
                                this.projwebsite = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.PROJECT_BLOCK_FIELD_ID) {
                                this.projblock = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.PROJECT_DISTRICT_FIELD_ID) {
                                this.projdistrict = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.PROJECT_SUBDIVISION_FIELD_ID) {
                                this.projsubdiv = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.PROJECT_CITY_FIELD_ID) {
                                this.projcity = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.WEST_FIELD_ID) {
                                this.west = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.EAST_FIELD_ID) {
                                this.east = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.SOUTH_FIELD_ID) {
                                this.south = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.NORTH_FIELD_ID) {
                                this.north = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.LATITUDE_FIELD_ID) {
                                this.latitude = details[i].projectfieldvalue;
                            } else if (details[i].fieldid === this.LONGITUDE_FIELD_ID) {
                                this.longitude = details[i].projectfieldvalue;
                            }
                        }
                    });
                    this.fetchCommonAmenities();
                    this.fetchBuildingDetails();
                } else {
                    this.notifier.notify('error', 'Project Details not found.')
                }

            } else {
                this.notifier.notify('error', res.message)
            }
        });
    }

    fetchProjectValueDetails(stepid: number, fieldid: any[], groupid = 0) {
        const promise = new Promise((resolve, reject) => {
            let data: any = {};
            data = {reraid: this.common.getReraId(), projectid: this.projectid, stepid: stepid, fieldid: fieldid};
            if (groupid !== 0) {
                data['groupid'] = groupid;
            }
            this.apiService.fetchProjectValueDetails(data).subscribe((res: any) => {
                if (res.success) {
                    if (res.response.length > 0) {
                        resolve(res.response);
                    } else {
                        // this.notifier.notify('error', 'Project value not found for .' + stepid)
                        reject();
                    }
                } else {
                    reject();
                    this.notifier.notify('error', res.message)
                }
            });
        })
        return promise;
    }

    fetchEngineerDetails(stepid: number, fieldid: any[], groupid: number) {
        const promise = new Promise((resolve, reject) => {
            const data = {
                reraid: this.common.getReraId(),
                projectid: this.projectid,
                stepid: stepid,
                fieldid: fieldid,
                groupid: groupid
            };
            this.apiService.fetchEngineerDetails(data).subscribe((res: any) => {
                if (res.success) {
                    if (res.response.length > 0) {
                        resolve(res.response);
                    } else {
                        // this.notifier.notify('error', 'Project value not found for .' + stepid)
                        reject();
                    }
                } else {
                    reject();
                    this.notifier.notify('error', res.message)
                }
            },()=>{
                reject();
            });
        });
        return promise;
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
            },()=>{
                reject();
            });
        });
        return promise;
    }

    fetchCommonAmenities() {
        const data = {
            reraid: this.common.getReraId(),
            projectid: this.projectid,
            stepid: this.COMMON_AMENITIES_STEP_ID,
            groupid: this.COMMON_AMENITIES_GROUP_ID
        };
        this.apiService.fetchCommonAmenities(data).subscribe((res: any) => {
            if (res.success) {
                if (res.response.length > 0) {
                    this.amenities = res.response;
                    for (let i = 0; i < this.amenities.length; i++) {
                        this.amenities[i].imagesrc = 'assets/images/aminity' + this.amenities[i].fieldid + '.png';
                    }
                } else {
                    // this.notifier.notify('error', 'No Common Amenities for this project.')
                }
            } else {
                this.notifier.notify('error', res.message)
            }
        });

    }

    fetchBuildingDetails() {
        const data = {
            reraid: this.common.getReraId(),
            projectid: this.projectid
        };
        this.apiService.fetchBuildingDetails(data).subscribe((res: any) => {
            if (res.success) {
                this.totalunit = res.response.totalunit;
                this.available = res.response.available;
                this.totalbulding = res.response.totalbulding;
                this.authority = res.response.authority;
                this.openarea = res.response.openarea;

            } else {
                this.notifier.notify('error', res.message)
            }
        });

    }

    onTabChange($event: any) {
        // console.log($event)
        if ($event.index === 1) {
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
            this.fetchEngineerDetails(this.PROFESSIONAL_DETAILS_STEP_ID, [this.ARCHITECT_NAME_FIELD_ID, this.ARCHITECT_LICENSE_FIELD_ID, this.ARCHITECT_MOBILE_FIELD_ID, this.ENGINEER_EMAIL_FIELD_ID], this.ARCHITECT_GROUP_ID).then((details: any) => {
                this.architect = details;
            });
            this.fetchEngineerDetails(this.PROFESSIONAL_DETAILS_STEP_ID, [this.ENGINEER_EMAIL_FIELD_ID, this.ENGINEER_MOBILE_FIELD_ID, this.ENGINEER_NAME_FIELD_ID], this.ENGINEER_GROUP_ID).then((details: any) => {
                this.engineer = details;
            });
            this.fetchDirectorDetails();
            this.fetchPastProject();
        } else if ($event.index === 2) {
            this.fetchProjectValueDetails(this.SANCTION_STEP_ID, [this.GARAGE_AVAILABLE_FIELD_ID, this.GARAGE_TOTAL_FIELD_ID,
                this.OPEN_PARKING_FIELD_ID, this.TOTAL_OPEN_PARKING_FIELD_ID, this.COVER_PARKING_FIELD_ID, this.TOTAL_COVER_PARKING_FIELD_ID,
                this.RECREATIONAL_SPACE_FIELD_ID,this.TOTAL_BUILT_UP_FIELD_ID], this.DEVELOPMENT_DETAILS_GROUP_ID).then((details: any) => {
                for (let i = 0; i < details.length; i++) {
                    if (details[i].fieldid === this.GARAGE_AVAILABLE_FIELD_ID) {
                        this.garageAval = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.GARAGE_TOTAL_FIELD_ID) {
                        this.garageTotal = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.OPEN_PARKING_FIELD_ID) {
                        this.openParking = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.TOTAL_OPEN_PARKING_FIELD_ID) {
                        this.totalOpenParking = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.COVER_PARKING_FIELD_ID) {
                        this.coverParking = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.TOTAL_COVER_PARKING_FIELD_ID) {
                        this.totalCoverParking = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.RECREATIONAL_SPACE_FIELD_ID) {
                        this.recreationalField = details[i].projectfieldvalue;
                    }else if (details[i].fieldid === this.TOTAL_BUILT_UP_FIELD_ID) {
                        this.totalbuiltup = details[i].projectfieldvalue;
                    }
                }
            });
            this.fetchProjectValueDetails(this.SANCTION_STEP_ID, [this.PERMISSIBLE_FAR_FIELD_ID, this.SANCTIONED_FAR_FIELD_ID,
                this.ARCHITECTURE_FIELD_ID, this.CONSTRUCTION_FIELD_ID, this.EARTHQUAKE_FIELD_ID]).then((details: any) => {
                for (let i = 0; i < details.length; i++) {
                    if (details[i].fieldid === this.PERMISSIBLE_FAR_FIELD_ID) {
                        this.permissibleFAR = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.SANCTIONED_FAR_FIELD_ID) {
                        this.sanctionedFAR = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.ARCHITECTURE_FIELD_ID) {
                        this.architecture = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.CONSTRUCTION_FIELD_ID) {
                        this.construction = details[i].projectfieldvalue;
                    } else if (details[i].fieldid === this.EARTHQUAKE_FIELD_ID) {
                        this.earthquake = details[i].projectfieldvalue;
                    }
                }
            });
            this.fetchFullBuildingDetails();
        } else if ($event.index === 3) {
            this.fetchDocuments(this.SANCTION_STEP_ID, [this.SANC_BUILDING_FIELD_ID, this.SANC_LAYOUT_FIELD_ID]).then((res: any) => {
                if (res.success) {
                    this.sanctionDocDetails = res.response;
                }
            });
            this.fetchDocuments(this.PROJECT_INFORMATION_STEP_ID, [this.BROCHURE_FIELD_ID, this.AFFIDAVIT_FIELD_ID, this.COMMENCEMENT_NOTICE_FIELD_ID]).then((res: any) => {
                if (res.success) {
                    this.projectDocDetails = res.response;
                }
            });
            this.fetchFinancialDocument();
        }
    }

    fetchFinancialDocument() {
        const data = {
            reraid: this.common.getReraId(),
            projectid: this.projectid,
            stepid: this.FINANCIAL_DETAILS_STEP_ID,
            groupid: this.FINANCIAL_DOC_GROUP_ID,
            fieldid: [this.PROFIT_LOSS_FIELD_ID, this.BALANCE_SHEET_FIELD_ID, this.CASH_FLOW_FIELD_ID, this.DIRECTOR_REPORT_FIELD_ID]
        };

        this.apiService.fetchFinancialDocuments(data).subscribe((res: any) => {
            if (res.success) {
                this.financialDocDetails = res.response;
            } else {
                this.financialDocDetails = [];
            }
        }, () => {
        });
    }

    downloadCertificate(file: string) {
        // console.log(file)
        // console.log(this.config.CRT_ROOT + file)
        window.open(this.config.CRT_ROOT + file, '_blank');
    }

    ViewDocument(file: string) {
        // console.log(file)
        // console.log(this.config.CRT_ROOT + file)
        window.open(this.config.FILE_ROOT + file, '_blank');
    }

    showDocuments(type: string) {

        this.attachments = [];
        let data: any = {};
        data = {reraid: this.common.getReraId(), projectid: this.projectid};
        if (type === 'land') {
            data["stepid"] = this.LAND_DETAILS_STEP_ID;
        } else if (type === 'noc') {
            data["stepid"] = this.SANCTION_STEP_ID;
            data["fieldid"] = [this.AAI_NOC_FIELD_ID, this.FIRE_NOC_FIELD_ID, this.ENV_NOC_FIELD_ID];
        } else if (type === 'sanction') {
            data["stepid"] = this.SANCTION_STEP_ID;
            data["fieldid"] = [this.SANC_BUILDING_FIELD_ID, this.SANC_LAYOUT_FIELD_ID];
        } else if (type === 'brochure') {
            data["stepid"] = this.PROJECT_INFORMATION_STEP_ID;
            data["fieldid"] = [this.BROCHURE_FIELD_ID];
        }

        this.apiService.fetchDocuments(data).subscribe((res: any) => {
            if (res.success) {
                this.attachmentService = this.modalService.open(this.attachcontent, {});
                this.attachments = res.response;
            } else {
                this.notifier.notify('error', res.message)
            }
        });
    }

    fetchDocuments(stepid: number, fieldid: number[] = [], groupid = 0) {
        const promise = new Promise((resolve, reject) => {
            let data: any = {};
            data = {reraid: this.common.getReraId(), projectid: this.projectid, stepid: stepid};
            if (fieldid.length > 0) {
                data["fieldid"] = fieldid;
            }
            if (groupid > 0) {
                data["groupid"] = groupid;
            }
            this.apiService.fetchDocuments(data).subscribe((res: any) => {
                resolve(res)
            }, () => {
                reject();
            });
        });
        return promise;
    }

    fetchDirectorDetails() {
        const data = {
            userid: this.promoterid,
            entitytypeid: this.entitytypeid
        };
        this.apiService.fetchDirectorDetails(data).subscribe((res: any) => {
            if (res.success) {
                this.directors = res.response;
                for (let i = 0; i < this.directors.length; i++) {
                    if (this.directors[i].photo === 'N/A') {
                        this.directors[i].photo = 'assets/images/src-ppictr.png';
                    } else {
                        this.directors[i].photo = this.config.FILE_ROOT + this.directors[i].photo;
                    }
                }

            } else {
                this.notifier.notify('error', res.message)
            }
        });

    }

    fetchPastProject() {
        const data = {
            reraid: this.common.getReraId(),
            projectid: this.projectid,
            userid: this.promoterid
        };
        this.apiService.fetchPastProject(data).subscribe((res: any) => {
            if (res.success) {
                this.pastprojects = res.response;
            } else {
                this.notifier.notify('error', res.message)
            }
        });

    }

    fetchFullBuildingDetails() {
        const data = {
            reraid: this.common.getReraId(),
            projectid: this.projectid,
        };
        this.apiService.fetchFullBuildingDetails(data).subscribe((res: any) => {
            if (res.success) {
                this.fullbuildings = res.response;
            } else {
                this.notifier.notify('error', res.message)
            }
        });

    }

    ngOnDestroy(): void {

    }

    closeAttachment() {
        if (this.attachmentService) {
            this.attachmentService.close()
        }
    }
}
