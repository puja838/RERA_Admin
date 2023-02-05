import {Component, OnInit} from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifierService} from "angular-notifier";
import {ProjectConfService} from "../project-conf.service";

@Component({
    selector: 'app-project-execution-edit',
    templateUrl: './project-execution-edit.component.html',
    styleUrls: ['./project-execution-edit.component.css']
})
export class ProjectExecutionEditComponent implements OnInit {
    name = '';
    projectId = 0;
    quoterId = 0;
    projectuid: any = '';
    stepList: any = [];
    formDetailsList: any = [];
    selectedBuildingInfo: any = [];
    selectedTabIndex = 0;
    selectedBuilding = 0;
    selectedBuildingForPhoto = 0;
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
    FILE_ROOT = '';
    signatureFile = '';
    submitPersonName = '';
    isAcceptDeclaration = false;
    tabList: any = ['Booking Update', 'Construction Progress Update', 'Common Amenities Update', 'Photographs', 'Financial Update', 'Legal & Miscellaneous'];
    inventoryData: any = {
        building: [],
        commercial: [],
        garage: []
    };
    quoterName: any = '';
    buildingList: any = [];
    constructionProgressList: any = [];
    financialDetails: any = {
        projectaccountno: '014725836900147',
        estimatedcost: '',
        amtrecquoter: '',
        actiualcost: '',
        netamount: '',
        totalexpenditure: '',
        mortgagecharge: ''
    };
    isFinance = true;
    allSubmit = true;
    financialUpdateId = 0;
    saledeed = '' as any;
    saleagreement = '' as any;
    legalCase: any = [{caseno: '', partyname: ''}];
    commonAmenities: any = [];
    buildingPhotoList: any = [];
    isSubmitted = false;
    quarterStartMonth = 0;
    quarterEndMonth = 0;
    quarterYear = 0;
    photoParticulars: any = [];
    selectedBuildingDtlForPhoto: any;
    particularId = '';
    fullscreenImage = '';
    constructor(private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
                private modalService: NgbModal, private notifier: NotifierService, private router: Router,
                private projectConf: ProjectConfService) {
        this.FILE_ROOT = this.rest.FILE_ROOT;
    }

    ngOnInit(): void {
        this.name = this.common.getUserName();
        this.projectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
        this.quoterId = Number(this.activeRoute.snapshot.paramMap.get('quoterid'));
        this.projectuid = this.activeRoute.snapshot.paramMap.get('projectuid');
        this.quoterName = this.activeRoute.snapshot.paramMap.get('quoterName');
        this.quarterYear = Number(this.quoterName.split(' ')[this.quoterName.split(' ').length - 1]);
        this.getProjectDetail();
        this.getInventoryData();
        setTimeout(() => {
            this.getFinancial_details();
            this.getLegalCase();
        }, 20);
    }

