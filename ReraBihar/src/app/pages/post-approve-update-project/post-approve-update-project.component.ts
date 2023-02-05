import {Component, Input, OnInit} from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifierService} from "angular-notifier";
import {ProjectConfService} from "../project-conf.service";

@Component({
    selector: 'app-post-approve-update-project',
    templateUrl: './post-approve-update-project.component.html',
    styleUrls: ['./post-approve-update-project.component.css']
})
export class PostApproveUpdateProjectComponent implements OnInit {
    name = '';
    @Input() projectId = 0;
    @Input() isComplete = 0;
    @Input() projectuid: any = '';
    @Input() viewMod: any = false;
    stepList: any = [];
    formDetailsList: any = [];
    selectedBuildingInfo: any = [];
    selectedTabIndex = 0;
    selectedBuilding = '';
    projectDetails: any = {
        projectuid: '',
        projectName: '',
        projectAddress: '',
        promoterName: '',
        copromoterName: '',
        validatyenddate: '',
        projectStartDate: '',
        projectType: '',
        periodOfValidityDate: ''
    };
    projectInformationDtl: any = [];
    webPageLink = '';
    projectProspectus = '';
    projectDesignImg = '';
    stateList: any = [];
    FILE_ROOT = '';
    signatureFile = '';
    submitPersonName = '';
    isAcceptDeclaration = false;
    inventoryData: any = {
        building: [],
        commercial: [],
        garage: []
    };
    fileUploadToolTip = 'Maximum file size of a PDF is 5MB and for image 2MB';
    constructor(private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
                private modalService: NgbModal, private notifier: NotifierService, private router: Router,
                private projectConf: ProjectConfService) {
        this.FILE_ROOT = this.rest.FILE_ROOT;
    }

    ngOnInit(): void {
        this.name = this.common.getUserName();
        if (!this.viewMod) {
            this.projectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
            this.isComplete = Number(this.activeRoute.snapshot.paramMap.get('isComplete'));
            this.projectuid = this.activeRoute.snapshot.paramMap.get('projectuid');
        }
        this.getProjectDetail();
        this.getUpdateProjectFormInfo();
        this.getState();
    }