    onlyNumber(event: any): boolean {
        if (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) || event.keyCode == 8 || event.keyCode == 190 || event.keyCode == 110) {
            return true;
        } else {
            return false;
        }
    }

    goToProfile(): void {
        this.router.navigate(['/pages/profile-details'])
    }

    goToProjectDetails(): void {
        this.router.navigate([])
            .then((result: any) => {
                window.open(this.rest.BASE_PATH + 'pages/project-details/' + this.projectId + '/1' + '/' + this.projectuid, '_blank');
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
            projectid: this.projectId,
            quoterid: this.quoterId
        };
        this.rest.getProjectDetail(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                if (res.response.validatyenddate) {
                    res.response.validatyenddate = this.common.formatDate(res.response.validatyenddate);
                }
                this.projectDetails = res.response;
                if (res.response.quarterDtl) {
                    this.quarterStartMonth = res.response.quarterDtl.startmonth;
                    this.quarterEndMonth = res.response.quarterDtl.endmonth;
                }
            }
        }, (err: any) => {
            this.common.loaderEnd()
        });
    }

    onTabChange(event: any) {
        if (event.index === 1) {
            if (this.buildingList.length === 0) {
                this.getBuildingListOfProject('construct');
            } else if (this.constructionProgressList.length === 0) {
                this.selectedBuilding = this.buildingList[0].buildingName;
                this.getConstructionDetails(this.buildingList[0]);
            }
        } else if (event.index === 2) {
            if (this.commonAmenities.length === 0) {
                this.getAmenitiesDetails();
            }
        } else if (event.index === 3) {
            if (this.buildingList.length === 0) {
                this.getBuildingListOfProject('photograph');
            } else if (this.buildingPhotoList.length === 0) {
                this.selectedBuildingForPhoto = this.buildingList[0].buildingName;
                this.selectedBuildingDtlForPhoto = this.buildingList[0];
                this.getBuildingPhotograph();
            }
            if(this.photoParticulars.length === 0) {
                this.getPhotoParticulars();
            }
        }
    }

    goToPrevTab(): void {
        this.selectedTabIndex -= 1;
    }

    goToNext() {
        this.selectedTabIndex += 1;
    }

    getInventoryData() {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId(),
            projectid: this.projectId,
            quoterid: this.quoterId
        };
        this.rest.getInventoryData(data).subscribe((res: any) => {
            if (res.success) {
                this.inventoryData = res.response;
            }
        })
    }

    submitInventoryData(type = '') {
        let flag = 0;
        for (const obj of this.inventoryData.building) {
            obj.berr = '';
            obj.serr = '';
            obj.qberr = '';
            obj.qserr = '';
            if (obj.bookedunit && obj.bookedunit !== '' && (Number(obj.sprom) < Number(obj.bookedunit))) {
                obj.berr = 'wrongval';
                flag = 1;
            }
            if (obj.soldunit && obj.soldunit !== '' && Number(obj.sprom) < Number(obj.soldunit)) {
                obj.serr = 'wrongval';
                flag = 1;
            }
            if (obj.quarterbookedunit && obj.quarterbookedunit !== '' && (Number(obj.sprom) < Number(obj.quarterbookedunit))) {
                obj.qberr = 'wrongval';
                flag = 1;
            }
            if (obj.quartersoldunit && obj.quartersoldunit !== '' && Number(obj.sprom) < Number(obj.quartersoldunit)) {
                obj.qserr = 'wrongval';
                flag = 1;
            }
        }
        for (const obj of this.inventoryData.commercial) {
            obj.berr = '';
            obj.serr = '';
            obj.qberr = '';
            obj.qserr = '';
            if (obj.bookedunit && obj.bookedunit !== '' && (Number(obj.sprom) < Number(obj.bookedunit))) {
                obj.berr = 'wrongval';
                flag = 1;
            }
            if (obj.soldunit && obj.soldunit !== '' && Number(obj.sprom) < Number(obj.soldunit)) {
                obj.serr = 'wrongval';
                flag = 1;
            }
            if (obj.quarterbookedunit && obj.quarterbookedunit !== '' && (Number(obj.sprom) < Number(obj.quarterbookedunit))) {
                obj.qberr = 'wrongval';
                flag = 1;
            }
            if (obj.quartersoldunit && obj.quartersoldunit !== '' && Number(obj.sprom) < Number(obj.quartersoldunit)) {
                obj.qserr = 'wrongval';
                flag = 1;
            }
        }
        for (const obj of this.inventoryData.garage) {
            obj.berr = '';
            obj.serr = '';
            obj.qberr = '';
            obj.qserr = '';
            if (obj.bookedunit && obj.bookedunit !== '' && (Number(obj.gprom) < Number(obj.bookedunit))) {
                obj.berr = 'wrongval';
                flag = 1;
            }
            if (obj.soldunit && obj.soldunit !== '' && Number(obj.gprom) < Number(obj.soldunit)) {
                obj.serr = 'wrongval';
                flag = 1;
            }
            if (obj.quarterbookedunit && obj.quarterbookedunit !== '' && (Number(obj.sprom) < Number(obj.quarterbookedunit))) {
                obj.qberr = 'wrongval';
                flag = 1;
            }
            if (obj.quartersoldunit && obj.quartersoldunit !== '' && Number(obj.sprom) < Number(obj.quartersoldunit)) {
                obj.qserr = 'wrongval';
                flag = 1;
            }
        }
        if (flag === 0) {
            const data = {
                reraid: this.common.getReraId(),
                userid: this.common.getUserId(),
                projectid: this.projectId,
                quoterid: this.quoterId,
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
        }
    }

    getBuildingListOfProject(type: string = 'construct'): any {
        this.common.loaderShow();
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId(),
            projectid: this.projectId
        };
        this.rest.getBuildingListOfProject(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.buildingList = res.response;
                if (this.buildingList.length > 0) {
                    if (type === 'construct') {
                        this.selectedBuilding = this.buildingList[0].buildingName;
                        this.getConstructionDetails(this.buildingList[0]);
                    } else if (type === 'photograph') {
                        this.selectedBuildingForPhoto = this.buildingList[0].buildingName;
                        this.selectedBuildingDtlForPhoto = this.buildingList[0];
                        this.getBuildingPhotograph();
                    }
                }
            }
        })
    }

    onBuildingChange(building: any) {
        this.getConstructionDetails(building);
    }

    onCustomDateSelect(event: any, fieldObj: any) {
        fieldObj.estimate_completion   = event;
    }

    getConstructionDetails(buildingDtl: any) {
        this.common.loaderShow();
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId(),
            projectid: this.projectId,
            quoterid: this.quoterId,
            groupid: buildingDtl.groupid,
            fieldid: buildingDtl.fieldid,
            groupposition: buildingDtl.groupposition,
            type: 'construct'
        };
        this.rest.getConstructionProgress(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                for (const obj of res.response) {
                    obj.isDisable = this.common.isDateMaxThanToday(obj.enddate, 0);
                    obj.perErr = '';
                    obj.resonErr = '';
                    obj.cmpdErr = '';
                    this.validateWorkProgress(obj);
                }
                this.constructionProgressList = res.response;
            }
        })
    }

    submitConstructionData(type: string = '') {
        let err = 0;
        for (const obj of this.constructionProgressList) {
            obj.perErr = '';
            obj.resonErr = '';
            obj.cmpdErr = '';
            if (obj.work_done !== '' && Number(obj.work_done) > 100) {
                obj.perErr = 'wrongval';
                err++;
            }
            if (!obj.isDisable && (obj.delay_reason === '' || obj.estimate_completion === '')) {
                obj.resonErr = 'wrongval';
                obj.cmpdErr = 'wrongval';
                err++;
            }
        }
        if (err > 0) {
            this.notifier.notify('error', 'Wrong input');
        } else {
            const data = {
                reraid: this.common.getReraId(),
                userid: this.common.getUserId(),
                projectid: this.projectId,
                quoterid: this.quoterId,
                progressData: this.constructionProgressList,
                type: 'construct'
            };
            this.common.loaderShow();
            this.rest.upsertConstructionProgress(data).subscribe((res: any) => {
                this.common.loaderEnd();
                if (res.success) {
                    this.notifier.notify('success', res.message);
                    if (type === 'next') {
                        this.selectedTabIndex += 1;
                    }
                } else {
                    this.notifier.notify('success', res.message);
                }
            });
        }
    }

    getFinancial_details() {
        this.common.loaderShow();
        const data = {
            userid: this.common.getUserId(),
            quoterid: this.quoterId,
            projectid: this.projectId
        };
        this.rest.getFinancial_details(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.isFinance = false;
                this.financialUpdateId = res.response.financialUpdateId;
                this.financialDetails = {
                    projectaccountno: res.response.projectaccountno,
                    estimatedcost: res.response.estimatedcost,
                    amtrecquoter: res.response.amtrecquoter,
                    actiualcost: res.response.actiualcost,
                    netamount: res.response.netamount,
                    totalexpenditure: res.response.totalexpenditure,
                    mortgagecharge: res.response.mortgagecharge
                }
            }
        }, (err: any) => {
            this.common.loaderEnd()
        });
    }

    addFinancialDetails(type:string = ''): any {
        if (this.financialDetails.projectaccountno == '') {
            this.notifier.notify('error', 'Please enter project account no');
            return false;
        } else if (this.financialDetails.estimatedcost == '') {
            this.notifier.notify('error', 'Please enter estimated cost');
            return false;
        } else if (this.financialDetails.amtrecquoter == '') {
            this.notifier.notify('error', 'Please enter amount received');
            return false;
        } else if (this.financialDetails.actiualcost == '') {
            this.notifier.notify('error', 'Please enter actual cost');
            return false;
        } else if (this.financialDetails.netamount == '') {
            this.notifier.notify('error', 'Please enter net amount');
            return false;
        } else if (this.financialDetails.totalexpenditure == '') {
            this.notifier.notify('error', 'Please enter total expenditure');
            return false;
        } else if (this.financialDetails.mortgagecharge == '') {
            this.notifier.notify('error', 'Please enter mortgage or charge');
            return false;
        }
        const data = {
            userid: this.common.getUserId(),
            quoterid: this.quoterId,
            projectid: this.projectId,
            projectaccountno: this.financialDetails.projectaccountno,
            estimatedcost: this.financialDetails.estimatedcost,
            amtrecquoter: this.financialDetails.amtrecquoter,
            actiualcost: this.financialDetails.actiualcost,
            netamount: this.financialDetails.netamount,
            totalexpenditure: this.financialDetails.totalexpenditure,
            mortgagecharge: this.financialDetails.mortgagecharge,
        };
        this.common.loaderShow();
        this.rest.addFinancial_details(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.notifier.notify('success', res.message);
                if (type === 'next') {
                    this.selectedTabIndex += 1;
                }
            }
        }, (err: any) => {
            this.common.loaderEnd()
        });
    }

    addMoreCases() {
        this.legalCase.push({caseno: '', partyname: ''});
    }

    removeItem(i: number) {
        if (this.legalCase.length > 1) {
            this.legalCase.splice(i, 1);
        }
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
                    if (type === 'Sale Deed') {
                        this.saledeed = res.response.fileName;
                    } else if (type === 'Agreement for Sale') {
                        this.saleagreement = res.response.fileName;
                    } else if (type === 'signature') {
                        this.signatureFile = res.response.fileName;
                    }
                } else {
                    this.notifier.notify('error', res.message);
                }
            })
        }
    }

    getLegalCase(): any {
        this.common.loaderShow();
        const data = {
            userid: this.common.getUserId(),
            quoterid: this.quoterId,
            projectid: this.projectId
        };
        this.rest.getLegalCase(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                if (res.response.legalResp.length > 0) {
                    this.legalCase = res.response.legalResp;
                }
                if (res.response.saleResp.length > 0) {
                    this.saledeed = res.response.saleResp[0].saledeed;
                    this.saleagreement = res.response.saleResp[0].saleagreement
                }
                if (res.response.hdrResp.length > 0) {
                    this.isSubmitted = res.response.hdrResp[0].issubmited === 1;
                    this.isAcceptDeclaration = this.isSubmitted;
                    this.signatureFile = res.response.hdrResp[0].signature;
                    this.submitPersonName = res.response.hdrResp[0].submitedpersonname
                }


            }
        }, (err: any) => {
            this.common.loaderEnd()
        });
    }

    addLegalCase(): any {
        for (let arr of this.legalCase) {
            if (arr.caseno == '') {
                this.notifier.notify('error', 'Please enter case no.');
                return false;
            } else if (arr.partyname == '') {
                this.notifier.notify('error', 'Please enter party name');
                return false;
            }
        }
        if (this.saledeed == '') {
            this.notifier.notify('error', 'Please upload sale deed');
            return false;
        } else if (this.saleagreement == '') {
            this.notifier.notify('error', 'Please upload agreement for sale');
            return false;
        } else if (this.submitPersonName == '') {
            this.notifier.notify('error', 'Please enter submit person name');
            return false;
        } else if (this.signatureFile == '') {
            this.notifier.notify('error', 'Please upload signature');
            return false;
        }
        if (!this.isAcceptDeclaration) {
            this.notifier.notify('error', 'Oops! You forgot to agree to the terms and Conditions');
            return false;
        }
        const data = {
            userid: this.common.getUserId(),
            quoterid: this.quoterId,
            projectid: this.projectId,
            legalCase: this.legalCase,
            saledeed: this.saledeed,
            saleagreement: this.saleagreement,
            signatureFile: this.signatureFile,
            submitPersonName: this.submitPersonName,
        };
        this.rest.addLegalCase(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.notifier.notify('success', res.message);
                this.router.navigate(['/pages/project-execution/'+ this.projectId + '/1/' + this.projectuid])
            }
        }, (err: any) => {
            this.common.loaderEnd()
        });
    }

    openLink(file: any) {
        window.open(this.FILE_ROOT + file, '_blank');
    }

    getAmenitiesDetails() {
        this.common.loaderShow();
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId(),
            projectid: this.projectId,
            quoterid: this.quoterId,
            groupid: '',
            fieldid: '',
            groupposition: '',
            type: 'amenity'
        };
        this.rest.getConstructionProgress(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                for (const obj of res.response) {
                    obj.isDisable = this.common.isDateMaxThanToday(obj.enddate, 0);
                    obj.perErr = '';
                    obj.resonErr = '';
                    obj.cmpdErr = '';
                    this.validateWorkProgress(obj);
                }
                this.commonAmenities = res.response;
            }
        })
    }

    submitAmenitiesData(type: string = '') {
        let err = 0;
        for (const obj of this.commonAmenities) {
            obj.perErr = '';
            obj.resonErr = '';
            obj.cmpdErr = '';
            if (obj.work_done !== '' && Number(obj.work_done) > 100) {
                obj.perErr = 'wrongval';
                err++;
            }
            if (!obj.isDisable && (obj.delay_reason === '' || obj.estimate_completion === '')) {
                obj.resonErr = 'wrongval';
                obj.cmpdErr = 'wrongval';
                err++;
            }
        }
        if (err > 0) {
            this.notifier.notify('error', 'Wrong input');
        } else {
            const data = {
                reraid: this.common.getReraId(),
                userid: this.common.getUserId(),
                projectid: this.projectId,
                quoterid: this.quoterId,
                progressData: this.commonAmenities,
                type: 'amenity'
            };
            this.common.loaderShow();
            this.rest.upsertConstructionProgress(data).subscribe((res: any) => {
                this.common.loaderEnd();
                if (res.success) {
                    this.notifier.notify('success', res.message);
                    if (type === 'next') {
                        this.selectedTabIndex += 1;
                    }
                } else {
                    this.notifier.notify('success', res.message);
                }
            });
        }
    }

    onBuildingChangeForPhoto(building: any) {
        this.selectedBuildingDtlForPhoto = building;
        this.getBuildingPhotograph();
    }

    validateWorkProgress(obj: any) {
        const month = Number(obj.enddate.split('-')[0]);
        const year = Number(obj.enddate.split('-')[1]);
        if (obj.work_done !== null && obj.work_done !== '') {
            obj.isDisable = !(this.quarterYear === year && (month >= this.quarterStartMonth && month <= this.quarterEndMonth) && Number(obj.work_done) !== 100);
        }
    }

    getPhotoParticulars(): any {
        this.rest.getPhotoParticulars().subscribe((res: any) => {
            if (res.success) {
                this.photoParticulars = res.response;
            }
        })
    }

    uploadPhotoParticulars(): any {
        if (this.particularId === '') {
            this.notifier.notify('error', 'You have not select any particular yet.');
            return false;
        }
        const element: any = document.getElementById('buildingphotograph');
        if (element && element.files.length > 0) {
            const fileSize = element.files[0].type.indexOf('pdf') > -1 ? 10485760 : 2097152;
            if (element.files[0].size > fileSize) {
                this.notifier.notify('error', 'File size limit exceeds.');
                return false;
            }
            const fd = new FormData();
            fd.append('file', element.files[0]);
            fd.append('reraid', this.common.getReraId());
            fd.append('userid', this.common.getUserId());
            fd.append('projectid', this.projectId + '');
            fd.append('groupid', this.selectedBuildingDtlForPhoto.groupid + '');
            fd.append('groupposition', this.selectedBuildingDtlForPhoto.groupposition + '');
            fd.append('particularid', this.particularId + '');
            fd.append('executionhdrid', this.quoterId + '');
            this.rest.uploadPhotoParticulars(fd).subscribe((res: any) => {
                if (res.success) {
                    this.notifier.notify('success', res.message);
                    this.getBuildingPhotograph();
                    element.value = '';
                    element.files = [];
                }
            })
        } else {
            this.notifier.notify('error', 'You have not select any photo yet.');
        }
    }

    getBuildingPhotograph(): any {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId(),
            projectid: this.projectId,
            executionhdrid: this.quoterId,
            groupid: this.selectedBuildingDtlForPhoto.groupid,
            groupposition: this.selectedBuildingDtlForPhoto.groupposition
        };
        this.common.loaderShow();
        this.rest.getBuildingPhotograph(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.buildingPhotoList = res.response;
            }
        })
    }

    removePhotograph(photoId: number, pos: number) {
        this.common.loaderShow();
        const data = {id: photoId, userid: this.common.getUserId(), reraid: this.common.getReraId()};
        this.rest.deleteBuildingPhoto(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.buildingPhotoList.splice(pos, 1);
                this.notifier.notify('success', res.message);
            }
        })
    }

    closeFullScreenView() {
        const element = <HTMLElement>document.getElementById('fullscrn');
        if (element) {
            element.classList.add('hide-elem');
            this.fullscreenImage = '';
        }
    }

    showFullScreenView() {
        const element = <HTMLElement>document.getElementById('fullscrn');
        if (element) {
            element.classList.remove('hide-elem');
        }
    }

    showImageFullScreen(imageName: string) {
        this.fullscreenImage = this.FILE_ROOT + imageName;
        this.showFullScreenView()
    }
}