    onlyNumber(event: any): boolean {
        if (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) || event.keyCode == 8 || event.keyCode == 190 || event.keyCode == 110) {
            return true;
        } else {
            return false;
        }
    }

    getState() {
        this.rest.getState({reraid: this.common.getReraId(), userid: this.common.getUserId()}).subscribe((res: any) => {
            if (res.success) {
                this.stateList = res.response;
                this.getInformationUpdateData();
            }
        })
    }

    getInformationUpdateData(): void {
        const data = {
            userid: this.common.getUserId(),
            reraid: this.common.getReraId(),
            projectid: this.projectId
        };
        this.rest.getInformationUpdateData(data).subscribe((res: any) => {
            if (res.success) {
                let arr: any = [];
                this.stateList.map((item: any) => {
                    arr.push(item.statename);
                });
                for (const obj of res.response.groupFields) {
                    for (const field of obj.fielddetails) {
                        if (field['State']) {
                            field['State'][0].controlvalue = arr.join('|');
                            this.onDropdownChange(field, 'State');
                        }
                    }
                }
                this.projectInformationDtl = res.response.groupFields;
                if (res.response.resWebDtl) {
                    this.webPageLink = res.response.resWebDtl.webpagelink ? res.response.resWebDtl.webpagelink : '';
                    this.projectProspectus = res.response.resWebDtl.projectprospectus ? res.response.resWebDtl.projectprospectus : '';
                    this.projectDesignImg = res.response.resWebDtl.projectdesignimg ? res.response.resWebDtl.projectdesignimg : '';
                }
            }
        });
    }

    addMoreBtn(obj: any, grouppos: any, stepId: any, groupId: any, pos: number = -1, fielddesc: string = '', step: string = ''): any {
        const data = JSON.parse(JSON.stringify(obj.fielddetails[0]));
        let position;
        pos !== -1 ? position = pos : position = grouppos;
        for (const key of obj.fielddetailskeys[0]) {
            for (const [index, d] of data[key].entries()) {
                if (d.fieldgroupid == null) {
                    d.fieldvalue = '';
                    d.tempid = null;
                } else {
                    // console.log(JSON.stringify(d));
                    if (d.groupView === 'table') {
                        for (const row of d.fielddetails['keys']) {
                            for (const d1 of d.fielddetails.details[row]) {
                                d1.fieldvalue = '';
                            }
                        }
                    } else {
                        d.fielddetails.length = 1;
                        d.fielddetailskeys.length = 1;
                        for (const d1 of d.fielddetails) {
                            for (const k1 of d.fielddetailskeys[0]) {
                                d1[k1][0].fieldvalue = '';
                                d1[k1][0].tempid = null;
                            }
                        }
                    }
                }
            }
        }
        obj.fielddetailskeys.push(JSON.parse(JSON.stringify(obj.fielddetailskeys[0])));
        // console.log(JSON.stringify(data));
        obj.fielddetails.push(data);
        this.addFieldDetails(obj, stepId, groupId, grouppos, step);
    }


    removeItemBtn(obj: any, pos: number, fieldGroup: any = {}, fieldGroupPos: number = 0): any {
        const data = {
            projectid: this.projectId,
            groupid: obj.groupid,
            position: pos + '',
            fieldgroupid: fieldGroup.fieldgroupid ? fieldGroup.fieldgroupid : '0',
            fieldgrouppos: fieldGroupPos + '',
            iscomplete: this.isComplete + '',
            userid: this.common.getUserId()
        };
        this.rest.deleteProjectTemp(data).subscribe((res: any) => {
            if (fieldGroup.fieldgroupid) {
                fieldGroup.fielddetails.splice(fieldGroupPos, 1);
            } else {
                obj.fielddetails.splice(pos, 1);
            }
        }, (err: any) => {
        });
    }

    removeImage(findx: number) {
        const fileArr = this.projectDesignImg.split(',');
        fileArr.splice(findx, 1);
        this.projectDesignImg = fileArr.join(',');
    }

    addFieldDetails(obj: any, stepId: any, groupId: any, grouppos: any, step: string) {
        const data = {
            reraid: this.common.getReraId(),
            obj: obj,
            stepid: stepId,
            groupid: groupId,
            groupposition: grouppos + '',
            projectid: this.projectId
        };
        this.common.loaderShow();
        this.rest.addAllFieldDetails(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                // console.log("\n RESPONSE ------------    ", res);
                // this.notifier.notify('success', res.message);
                // this.rearrangeForm(step, obj);
            } else {
                this.notifier.notify('error', res.message);
            }
        });
    }

    onFocusDropdown(field: any, key: string) {
        if (key === 'State') {
            let arr: any = [];
            this.stateList.map((item: any) => {
                arr.push(item.statename);
            });
            field[key][0].controlvalue = arr.join('|');
        }
    }

    onDropdownChange(field: any, key: string) {
        if (key === 'State') {
            let stateId = 0;
            for (const obj of this.stateList) {
                if (field[key][0].fieldvalue === obj.statename) {
                    stateId = obj.id;
                    break;
                }
            }
            this.getDistricts(field, key, stateId);
        }
    }

    getDistricts(field: any, key: string, stateId: number) {
        this.rest.getDistricts({stateid: stateId}).subscribe((res: any) => {
            if (res.success) {
                const cityArr: any = [];
                res.response.map((item: any) => {
                    cityArr.push(item.cityname);
                })
                field['District'][0].controlvalue = cityArr.join('|');
            }
        })
    }


    goToProfile(): void {
        this.router.navigate(['/pages/profile-details'])
    }

    goToProjectDetails(): void {
        this.router.navigate([])
            .then((result: any) => {
                window.open(this.rest.BASE_PATH + 'pages/project-details/' + this.projectId + '/' + this.isComplete + '/' + this.projectuid, '_blank');
            })
    }

    logout(): void {
        sessionStorage.clear();
        this.router.navigate(['/']);
    }

    getProjectDetail() {
        this.common.loaderShow();
        const data = {
            userid: this.common.getUserId(),
            reraid: this.common.getReraId(),
            projectid: this.projectId
        };
        this.rest.getProjectDetail(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                if (res.response.validatyenddate) {
                    res.response.validatyenddate = this.common.formatDate(res.response.validatyenddate);
                }
                this.projectDetails = res.response;
                this.getStageTwoHdr();
            }
        }, (err: any) => {
            this.common.loaderEnd();
        });
    }

    getStageTwoHdr() {
        const data = {
            projectid: this.projectId,
            reraid: this.common.getReraId(),
            userid: this.common.getUserId()
        };
        this.rest.getStageTwoHdr(data).subscribe((res: any) => {
            if (res.success && res.response) {
                this.isAcceptDeclaration = res.response.isdeclarationaccept == 1;
                this.submitPersonName = res.response.submitpersonname;
                this.signatureFile = res.response.signature;
            }
        });
    }

    getUpdateProjectFormInfo(): void {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId(),
            projectid: this.projectId
        };
        this.rest.getUpdateProjectFormInfo(data).subscribe(async (res: any) => {
            if (res.success) {
                /*this.stepList = Object.keys(res.response);
                for (let step of this.stepList) {
                  if (step === 'Building Development Plan') {
                    await this.getBuildingListOfProject()
                  }
                  res.response[step].sort(function (a: any, b: any) {
                    return a.sequence - b.sequence
                  });
                }*/
                this.formDetailsList = res.response;
                for (let obj of this.formDetailsList) {
                    if (obj.stepdesc === 'Building Development Plan') {
                        this.selectedBuilding = obj.formDetails[0].buildingName;
                        this.selectedBuildingInfo = [obj.formDetails[0]];
                    }
                }
            }
        });
    }

    onTabChange(event: any): void {
        // console.log(event);
        this.selectedTabIndex = event.index;
        if (event.index === 1) {
            this.getInventoryDetails();
        }
    }

    getInventoryDetails() {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId(),
            projectid: this.projectId
        };
        this.common.loaderShow();
        this.rest.getInventoryDetails(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                // console.log(JSON.stringify(res.response));
                this.inventoryData = res.response;
            }
        }, (err: any) => {
            this.common.loaderEnd();
        });
    }

    submitInventoryData(type = '') {
        let flag = 0;
        for (const obj of this.inventoryData.building) {
            obj.berr = '';
            obj.serr = '';
            if (obj.bookedunit && obj.bookedunit !== '' && (Number(obj.sprom) < Number(obj.bookedunit))) {
                obj.berr = 'wrongval';
                flag = 1;
            }
            if (obj.soldunit && obj.soldunit !== '' && Number(obj.sprom) < Number(obj.soldunit)) {
                obj.serr = 'wrongval';
                flag = 1;
            }
        }
        for (const obj of this.inventoryData.commercial) {
            obj.berr = '';
            obj.serr = '';
            if (obj.bookedunit && obj.bookedunit !== '' && (Number(obj.sprom) < Number(obj.bookedunit))) {
                obj.berr = 'wrongval';
                flag = 1;
            }
            if (obj.soldunit && obj.soldunit !== '' && Number(obj.sprom) < Number(obj.soldunit)) {
                obj.serr = 'wrongval';
                flag = 1;
            }
        }
        for (const obj of this.inventoryData.garage) {
            obj.berr = '';
            obj.serr = '';
            if (obj.bookedunit && obj.bookedunit !== '' && (Number(obj.gprom) < Number(obj.bookedunit))) {
                obj.berr = 'wrongval';
                flag = 1;
            }
            if (obj.soldunit && obj.soldunit !== '' && Number(obj.gprom) < Number(obj.soldunit)) {
                obj.serr = 'wrongval';
                flag = 1;
            }
        }
        if (flag === 0) {
            const data = {
                reraid: this.common.getReraId(),
                userid: this.common.getUserId(),
                projectid: this.projectId,
                inventoryData: this.inventoryData
            };
            this.rest.saveInventoryData(data).subscribe((res: any) => {
                if (res.success) {
                    this.notifier.notify('success', res.message);
                    if (type === 'next') {
                        this.selectedTabIndex += 1;
                    }
                } else {
                    this.notifier.notify('error', res.message);
                }
            });
        } else {
            this.notifier.notify('error', 'You have entered wrong details');
        }
    }

    goToNextTab(stepName: string, type: string = ''): any {
        for (let obj of this.formDetailsList) {
            if (obj.stepdesc === stepName) {
                for (const frmDtl of obj.formDetails) {
                    for (const fdDtl of frmDtl.fielddetails) {
                        // console.log(JSON.stringify(fdDtl));
                        if (fdDtl.isproposed == 1) {
                            if (fdDtl.fieldproposedvalue !== '' && fdDtl.fieldproposedvalue == 'Yes' && (fdDtl.startdate === '' || fdDtl.enddate === '')) {
                                this.notifier.notify('error', 'All fields are mandatory');
                                return false;
                            } else if (fdDtl.fieldproposedvalue === '') {
                                this.notifier.notify('error', 'All fields are mandatory');
                                return false;
                            } else if ((fdDtl.startdate !== '' && fdDtl.enddate !== '') && !this.common.isEndMaxDate(fdDtl.startdate, fdDtl.enddate)) {
                                this.notifier.notify('error', 'Start date should be less than the end date');
                                return false;
                            }
                        } else {
                            if (fdDtl.startdate === '' || fdDtl.enddate === '') {
                                this.notifier.notify('error', 'All fields are mandatory');
                                return false;
                            } else if ((fdDtl.startdate !== '' && fdDtl.enddate !== '') && !this.common.isEndMaxDate(fdDtl.startdate, fdDtl.enddate)) {
                                this.notifier.notify('error', 'Start date should be less than the end date');
                                return false;
                            }
                        }
                    }
                }
                break;
            }
        }
        this.notifier.notify('success', 'Details updated successfully')
        if (type === 'next') {
            this.selectedTabIndex += 1;
        }
    }

    goToPrevTab(): void {
        this.selectedTabIndex -= 1;
    }

    onBlurElement(relationid: number, stagetwofieldid: number, fieldObj: any, releatedgroupid: any = null, relatedfieldid: any = null, relatedgrouppos: any = null): void {
        const data = {
            projectid: this.projectId,
            userid: this.common.getUserId(),
            reraid: this.common.getReraId(),
            relationid: relationid,
            stagetwofieldid: stagetwofieldid,
            fieldid: fieldObj.fieldid ? fieldObj.fieldid : '',
            fieldproposedvalue: fieldObj.fieldproposedvalue,
            startdate: fieldObj.startdate,
            enddate: fieldObj.enddate,
            releatedgroupid: releatedgroupid,
            relatedfieldid: relatedfieldid,
            relatedgrouppos: relatedgrouppos + ''
        };
        // console.log(JSON.stringify(data));
        this.rest.stageTwoStoreTemp(data).subscribe((res: any) => {
        });
    }

    submitForm(): any {
        /*for (const obj of this.formDetailsList) {
          for (const frmDtl of obj.formDetails) {
            for (const fdDtl of frmDtl.fielddetails) {
              if (fdDtl.startdate === '' || fdDtl.enddate === '') {
                this.notifier.notify('error', 'All fields are mandatory');
                return false;
              }
            }
          }
        }*/
        if (!this.isAcceptDeclaration) {
            this.notifier.notify('error', 'You have not check the declaration');
            return false;
        } else if (this.submitPersonName.trim() === '') {
            this.notifier.notify('error', 'You have to enter your name to submit');
            return false;
        } else if (this.signatureFile.trim() === '') {
            this.notifier.notify('error', 'Please upload your signature');
            return false;
        }
        const data = {
            projectid: this.projectId,
            userid: this.common.getUserId(),
            reraid: this.common.getReraId(),
            isAcceptDeclaration: this.isAcceptDeclaration ? '1' : '0',
            submitPersonName: this.submitPersonName,
            signature: this.signatureFile
        };
        this.rest.stageTwoSubmitForm(data).subscribe((res: any) => {
            if (res.success) {
                this.notifier.notify('success', res.message);
                this.router.navigate(['/pages/project-dashboard']);
            } else {
                this.notifier.notify('error', res.message);
            }
        });
    }

    onCustomDateSelect(event: any, type: string, relationid: any, stagetwofieldid: number, fieldObj: any, releatedgroupid: any = null, relatedfieldid: any = null, relatedgrouppos: any = null) {
        if (type === 'start') {
            fieldObj.startdate = event;
        } else {
            fieldObj.enddate = event;
        }
        this.onBlurElement(relationid, stagetwofieldid, fieldObj, releatedgroupid, relatedfieldid, relatedgrouppos);
    }

    onBuildingChange(data: any) {
        this.selectedBuildingInfo = [data];
    }

    uploadFile(event: any, type: string): any {
        if (event.target.files.length > 0) {
            const fileSize = event.target.files[0].type.indexOf('pdf') > -1 ? 10485760 : 2097152;
            if (event.target.files[0].size > fileSize) {
                this.notifier.notify('error', 'File size limit exceeds.');
                return false;
            }
            const fd = new FormData();
            fd.append('file', event.target.files[0]);
            this.rest.uploadFile(fd).subscribe((res: any) => {
                if (res.success) {
                    if (type === 'designImg') {
                        this.projectDesignImg = this.projectDesignImg === '' ? res.response.fileName : this.projectDesignImg + ',' + res.response.fileName;
                    } else if (type === 'Prospectus') {
                        this.projectProspectus = res.response.fileName;
                    } else if (type === 'signature') {
                        this.signatureFile = res.response.fileName;
                    }
                } else {
                    this.notifier.notify('error', res.message);
                }
            })
        }
    }

    submitProjectInformation(type: string = '') {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getReraId(),
            projectid: this.projectId,
            entiryid: this.common.getEntityId(),
            entitytypeid: 1,
            webpagelink: this.webPageLink,
            projProspectus: this.projectProspectus,
            projectDesignImg: this.projectDesignImg,
            groupFields: this.projectInformationDtl
        };
        this.rest.saveInformationUpdateData(data).subscribe((res: any) => {
            if (res.success) {
                this.notifier.notify('success', res.message);
                if (type === 'next') {
                    this.selectedTabIndex += 1;
                }
            } else {
                this.notifier.notify('error', res.message);
            }
        })
    }

    validateInputEntry(event: any, obj: any): any {
        if (obj.fielddesc === 'pin' || obj.fielddesc === 'Pin_Code') {
            return this.onlyNumber(event) && obj.fieldvalue.length <= 5;
        } else if (obj.fielddesc === 'contact_No_dot' || obj.fielddesc === 'Contact_No') {
            return this.onlyNumber(event) && obj.fieldvalue.length <= 9;
        }
    }

    openLink(file: any) {
        window.open(this.FILE_ROOT + file, '_blank');
    }

}
