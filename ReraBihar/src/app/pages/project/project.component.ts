import {Component, OnInit, ViewChild} from '@angular/core';
import {RestApiService} from '../../services/rest-api.service';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NotifierService} from "angular-notifier";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

import * as sha512 from 'js-sha512';
import {ProjectConfService} from "../project-conf.service";
import set = Reflect.set;

declare var $: any;

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
    formDetails: any;
    stepList: any = [];
    stepListBackup: any = [];
    stepListShow: any = [];
    backupDetails: any;
    selectedTabIndex = 0;
    projectId = 0;
    entityTypeId = 1;
    isComplete = 0;
    ignoreCheckType = [7, 8, 10, 11, 13, 16];
    name = '';
    verificationsFields: any = [];
    totalLandArea = 0;
    projectCategory = '';
    totalAmount = 1;
    @ViewChild('confirmSubmitModal') confirmSubmitModal: any;
    isSubmitted = false;
    flexRadioDefault: any = 'panjab';
    projectuid: any = '';
    stateName: any = '';
    stateList: any = [];
    cityName: any = [];
    userId = this.common.getUserId();
    projectStatus = '';
    phaseStatus: any;
    stepDesc: any;
    isDataBlank: boolean = false;
    isPaymentComplete = false;
    totalPastProject = 0;
    ownerList: any = [];
    isAccept = false;
    signatureImg = 'assets/images/net-bank.png';
    numberOfSectionBuilding = '';
    selectedPlot: any = {};
    FILE_ROOT = '';
    fullscreenImage = '';
    paymentAmount = 0;
    financialYearList: any = [];
    fileUploadToolTip = 'Maximum file size of a PDF is 5MB and for image 2MB';
    isPreventRegistration = false;
    enableFieldIdsInPastProject: number[] = [905, 906, 834, 925, 909, 910, 911];
    pastProjectIdList: any = [];
    categoryWiseBuildingType: any = [{
        category: 'Residential Apartment (G+3)',
        buildingType: 'Residential'
    }, {
        category: 'Residential Apartment (4 - 8 Floors)',
        buildingType: 'Residential'
    }, {
        category: 'Residential Multistoried Apartment (8+ Floors)',
        buildingType: 'Residential'
    }, {
        category: 'Group Housing Project',
        buildingType: 'Residential'
    }, {
        category: 'Mixed Development Project',
        buildingType: 'Mixed'
    }, {
        category: 'Commercial Project',
        buildingType: 'Commercial'
    }, {
        category: 'Plotted Development Project',
        buildingType: ''
    }]
    constructor(private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
                private modalService: NgbModal, private notifier: NotifierService, private router: Router,
                private projectConf: ProjectConfService) {
        this.FILE_ROOT = this.rest.FILE_ROOT;
    }

    ngOnInit(): void {
        this.name = this.common.getUserName();
        this.projectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
        this.isComplete = Number(this.activeRoute.snapshot.paramMap.get('isComplete'));
        this.projectuid = this.activeRoute.snapshot.paramMap.get('projectuid');

        if (this.isComplete === 1) {
            this.isSubmitted = true;
        } else {
            this.isSubmitted = false;
        }
        this.common.loaderShow();
        if (this.projectId === 0) {
            this.createProject();
        } else {
            this.getFormInfo();
            this.paymentStatus();
        }
        this.getState()
    }

    paymentStatus(): void {
        this.rest.isPaymentComplete({projectid: this.projectId, userid: this.common.getUserId()}).subscribe((res: any) => {
            this.isPaymentComplete = res.success
        })
    }

    goToProfile() {
        this.router.navigate(['/pages/profile-details'])
    }

    logout() {
        sessionStorage.clear();
        this.router.navigate(['/']);
    }

    getState() {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId()
        }
        this.rest.getState(data).subscribe((res: any) => {
            if (res.success) {
                this.stateList = res.response;
                const stateArr = [];
                for (let i = 0; i < res.response.length; i++) {
                    stateArr.push(res.response[i].statename);
                }
                this.stateName = stateArr.join('|');
            }
        });

    }

    getDistricts(data: any, dtl: any, flag: string, groupPosition: number = -1) {
        const dist = {
            stateid: data,
            userid: this.common.getUserId()
        };
        this.rest.getDistricts(dist).subscribe((res: any) => {
            if (res.success) {
                this.cityName = []
                for (let i = 0; i < res.response.length; i++) {
                    this.cityName.push(res.response[i].cityname, '|');
                }
                this.cityName.splice(-1)
                this.cityName.unshift('Select City|');
                if (flag === 'group') {
                    if (Array.isArray(dtl.fielddetails)) {
                        const field = dtl.fielddetails[groupPosition];
                        for (let i = 0; i < dtl.fielddetailskeys[groupPosition].length; i++) {
                            const key = dtl.fielddetailskeys[groupPosition][i];
                            if (key === 'District' || key.indexOf('District') > -1) {
                                field[key][0].controlvalue = this.cityName.join('');
                                // console.log(">>>>>>>>>>>>>>>>>> ", this.cityName.join(''))
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.formDetails[dtl].length; i++) {
                        if (this.formDetails[dtl][i].fielddetails.fielddesc === 'District') {
                            this.formDetails[dtl][i].fielddetails.controlvalue = this.cityName.join('')
                        }

                    }
                }

            }
        });
    }

    validationValue(event: any, obj: any, group = 0): any {
        // console.log('keycode >>> ', event.keyCode)
        const fielddesc = group === 0 ? obj.fielddetails.fielddesc : obj.fielddesc;
        const fieldvalue = group === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        const fieldtype = group === 0 ? obj.fielddetails.fieldtype : obj.fieldtype;
        if (fielddesc === 'Pin_Code' || fielddesc.indexOf('Pin_Code') > -1) {
            if (fieldvalue === '' && event.key != 8) {
                return false;
            }
            if ((((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && fieldvalue.length < 6) || event.keyCode == 8) {
                return true;
            } else {
                return false;
            }
        } else if (fielddesc === 'No_of_phases_new' || fielddesc === 'Registration_Sought_for_the_Period_Years' || fielddesc === 'Registration_applied_for_which_phase') {
            if ((((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && fieldvalue.length < 1) || event.keyCode == 8) {
                return true;
            } else {
                return false;
            }
        } else if (fielddesc === 'No_Of_Project_Completed' || fielddesc === 'Geographic_Location' || fielddesc === 'Geographic_Other_Location' || fielddesc === 'No_of_month_Delayed_') {
            if (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) || event.keyCode == 8 || event.keyCode == 190 || event.keyCode == 110) {
                return true;
            } else {
                return false;
            }
        } else if (fieldtype === 2 || fieldtype === 3) {
            if (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) || event.keyCode == 8 || event.keyCode == 190 || event.keyCode == 110) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    getSystemVerificationFields(): void {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId()
        };
        this.rest.getSystemVerificationFields(data).subscribe((res: any) => {
            if (res.success) {
                this.verificationsFields = res.response;
            }
        });
    }

    createProject(): void {
        const data = {
            reraid: this.common.getReraId(),
            entityid: this.common.getEntityId(),
            entitytypeid: this.common.getEntityTypeId(),
            userid: this.common.getUserId()
        };
        this.rest.createProject(data).subscribe((res: any) => {
            if (res.success) {
                this.projectId = res.response.projectid;
                this.projectuid = res.response.projectuid;
                this.getFormInfo();
                this.paymentStatus();
            }
        });
    }

    async getCashListByProject(projectRegNo: string, obj: any, key: string) {
        return new Promise((resolve, reject) => {
            try{
                this.rest.getCaseByProject({projectRegNo: projectRegNo}).subscribe((res: any) => {
                    if (res.success) {
                        if (obj[key]) {
                            obj[key][0].fieldvalue = res.details.totalCaseFiles;
                            /*obj['RERA Filed Cases'][0].fielddetails[0]['No_of_Open_Cases'][0].fieldvalue = res.details.Open_Case;
                            obj['RERA Filed Cases'][0].fielddetails[0]['No_of_Disposed_Case'][0].fieldvalue = res.details.Disposed_Cases;
                            obj['RERA Filed Cases'][0].fielddetails[0]['No_of_Cases_Under_Execution'][0].fieldvalue = res.details.Cases_Under_Execution;*/
                        }

                    }
                    resolve(obj);
                }, (err: any) => {
                    console.log(err);
                    resolve(obj);
                });
            } catch (e) {
                resolve(obj);
            }
        })
    }

    getPastProjectOutsideCaseDtl(projectid: any, obj: any) {
        return new Promise((resolve, reject) => {
            try{
                // projectRegNo = '4gpw5rzl4qpoda6';
                const finalDetailsArr: any = [];
                const finalKeyArr: any = [];
                this.rest.getPastProjectOutsideCaseDtl({projectid: projectid, userid: this.common.getUserId()}).subscribe((res: any) => {
                    if (res.success && res.response) {
                        // console.log(JSON.stringify(res.response))
                        for (const pos of Object.keys(res.response)) {
                            const fieldDetails = JSON.parse(JSON.stringify(obj['Is there any Cases?'][0].fielddetails[0]));
                            const fieldKeys = JSON.parse(JSON.stringify(obj['Is there any Cases?'][0].fielddetailskeys[0]));
                            finalKeyArr.push(fieldKeys);
                            for (const d of res.response[pos]) {
                                if(fieldDetails[d.fielddesc]) {
                                    // console.log(fieldDetails[d.fielddesc])
                                    fieldDetails[d.fielddesc][0].fieldvalue = d.fieldvalue;
                                }
                            }
                            finalDetailsArr.push(fieldDetails);
                        }
                        obj['Is there any Cases?'][0].fielddetails = finalDetailsArr;
                        obj['Is there any Cases?'][0].fielddetailskeys = finalKeyArr;
                        // console.log(JSON.stringify(obj['Is there any Cases?']))
                    }
                    resolve(obj);
                }, (err: any) => {
                    console.log(err);
                    resolve(obj);
                });
            } catch (e) {
                resolve(obj);
            }
        })
    }

    adjustStepList(projectCat: string) {
        this.stepListShow = JSON.parse(JSON.stringify(this.stepListBackup));
        if (projectCat === 'Plotted Development Project') {
            if (this.stepListShow.indexOf('Building Details') > -1) {
                this.stepListShow.splice(this.stepListShow.indexOf('Building Details'), 1);
            }
        } else {
            if (this.stepListShow.indexOf('Plot Details') > -1) {
                this.stepListShow.splice(this.stepListShow.indexOf('Plot Details'), 1);
            }
        }
    }

    getPastProjects(step: any){
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId(),
            projectid: this.projectId
        };
        this.rest.getPastProjects(data).subscribe(async (res: any) => {
            if (res.success) {
                this.isDataBlank = false;
                if(this.backupDetails[step].length > 0){
                    for(let t=0;t<this.backupDetails[step].length;t++){
                        if(this.backupDetails[step][t].groupid === 21){
                            if(res.response.pastproject_values !== undefined){
                                this.isDataBlank = false;
                                this.totalPastProject = res.response.pastproject_values.length;
                                if(res.response.pastproject_values.length > 0){
                                    this.pastProjectIdList = [];
                                    const storeFieldDetailsKeys = JSON.parse(JSON.stringify(this.backupDetails[step][t].fielddetailskeys[0]));
                                    let defaultFieldKeysArray = [];
                                    const storeFieldDetails = JSON.parse(JSON.stringify(this.backupDetails[step][t].fielddetails[0]));
                                    let defaultFieldDetails = JSON.parse(JSON.stringify(storeFieldDetails));
                                    let defaultFieldDetailsArray = [];
                                    let defaultLandDetailsValues = JSON.parse(JSON.stringify(storeFieldDetails["Land Details"][0].fielddetails[0]));
                                    let defaultLandDetailsValuesArray = JSON.parse(JSON.stringify(defaultLandDetailsValues));
                                    if(res.response.pastproject_values.length > 0){
                                        this.backupDetails[step][t].fielddetailskeys = [];
                                        this.backupDetails[step][t].fielddetails = [];
                                        const field_values = res.response.pastproject_values;
                                        const field_keys = res.response.pastproject_keys;
                                        for(let i=0;i<field_values.length;i++){
                                            defaultFieldKeysArray.push(storeFieldDetailsKeys);
                                            for(let j=0;j<field_keys.length;j++) {
                                                if(field_keys[j] == "Land Details"){
                                                    const landdetails_values = JSON.parse(JSON.stringify(field_values[i]["Land Details"]));
                                                    const landdetails_keys = defaultFieldDetails["Land Details"][0].fielddetailskeys[0];
                                                    const landdetailsKeys = [];
                                                    const defaultLandDetailsArray = [];
                                                    if(landdetails_values.length > 0){
                                                        for(let p=0;p<landdetails_values.length;p++){
                                                            landdetailsKeys.push(landdetails_keys);
                                                            for(let q=0;q<landdetails_keys.length;q++){
                                                                if(defaultLandDetailsValuesArray[landdetails_keys[q]] !== undefined){
                                                                    if (landdetails_values[p][landdetails_keys[q].trim()]) {
                                                                            defaultLandDetailsValuesArray[landdetails_keys[q]][0].fieldvalue = landdetails_values[p][landdetails_keys[q].trim()]
                                                                    }
                                                                }
                                                            }
                                                            defaultLandDetailsArray.push(JSON.parse(JSON.stringify(defaultLandDetailsValuesArray)));
                                                        }
                                                        defaultFieldDetails["Land Details"][0].fielddetailskeys = landdetailsKeys;
                                                        defaultFieldDetails["Land Details"][0].fielddetails = defaultLandDetailsArray;
                                                        defaultLandDetailsValuesArray = JSON.parse(JSON.stringify(defaultLandDetailsValues));
                                                    }
                                                } else {
                                                    if(field_keys[j] === 'Project_Status' && field_values[i]['Project_Status'] == 'Completed') {
                                                        defaultFieldDetails['Planned_Completion_Date'][0].fielddisplaydesc = 'Project Completion Date'
                                                    }
                                                    if(defaultFieldDetails[field_keys[j]] !== undefined) {
                                                        defaultFieldDetails[field_keys[j]][0].fieldvalue = field_values[i][field_keys[j]];
                                                    }
                                                }
                                            }
                                            if (defaultFieldDetails['Number_of_Cases_pending_against_the_project_with_RERA_Bihar_']) {
                                                defaultFieldDetails = await this.getCashListByProject(field_values[i].projectRegNo, defaultFieldDetails, 'Number_of_Cases_pending_against_the_project_with_RERA_Bihar_');
                                            }
                                            if (defaultFieldDetails['Is there any Cases?']) {
                                                defaultFieldDetails['Is there any Cases?'][0].projectid = field_values[i]['projectid']
                                                defaultFieldDetails = await this.getPastProjectOutsideCaseDtl(field_values[i].projectid, defaultFieldDetails);
                                            }
                                            defaultFieldDetailsArray.push(JSON.parse(JSON.stringify(defaultFieldDetails)));
                                            defaultFieldDetails = JSON.parse(JSON.stringify(storeFieldDetails));
                                            this.pastProjectIdList.push(field_values[i]['projectid']);
                                        }
                                        this.backupDetails[step][t].fielddetailskeys = defaultFieldKeysArray;
                                        this.backupDetails[step][t].fielddetails = defaultFieldDetailsArray;
                                    }
                                }
                            } else {
                                this.isDataBlank = true;
                                this.backupDetails[step][t].fielddetailskeys = [];
                                this.backupDetails[step][t].fielddetails = [];
                            }
                            this.formDetails[step][t] = JSON.parse(JSON.stringify(this.backupDetails[step][t]));
                            // console.log(JSON.stringify(this.formDetails[step][t]));
                            this.rearrangeForm(step, this.formDetails[step][t]);
                        }
                    }
                }
            }
        });
    }

    rearrangeForm(step: string, obj: any) {
        for (const [index, field] of obj.fielddetails.entries()) {
            for (let i = 0; i < obj.fielddetailskeys[index].length; i++) {
                const key = obj.fielddetailskeys[index][i];
                field[key][0].groupView = field[key][0].groupView ? field[key][0].groupView : 'form';
                if (field[key][0].groupView === 'table') {
                    try{
                        const fieldDetailsArr: any = [];
                        for (const k of field[key][0].fielddetailskeys[0]) {
                            fieldDetailsArr.push(field[key][0].fielddetails[0][k][0])
                        }
                        // console.log(fieldDetailsArr)
                        const groupData = this.common.groupBy(fieldDetailsArr, 'rowname');
                        const keyData = Object.keys(groupData);
                        field[key][0].fielddetails = {
                            keys: keyData,
                            details: groupData
                        }
                    } catch (e) {
                    }
                }
                if (field[key][0].fieldgroupid !== null && field[key][0].groupView === 'form') {
                    for (const [index1, field1] of field[key][0].fielddetails.entries()) {
                        for (let j = 0; j < field[key][0].fielddetailskeys[index1].length; j++) {
                            const key1 = field[key][0].fielddetailskeys[index1][j];
                            if (field1[key1]) {
                                field1[key1][0].groupView = field1[key1][0].groupView ? field1[key1][0].groupView : 'form';
                                if (field1[key1][0].groupView === 'table') {
                                    const fieldDetailsArr: any = [];
                                    for (const k of field1[key1][0].fielddetailskeys[0]) {
                                        fieldDetailsArr.push(field1[key1][0].fielddetails[0][k][0])
                                    }
                                    // console.log(fieldDetailsArr)
                                    const groupData = this.common.groupBy(fieldDetailsArr, 'rowname');
                                    const keyData = Object.keys(groupData);
                                    field1[key1][0].fielddetails = {
                                        keys: keyData,
                                        details: groupData
                                    }
                                }
                                if (field1[key1][0].parentfieldid !== null) {
                                    const isMatch = this.checkParentFieldValue(field1, field[key][0].fielddetailskeys[index1], field1[key1][0].parentfieldid, field1[key1][0].parentfieldvalue);
                                    if (!isMatch) {
                                        field[key][0].fielddetailskeys[index1].splice(j, 1);
                                        delete field1[key1];
                                        j--;
                                    }
                                }
                            }
                        }
                    }
                }
                if (field[key][0].parentfieldid !== null) {
                    const isMatch = this.checkParentFieldValue(field, obj.fielddetailskeys[index], field[key][0].parentfieldid, field[key][0].parentfieldvalue);
                    if (!isMatch) {
                        obj.fielddetailskeys[index].splice(i, 1);
                        delete field[key];
                        i--;
                    }
                }
            }
        }

        this.common.formDetails = this.formDetails
    }

    getFormInfo() {
        const data = {
            reraid: this.common.getReraId(),
            entityid: this.common.getEntityId(),
            entitytypeid: this.common.getEntityTypeId(),
            projectid: this.projectId,
            iscomplete: this.isComplete,
            userid: this.common.getUserId()
        };
        this.rest.getFormInfo(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                if (res.sign && res.sign !== '') {
                    this.signatureImg = this.rest.FILE_ROOT + res.sign;
                }
                if (res.amt) {
                    this.paymentAmount = res.amt;
                }
                this.stepList = Object.keys(res.response);
                this.stepListShow = Object.keys(res.response);
                this.stepListBackup = Object.keys(res.response);
                this.stepListShow.push('Payment');
                this.stepListBackup.push('Payment');
                let stepsDetails = this.stepListShow
                for (const step of this.stepList) {
                    res.response[step].sort(function (a: any, b: any) {
                        return a.sequenceno - b.sequenceno
                    });
                    const details = res.response[step];
                    if (details.length > 0 && details[0].istableview == '1') {
                        for (const d of details) {
                            if (d.groupid !== null) {
                                const groupData = this.common.groupBy(d.fielddetails, 'rowname');
                                const keyData = Object.keys(groupData);
                                d.fielddetails = {
                                    keys: keyData,
                                    details: groupData
                                }
                            }
                        }
                        res.response[step] = details;
                    }
                }
                this.formDetails = JSON.parse(JSON.stringify(res.response));
                this.common.stepListShow = stepsDetails
                // this.common.setstepListShow(stepsDetails)
                let newObj: any = {};
                for (const step of this.stepList) {
                    if (Array.isArray(this.formDetails[step])) {
                        newObj[step] = this.formDetails[step].filter((item: any) => !(item.parentfieldid == null));
                        this.formDetails[step] = this.formDetails[step].filter((item: any) => !(item.parentfieldid !== null));
                        for (const obj of this.formDetails[step]) {
                            if (obj.groupid !== null) {
                                if (Array.isArray(obj.fielddetails)) {
                                    obj.groupView = obj.groupView ? obj.groupView : 'form';
                                    if (obj.groupView === 'table') {
                                        const groupData = this.common.groupBy(obj.fielddetails, 'rowname');
                                        const keyData = Object.keys(groupData);
                                        obj.fielddetails = {
                                            keys: keyData,
                                            details: groupData
                                        }
                                    } else {
                                        for (const [index, field] of obj.fielddetails.entries()) {
                                            for (let i = 0; i < obj.fielddetailskeys[index].length; i++) {
                                                const key = obj.fielddetailskeys[index][i];
                                                field[key][0].groupView = field[key][0].groupView ? field[key][0].groupView : 'form';

                                                if (field[key][0].groupView === 'table') {
                                                    const fieldDetailsArr: any = [];
                                                    for (const k of field[key][0].fielddetailskeys[0]) {
                                                        fieldDetailsArr.push(field[key][0].fielddetails[0][k][0])
                                                    }
                                                    const groupData = this.common.groupBy(fieldDetailsArr, 'rowname');
                                                    const keyData = Object.keys(groupData);
                                                    field[key][0].fielddetails = {
                                                        keys: keyData,
                                                        details: groupData
                                                    }
                                                }
                                                if (field[key][0].fieldgroupid !== null && field[key][0].groupView === 'form') {
                                                    for (const [index1, field1] of field[key][0].fielddetails.entries()) {
                                                        for (let j = 0; j < field[key][0].fielddetailskeys[index1].length; j++) {
                                                            const key1 = field[key][0].fielddetailskeys[index1][j];
                                                            if (field1[key1]) {
                                                                field1[key1][0].groupView = field1[key1][0].groupView ? field1[key1][0].groupView : 'form';
                                                                if (field1[key1][0].groupView === 'table') {
                                                                    const fieldDetailsArr: any = [];
                                                                    for (const k of field1[key1][0].fielddetailskeys[0]) {
                                                                        fieldDetailsArr.push(field1[key1][0].fielddetails[0][k][0])
                                                                    }
                                                                    // console.log(fieldDetailsArr)
                                                                    const groupData = this.common.groupBy(fieldDetailsArr, 'rowname');
                                                                    const keyData = Object.keys(groupData);
                                                                    field1[key1][0].fielddetails = {
                                                                        keys: keyData,
                                                                        details: groupData
                                                                    }
                                                                }
                                                                if (field1[key1][0].parentfieldid !== null) {
                                                                    const isMatch = this.checkParentFieldValue(field1, field[key][0].fielddetailskeys[index1], field1[key1][0].parentfieldid, field1[key1][0].parentfieldvalue);
                                                                    if (!isMatch) {
                                                                        field[key][0].fielddetailskeys[index1].splice(j, 1);
                                                                        delete field1[key1];
                                                                        j--;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (step === 'Past Projects' && obj.groupid === 36 && field[key][0].fielddesc === 'State') {
                                                    field[key][0].controlvalue = this.stateName;
                                                    for (let i = 0; i < this.stateList.length; i++) {
                                                        if (this.stateList[i].statename === field[key][0].fieldvalue) {
                                                            this.getDistricts(this.stateList[i].id, field['District'][0], 'group', index);
                                                            break;
                                                        }

                                                    }
                                                }
                                                if (field[key][0].parentfieldid !== null) {
                                                    const isMatch = this.checkParentFieldValue(field, obj.fielddetailskeys[index], field[key][0].parentfieldid, field[key][0].parentfieldvalue);
                                                    if (!isMatch) {
                                                        obj.fielddetailskeys[index].splice(i, 1);
                                                        delete field[key];
                                                        i--;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (obj.fielddetails.fielddesc === 'Total_Land_Area' || obj.fielddetails.fielddesc === 'Total_area_of_the_Project') {
                                    this.totalLandArea = obj.fielddetails.fieldvalue === '' ? 0 : Number(obj.fielddetails.fieldvalue);
                                } else if (obj.fielddetails.fielddesc === 'Project_Category') {
                                    this.projectCategory = obj.fielddetails.fieldvalue;
                                    this.adjustStepList(this.projectCategory);
                                }
                                if (obj.fielddetails.fielddesc === 'District') {
                                    obj.fielddetails.controlvalue = '';
                                    // distField = obj
                                } else if (obj.fielddetails.fielddesc === 'State_Project_Info') {
                                    obj.fielddetails.fieldvalue = 'Bihar';
                                    // distField = obj
                                } else if (obj.fielddetails.fielddesc === 'Project_being_registered') {
                                    this.projectStatus = obj.fielddetails.fieldvalue;
                                    this.stepDesc = obj.stepdesc;
                                } else if (obj.fielddetails.fielddesc === 'If_the_project_delayed') {
                                    obj.fielddetails.fieldvalue = obj.fielddetails.fieldvalue != '' && obj.fielddetails.fieldvalue != null ? obj.fielddetails.fieldvalue : 'No';
                                }
                                //  else if (obj.fielddetails.fielddesc === 'Project_Completion_Date') {
                                //     this.checkDelayedStatus(obj.fielddetails.fieldvalue)
                                // } 
                                else if(obj.fielddetails.fielddesc ==='Phase_Wise'){
                                    this.phaseStatus = obj.fielddetails.fieldvalue;
                                    this.stepDesc = obj.stepdesc;
                                }
                                // else if (obj.fielddetails.fielddesc === 'Registration_applied_for_which_phase'){
                                //     this.checkAreaPhase(obj.fielddetails.fieldvalue)
                                // }
                            }
                        }
                    } else {

                    }
                }
                this.backupDetails = JSON.parse(JSON.stringify(res.response));
                try {
                    for (const step of this.stepList) {
                        if (newObj[step]) {
                            for (const obj of newObj[step]) {
                                for (const step1 of this.stepList) {
                                    for (const item of this.formDetails[step1]) {
                                        if (obj.parentfieldid === item.fielddetails.fieldid && this.common.checkParentFieldValue(obj.parentfieldvalue, item.fielddetails.fieldvalue, 1)) {
                                            // console.log(JSON.stringify(obj))
                                            if (obj.groupid !== null) {
                                                for (const [index, field] of obj.fielddetails.entries()) {
                                                    for (let i = 0; i < obj.fielddetailskeys[index].length; i++) {
                                                        const key = obj.fielddetailskeys[index][i];
                                                        if (field[key][0].parentfieldid !== null) {
                                                            const isMatch = this.checkParentFieldValue1(field, obj.fielddetailskeys[index], field[key][0].parentfieldid, field[key][0].parentfieldvalue);
                                                            if (!isMatch) {
                                                                obj.fielddetailskeys[index].splice(i, 1);
                                                                delete field[key];
                                                                i--;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            this.formDetails[step].push(JSON.parse(JSON.stringify(obj)));
                                            break;
                                        }
                                    }
                                }
                            }
                            this.formDetails[step].sort(function (a: any, b: any) {
                                return a.sequenceno - b.sequenceno
                            });
                        }
                    }
                } catch (e) {
                }
                this.getPastProjects('Past Projects');
            }
        }, (err: any) => {
        })
       
        
    }

    checkParentFieldValue(field: any, keys: any, parentFieldId: number, parentValue: any): any {
        let flag = 0;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (field[key]) {
                // console.log(parentValue, field[key][0].fieldvalue)
                if (field[key][0].fieldid === parentFieldId && this.common.checkParentFieldValue(parentValue, field[key][0].fieldvalue, 1)) {
                    flag = 1;
                    return true;
                }
            }
        }
        if (flag === 0) {
            return false;
        }
    }

    checkParentFieldValue1(field: any, keys: any, parentFieldId: number, parentValue: any): any {
        let flag = 0;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (field[key][0].fieldid === parentFieldId) {
                if (this.common.checkParentFieldValue(parentValue, field[key][0].fieldvalue, 1)) {
                    flag = 1;
                    break
                } else {
                    flag = 0;
                    break
                }
            } else {
                flag = 1;
            }
        }
        return flag !== 0;
    }

    addMoreBtn(obj: any, grouppos: any, stepId: any, groupId: any, pos: number = -1, fielddesc: string = '', step: string = ''): any {
        if (fielddesc === 'Add_any_other_common_amenities_button') {
            const element: any = <HTMLButtonElement>document.getElementById(fielddesc);
            if (element) {
                if (element.dataset['type'] === 'A') {
                    this.toggleElement('div_Add_any_other_common_amenities_0', 1);
                    element.dataset.type = 'R';
                    return true;
                }
            }

        }
        if (stepId === 16 && groupId === 13) {
            const buildingNoCountElem = <HTMLInputElement>document.getElementById('Enter_sanctioned_number_of_buildings');
            if (buildingNoCountElem && buildingNoCountElem.value !== '') {
                if (obj.fielddetails.length === Number(buildingNoCountElem.value)) {
                    this.notifier.notify('error', 'You can not add building more than the number of building you mentioned.');
                    return false;
                }
            }
        } else if (groupId === 36) {
            const otherPrjCountElem: any = <HTMLInputElement>document.getElementById('Number_of_Other_Projects_Launched_in_Past_Years');
            if (otherPrjCountElem && otherPrjCountElem.value !== '') {
                if (obj.fielddetails.length === Number(otherPrjCountElem.value)) {
                    this.notifier.notify('error', 'You can not add projects more than the number of projects you mentioned.');
                    return false;
                }
            }
        }
        const data = JSON.parse(JSON.stringify(obj.fielddetails[0]));
        let position;
        pos !== -1 ? position = pos : position = grouppos;
        let onRadioFlag = 0;
        let onRadioObj: any;
        for (const key of obj.fielddetailskeys[0]) {
            for (const [index, d] of data[key].entries()) {
                if (d.fieldgroupid == null) {
                    if (d.fieldid === 532) {
                        d.fieldvalue = this.getCategoryWiseBuildingType();
                        d.tempid = null;
                        this.saveCalculatedElem(d.fieldid, obj.groupid, 1, d.fieldvalue, d.fielddesc, obj.fielddetails.length, obj.stepid, 'group');
                        onRadioFlag = 1;
                        onRadioObj = d;
                    } else {
                        d.fieldvalue = '';
                        d.tempid = null;
                    }
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
        if (onRadioFlag === 1) {
            this.onRadioButtonChange(obj, step, onRadioObj, 'group', obj.fielddetails.length - 1);
        }
        this.addFieldDetails(obj, stepId, groupId, grouppos, step);

    }

    addFieldDetails(obj: any, stepId: any, groupId: any, grouppos: any, step: string) {
        const data = {
            reraid: this.common.getReraId(),
            obj: obj,
            stepid: stepId,
            groupid: groupId,
            groupposition: grouppos + '',
            projectid: this.projectId,
            userid: this.common.getUserId()
        };
        this.common.loaderShow();
        this.rest.addAllFieldDetails(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                // console.log("\n RESPONSE ------------    ", res);
                // this.notifier.notify('success', res.message);
                this.rearrangeForm(step, obj);
                if(stepId === 6) {
                    this.disableCalculatedFieldInLandDetails('Land Details');
                } else if (stepId === 16) {
                    this.projectConf.disableCalculationFieldList(this.projectConf.buildingDetailsDisableFieldList);
                }
                if (groupId === 13) {
                    const elem: any = <HTMLElement>document.getElementById('Type_of_Building_' + (obj.fielddetails.length - 1));
                    if (elem) {
                        elem.disabled = true;
                    }
                }
            } else {
                this.notifier.notify('error', res.message);
            }
        });
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
            if (obj.groupid === 48 || fieldGroup.fieldgroupid === 47) {
                this.calculateTotalTotalShare()
            }
        }, (err: any) => {
        });
        // obj.fielddetails.splice(pos, 1);
    }

    removeParentFieldNotMatch(step: string, parentItem: any = {}, groupPosition: number, flag: number = 0): void {
        for (const obj of this.formDetails[step]) {
            if (obj.groupid !== null) {
                for (const [index, field] of obj.fielddetails.entries()) {
                    if (index === groupPosition) {
                        for (let i = 0; i < obj.fielddetailskeys[index].length; i++) {
                            const key = obj.fielddetailskeys[index][i];
                            if (flag === 1) {
                                if (field[key][0].parentfieldid !== null && field[key][0].parentfieldid === parentItem.fieldid) {
                                    this.removeParentFieldNotMatch(step, field[key][0], index, 1);
                                    obj.fielddetailskeys[index].splice(i, 1);
                                    delete field[key];
                                    i--;
                                }
                            } else {
                                if (field[key][0].parentfieldid !== null && field[key][0].parentfieldid === parentItem.fieldid
                                    && this.common.checkParentFieldValue(field[key][0].parentfieldvalue, parentItem.fieldvalue, 0)) {
                                    this.removeParentFieldNotMatch(step, field[key][0], index, 1);
                                    obj.fielddetailskeys[index].splice(i, 1);
                                    delete field[key];
                                    i--;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    removeParentFieldNotMatchInFieldGroup(step: string, parentItem: any = {}, groupPosition: number, fieldGroupPosition: number, key1: string, flag: number = 0): void {
        for (const obj of this.formDetails[step]) {
            if (obj.groupid !== null) {
                for (const [index, field] of obj.fielddetails.entries()) {
                    if (index === groupPosition) {
                        for (let i = 0; i < obj.fielddetailskeys[index].length; i++) {
                            const key = obj.fielddetailskeys[index][i];
                            if (key === key1) {
                                for (const [index1, field1] of field[key][0].fielddetails.entries()) {
                                    if (index1 === fieldGroupPosition) {
                                        for (let j = 0; j < field[key][0].fielddetailskeys[index1].length; j++) {
                                            const key2 = field[key][0].fielddetailskeys[index1][j];
                                            if (flag === 1) {
                                                if (field1[key2][0].parentfieldid !== null && field1[key2][0].parentfieldid === parentItem.fieldid) {
                                                    this.removeParentFieldNotMatchInFieldGroup(step, field1[key2][0], groupPosition, fieldGroupPosition, key1, 1);
                                                    field[key][0].fielddetailskeys[index1].splice(j, 1);
                                                    delete field1[key2];
                                                    j--;
                                                }
                                            } else {
                                                if (field1[key2][0].parentfieldid !== null && field1[key2][0].parentfieldid === parentItem.fieldid
                                                    && this.common.checkParentFieldValue(field1[key2][0].parentfieldvalue, parentItem.fieldvalue, 0)) {
                                                    this.removeParentFieldNotMatchInFieldGroup(step, field1[key2][0], groupPosition, fieldGroupPosition, key1, 1);
                                                    field[key][0].fielddetailskeys[index1].splice(j, 1);
                                                    delete field1[key2];
                                                    j--;
                                                }
                                            }
                                        }
                                        // break;
                                    }
                                }
                            }
                        }
                        // break;
                    }
                }
            }
        }
    }

    onRadioButtonChangeInFieldGroup(obj: any, step: string, parentItem: any = {}, groupPosition: number = 0, fieldGroupPosition: number = 0, groupkey: string): any {
        this.removeParentFieldNotMatchInFieldGroup(step, parentItem, groupPosition, fieldGroupPosition, groupkey);
        for (const [i, d] of this.backupDetails[step].entries()) {
            if (d.groupid !== null) {
                let flag = 0;
                for (const [index, field] of d.fielddetails.entries()) {
                    if (index === 0) {
                        for (let j = 0; j < d.fielddetailskeys[index].length; j++) {
                            const key = d.fielddetailskeys[index][j];
                            // console.log(field[key][0]);
                            if (key === groupkey) {
                                for (const [index1, field1] of field[key][0].fielddetails.entries()) {
                                    if (index1 === 0) {
                                        for (let j = 0; j < field[key][0].fielddetailskeys[index1].length; j++) {
                                            const key2 = field[key][0].fielddetailskeys[index1][j];
                                            if (field1[key2][0].parentfieldid !== null && field1[key2][0].parentfieldid === parentItem.fieldid
                                                && this.common.checkParentFieldValue(field1[key2][0].parentfieldvalue, parentItem.fieldvalue, 1)) {
                                                flag = 1;
                                                if (field1[key2][0].groupView === 'table') {
                                                    if (field1[key2][0].fielddetails.details === undefined) {
                                                        const fieldDetailsArr: any = [];
                                                        for (const k of field1[key2][0].fielddetailskeys[0]) {
                                                            fieldDetailsArr.push(field1[key2][0].fielddetails[0][k][0])
                                                        }
                                                        // console.log(fieldDetailsArr)
                                                        const groupData = this.common.groupBy(fieldDetailsArr, 'rowname');
                                                        const keyData = Object.keys(groupData);
                                                        field1[key2][0].fielddetails = {
                                                            keys: keyData,
                                                            details: groupData
                                                        }
                                                    }
                                                }
                                                obj.fielddetails[groupPosition][key][0].fielddetails[fieldGroupPosition][key2] = JSON.parse(JSON.stringify(field1[key2]));
                                                if (field1[key2][0] && field1[key2][0].groupView !== 'table') {
                                                    this.onRadioButtonChangeInFieldGroup(obj, step, field1[key2][0], groupPosition, fieldGroupPosition, groupkey);
                                                }
                                                if (!obj.fielddetails[groupPosition][key][0].fielddetailskeys[fieldGroupPosition].includes(key2)) {
                                                    obj.fielddetails[groupPosition][key][0].fielddetailskeys[fieldGroupPosition].push(key2);
                                                }
                                            }

                                        }
                                        obj.fielddetails[groupPosition][key][0].fielddetailskeys[fieldGroupPosition] = this.common.sortKeyAsFirst(d.fielddetails[index][key][0].fielddetailskeys[0], obj.fielddetails[groupPosition][key][0].fielddetailskeys[fieldGroupPosition]);
                                        // break;
                                    }
                                }
                            }
                        }
                    }
                    if (d.groupid === obj.groupid) {
                        obj.fielddetailskeys[groupPosition] = this.common.sortKeyAsFirst(d.fielddetailskeys[index], obj.fielddetailskeys[groupPosition]);
                    }
                }
            }
        }
        if (parentItem.fielddesc === 'Mixed') {
            setTimeout(() => {
                this.projectConf.disableCalculationFieldList(this.projectConf.buildingDetailsDisableFieldList);
            }, 100);
        }
    }

    onRadioButtonChange(obj: any, step: string, parentItem: any = {}, flag = 'single', groupPosition = 0): void {
        // console.log(step, parentItem, obj);
        if (flag === 'group') {
            this.removeParentFieldNotMatch(step, parentItem, groupPosition);
            for (const [i, d] of this.backupDetails[step].entries()) {
                if (d.groupid !== null) {
                    for (const [index, field] of d.fielddetails.entries()) {

                        if (index === 0) {
                            for (let j = 0; j < d.fielddetailskeys[index].length; j++) {
                                const key = d.fielddetailskeys[index][j];
                                if (field[key][0].parentfieldid !== null && field[key][0].parentfieldid === parentItem.fieldid
                                    && this.common.checkParentFieldValue(field[key][0].parentfieldvalue, parentItem.fieldvalue, 1)) {
                                    if (field[key][0].groupView === 'table') {
                                        if (field[key][0].fielddetails.details === undefined) {
                                            const fieldDetailsArr: any = [];
                                            for (const k of field[key][0].fielddetailskeys[0]) {
                                                fieldDetailsArr.push(field[key][0].fielddetails[0][k][0])
                                            }
                                            // console.log(fieldDetailsArr)
                                            const groupData = this.common.groupBy(fieldDetailsArr, 'rowname');
                                            const keyData = Object.keys(groupData);
                                            field[key][0].fielddetails = {
                                                keys: keyData,
                                                details: groupData
                                            }
                                        }
                                    }
                                    // console.log(JSON.stringify(field[key]));
                                    if (field[key][0] && field[key][0].groupView === 'form') {
                                        field[key][0].fielddetails.length = 1;
                                        field[key][0].fielddetailskeys.length = 1;
                                        for(const ky of field[key][0].fielddetailskeys[0]) {
                                            field[key][0].fielddetails[0][ky][0].fieldvalue = '';
                                        }
                                    }
                                    obj.fielddetails[groupPosition][key] = JSON.parse(JSON.stringify(field[key]));
                                    if (field[key][0] && field[key][0].groupView !== 'table') {
                                        this.onRadioButtonChange(obj, step, field[key][0], 'group', groupPosition);
                                    }
                                    if (!obj.fielddetailskeys[groupPosition].includes(key)) {
                                        obj.fielddetailskeys[groupPosition].push(key);
                                    }
                                }
                            }
                        }
                        if (d.groupid === obj.groupid) {
                            obj.fielddetailskeys[groupPosition] = this.common.sortKeyAsFirst(d.fielddetailskeys[index], obj.fielddetailskeys[groupPosition]);
                        }
                    }
                }
            }
        } else {
            if (obj.fielddetails.fielddesc === 'Does_it_Fall_under_Planning_Area') {
                if (obj.fielddetails.fieldvalue === 'No') {
                    this.isPreventRegistration = true;
                    obj.fielddetails.fieldvalue = '';
                }
            }
            for (const step1 of this.stepList) {
                let newObj: any = [];
                newObj = this.formDetails[step1].filter((item: any) => (item.parentfieldid == obj.fieldid && this.common.checkParentFieldValue(item.parentfieldvalue, obj.fielddetails.fieldvalue, 0)));
                this.formDetails[step1] = this.formDetails[step1].filter((item: any) => !(item.parentfieldid == obj.fieldid && this.common.checkParentFieldValue('ww', obj.fielddetails.fieldvalue, 0)));
                this.formDetails[step1] = this.formDetails[step1].filter((item: any) => !(item.parentfieldid == obj.fieldid && this.common.checkParentFieldValue(item.parentfieldvalue, obj.fielddetails.fieldvalue, 0)));
                for (const rmObj of newObj) {
                    this.formDetails[step1] = this.formDetails[step1].filter((item: any) => !(item.parentfieldid !== null && item.parentfieldid == rmObj.fielddetails.fieldid));
                }
                for (const d of this.backupDetails[step1]) {
                    if (this.common.checkParentFieldValue(d.parentfieldvalue, obj.fielddetails.fieldvalue, 1) && d.parentfieldid == obj.fielddetails.fieldid) {
                        const matchObj = JSON.parse(JSON.stringify(d));
                        this.formDetails[step1].push(matchObj);
                        for (const d1 of this.backupDetails[step1]) {
                            if (this.common.checkParentFieldValue(d1.parentfieldvalue, matchObj.fielddetails.fieldvalue, 1) && d1.parentfieldid == matchObj.fielddetails.fieldid) {
                                this.formDetails[step1].push(JSON.parse(JSON.stringify(d1)));
                            }
                        }
                    }
                }
                this.formDetails[step1].sort(function (a: any, b: any) {
                    return a.sequenceno - b.sequenceno
                });
            }
        }
        const desc = flag !== 'group' ? obj.fielddetails.fielddesc : parentItem.fielddesc;
        const fieldvalue = flag !== 'group' ? obj.fielddetails.fieldvalue : parentItem.fieldvalue;
        // console.log(desc)
        // console.log(parentItem)
        if (desc == 'State' || desc == 'Registered_With_RERA_of_which_State') {
            for (let i = 0; i < this.stateList.length; i++) {
                if (this.stateList[i].statename === fieldvalue) {
                    if (flag === 'group') {
                        this.getDistricts(this.stateList[i].id, obj, flag, groupPosition)
                    } else {
                        this.getDistricts(this.stateList[i].id, step, flag, groupPosition)
                    }
                    break;
                }

            }
        } else if (desc === 'Project_being_registered') {
            this.projectStatus = obj.fielddetails.fieldvalue;
            this.checkDelayedStatus();
        } else if(desc === 'Phase_Wise') {
            this.phaseStatus = obj.fielddetails.fieldvalue;
            setTimeout(() => {
                this.checkAreaPhase();
            }, 1000)
        } else if (desc === 'Project_Category') {
            this.projectCategory = obj.fielddetails.fieldvalue;
            this.adjustStepList(this.projectCategory);
        } else if (desc === 'Project_Land_Area_is_Owned_by') {
            setTimeout(() => {
                this.disableCalculatedFieldInLandDetails(this.stepListShow[this.selectedTabIndex-1]);
                this.projectConf.disableCalculationFieldList(['Land_Area_in_SqM']);
            },100);
        }

        if (step ==='Past Projects' && obj.fielddetails.fieldid === 1031) {
            for (const obj of this.formDetails[step]) {
                if (obj.groupid && obj.groupid === 36) {
                    this.rearrangeForm(step, obj);
                }
            }
        }
         
    }

    checkDelayedStatus(cmpDate: string = ''): void {
        const elem: any = document.getElementById('Project_Completion_Date');
        if (elem || cmpDate !== '') {
            cmpDate = cmpDate !== '' ? cmpDate : elem.value;
            if (cmpDate !== '') {
                if (new Date(cmpDate).getTime() > new Date().getTime() && this.projectStatus === 'Ongoing') {
                    this.toggleElement('If_the_project_delayed', 1);
                } else {
                    this.toggleElement('If_the_project_delayed', 0);
                }
            } else {
                this.toggleElement('If_the_project_delayed', 0);
            }
        }
    }

    checkAreaPhase(cmpDate: string = ''): void {
        const elem: any = document.getElementById("Registration_applied_for_which_phase")
        const elem1: any = document.getElementById("label_Area_of_Phase")
        if (elem || cmpDate !== '') {
            cmpDate = cmpDate !== '' ? cmpDate : elem.value;
            if (this.phaseStatus ==='Yes' && cmpDate !== '' && cmpDate !== '0') {
                this.toggleElement('Area_of_Phase', 1);
                this.toggleElement('label_Area_of_Phase', 1);
                if (elem1) {
                    elem1.innerText = "Area of Phase" + " " + cmpDate;
                }
                
            } else if(this.phaseStatus ==='Yes' && cmpDate === ''){
                if (elem1) {
                    elem1.innerText = "Area of Phase"
                }
                this.toggleElement('Area_of_Phase', 0);
                this.toggleElement('label_Area_of_Phase', 0);
            }
        } else {
            if (elem1) {
                elem1.innerText = "Area of Phase";
            }
            this.toggleElement('Area_of_Phase', 0);
            this.toggleElement('label_Area_of_Phase', 0);
        }
    }

    toggleElement(elemId: string, flag: number) {
        const element = document.getElementById(elemId);
        if (element) {
            flag === 0 ? element.classList.add('displayNone') : element.classList.remove('displayNone')
        }
    }


    goToNext(stepDtl: any): any {
        if (Array.isArray(stepDtl)) {
            for (const obj of stepDtl) {
                if (obj.groupView === 'table') {
                    // console.log('4444444444444444444444444')
                    for (const key of Object.keys(obj.fielddetails.details)) {
                        for (const d of obj.fielddetails.details[key]) {
                            // console.log('>>>>>>>>>>>>>>> ', d.fieldid, d.fielddisplaydesc);
                            const elem: any = document.getElementById(d.fielddesc);
                            if (d.isrequired === 1 && !this.ignoreCheckType.includes(d.controltype) && (d.fieldvalue === '' && elem.value == '')) {
                                this.notifier.notify('error', 'All * mark fields are mandatory');
                                return false;
                            }
                        }
                    }
                } else {
                    if (!Array.isArray(obj.fielddetails)) {
                        // console.log(obj.isrequired, obj.fielddetails.fieldid, obj.fielddetails.fielddisplaydesc);
                        const elem: any = document.getElementById(obj.fielddetails.fielddesc);
                        if (obj.isrequired === 1 && !this.ignoreCheckType.includes(obj.fielddetails.controltype) && (obj.fielddetails.fieldvalue === '' && elem.value == '')) {
                            this.notifier.notify('error', 'All * mark fields are mandatory');
                            return false;
                        }
                    } else {
                        // console.log('2222222222222222222', obj.groupid)
                        if (obj.groupid !== 21) {
                            for (const d of obj.fielddetails) {
                                // console.log('keys >>>>>>> ', Object.keys(d));
                                for (const key of Object.keys(d)) {
                                    // console.log('!!!!!!!!!!!!! ', d[key][0].fieldid, d[key][0].fielddisplaydesc);
                                    if(d[key][0].fieldid === undefined) {
                                        // console.log('2222222222222222222', d[key][0]);
                                        for (const d1 of d[key][0].fielddetails) {
                                            for (const key1 of Object.keys(d1)) {
                                                // console.log('==================== ', d1[key1][0].fieldid, d1[key1][0].fielddisplaydesc);
                                                if (d1[key1][0].isrequired === 1 && !this.ignoreCheckType.includes(d1[key1][0].controltype) && d1[key1][0].fieldvalue === '') {
                                                    this.notifier.notify('error', 'All * mark fields are mandatory');
                                                    return false;
                                                }
                                            }
                                        }
                                    } else {
                                        // console.log(obj.groupid)
                                        if (d[key][0].isrequired === 1 && !this.ignoreCheckType.includes(d[key][0].controltype) && d[key][0].fieldvalue === '') {
                                            this.notifier.notify('error', 'All * mark fields are mandatory');
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            console.log('333333333333333333333333');
            for (const key of stepDtl.keys) {
                for (const d of stepDtl.details[key]) {
                    console.log('------------- ', d.fielddetails.fieldid, d.fielddetails.fielddisplaydesc);
                    if (!this.ignoreCheckType.includes(d.fielddetails.controltype) && d.fielddetails.fieldvalue === '') {
                        this.notifier.notify('error', 'All * mark fields are mandatory');
                        return false;
                    }
                }
            }
        }
        if (this.selectedTabIndex < (this.stepListShow.length)) {
            this.selectedTabIndex += 1
        }
    }

    goToPrevious(): void {
        if (this.selectedTabIndex > 0) {
            this.selectedTabIndex -= 1;
        }
    }

    onTabChange(event: any): void {
        this.selectedTabIndex = event.index;
        if (this.stepListShow[this.selectedTabIndex-1] === 'Payment') {
            if (this.paymentAmount !== null && this.paymentAmount !== 0) {
                this.totalAmount = this.paymentAmount;
            } else {
                this.paymentCalculation();
            }
        } else if(this.stepListShow[this.selectedTabIndex-1]=== this.stepDesc) {
            const totalProjectCost: any = document.getElementById('Total_Project_Cost_project_info');
            const landCostPer: any = document.getElementById('Land_Cost_of_Project_Cost');
            if (totalProjectCost && landCostPer) {
                landCostPer.disabled = true;
                totalProjectCost.disabled = true;
            }
            const elem : any = document.getElementById('Phase_Wise');
            const elem1 : any = document.getElementById('Project_Completion_Date');
            if(elem){
                this.checkAreaPhase();
            }
            if(elem1){
                this.checkDelayedStatus()
            }
            this.calculateCompletionDate();
        } else if (this.stepListShow[this.selectedTabIndex-1] === 'Past Projects') {
            const elem: any = <HTMLInputElement>document.getElementById('No_Of_Project_Completed');
            const elemLbl: any = document.getElementById('label_No_Of_Project_Completed');
            if (elem) {
                if (this.isDataBlank) {
                    elem.style.display = 'none';
                    elemLbl.style.display = 'none';
                } else {
                    elem.disable = true;
                    elem.value = this.totalPastProject;
                }
            }
            const otherPrjCountElem: any = <HTMLInputElement>document.getElementById('Number_of_Other_Projects_Launched_in_Past_Years');
            if (otherPrjCountElem) {
                if (otherPrjCountElem.value === '0') {
                    this.toggleElement('grp_36', 0);
                } else {
                    this.toggleElement('grp_36', 1);
                }
            }
            for (const obj of this.formDetails['Past Projects']) {
                if (obj.groupid && obj.groupid === 36) {
                    this.rearrangeForm('Past Projects', obj);
                }
            }
        } else if (this.stepListShow[this.selectedTabIndex-1] === 'Land Details') {
            this.saveNumberOfSanctionBuilding();
            this.reArrangeFieldsByLandType(this.stepListShow[this.selectedTabIndex-1]);
            this.disableCalculatedFieldInLandDetails(this.stepListShow[this.selectedTabIndex-1]);
            this.projectConf.disableCalculationFieldList(['Land_Area_in_SqM']);
        } else if (this.stepListShow[this.selectedTabIndex-1] === 'Sanction Plan') {
            this.projectConf.checkAndDisable();
        } else if (this.stepListShow[this.selectedTabIndex-1] === 'Building Details') {
            this.setNumberOfSanctionBuilding();
            this.setBuildingType(this.formDetails[this.stepListShow[this.selectedTabIndex-1]], this.stepListShow[this.selectedTabIndex-1]);
            this.projectConf.disableCalculationFieldList(this.projectConf.buildingDetailsDisableFieldList);
        } else if (this.stepListShow[this.selectedTabIndex-1] === 'Financial Details') {
            this.getFinancialYearList(this.stepListShow[this.selectedTabIndex-1]);
        }
    }

    setBuildingType(data: any, step: string) {
        for(const obj of data) {
            if (obj.groupid === 13) {
                for(const [ind, d] of obj.fielddetails.entries()) {
                    const buildingType = this.getCategoryWiseBuildingType();
                    if (d['Type_of_Building'][0].fieldvalue !== buildingType) {
                        d['Type_of_Building'][0].fieldvalue = buildingType;
                        this.saveCalculatedElem(d['Type_of_Building'][0].fieldid, obj.groupid, 1, d['Type_of_Building'][0].fieldvalue, d['Type_of_Building'][0].fielddesc, ind, obj.stepid, 'group');
                        this.onRadioButtonChange(obj, step, d['Type_of_Building'][0], 'group', ind);
                    }
                    const elem: any = <HTMLElement>document.getElementById('Type_of_Building_' + ind);
                    if (elem) {
                        elem.disabled = true;
                    }
                }
                break;
            }
        }
    }

    calculateCompletionDate() {
        const periodElem: any = <HTMLInputElement>document.getElementById('Registration_Sought_for_the_Period_Years');
        const complementElem: any = <HTMLInputElement>document.getElementById('Project_Completion_Date');
        const commencementElem: any = <HTMLInputElement>document.getElementById('Project_Commencement_Date');
        /*if (periodElem && complementElem && commencementElem && periodElem.value !== ''
            && commencementElem.value !== '') {
            console.log(periodElem.value, complementElem.value, commencementElem.value);
            const comctDate = new Date(commencementElem.value);
            comctDate.setFullYear(comctDate.getFullYear() + Number(periodElem.value));
            complementElem.value = this.common.formatDate(comctDate, 1);
            this.saveCalculatedElem(complementElem.dataset.fieldid, 0, 1, complementElem.value + '', 'Project_Completion_Date', -1, complementElem.dataset.stepid, 'single');
            this.saveCalculatedElem(periodElem.dataset.fieldid, 0, 1, periodElem.value + '', 'Registration_Sought_for_the_Period_Years', -1, periodElem.dataset.stepid, 'single');
        }
        complementElem.disabled = true;*/
        if (periodElem && complementElem && commencementElem && complementElem.value !== ''
            && commencementElem.value !== '') {
            const result = this.common.diffDate(new Date(commencementElem.value), new Date(complementElem.value));
            periodElem.value = result.years + 'Y ' + result.months + 'M ' + result.days + 'D';
            this.saveCalculatedElem(periodElem.dataset.fieldid, 0, 1, periodElem.value + '', 'Registration_Sought_for_the_Period_Years', -1, periodElem.dataset.stepid, 'single');
        }
        periodElem.disabled = true;
    }

    setTotalLandAreaInLandDetails() {
        const element: any = <HTMLInputElement>document.getElementById('Total_Land_Area_of_the_Project')
        if (element) {
            element.value = this.totalLandArea + '';
            // this.saveValue('Totat_area_of_Land', element.dataset.fieldid, this.totalLandArea + '', 0, -1, element.dataset.stepid, 0, -1);
            this.saveCalculatedElem(element.dataset.fieldid, 0, 1, this.totalLandArea + '', 'Total_Land_Area_of_the_Project', -1, element.dataset.stepid, 'single');
        }
    }

    saveNumberOfSanctionBuilding() {
        const buildingNo = <HTMLInputElement>document.getElementById('Sanctioned_Buildings_table_field');
        if (buildingNo) {
            this.numberOfSectionBuilding = buildingNo.value
        }
    }

    setNumberOfSanctionBuilding() {
        const buildingNo = <HTMLInputElement>document.getElementById('Sanctioned_Buildings_table_field');
        const buildingNoCountElem = <HTMLInputElement>document.getElementById('Enter_sanctioned_number_of_buildings');
        if (buildingNo) {
            buildingNoCountElem.value = buildingNo.value;
            this.numberOfSectionBuilding = buildingNo.value;
        } else {
            buildingNoCountElem.value = this.numberOfSectionBuilding;
        }
        if (buildingNoCountElem) {
            const data = {
                tempid: '',
                stepid: Number(buildingNoCountElem.dataset['stepid']),
                fielddetails: {
                    fieldid: buildingNoCountElem.dataset['fieldid'],
                    fieldtype: 1,
                    fieldvalue: this.numberOfSectionBuilding,
                    fielddesc: 'Enter_sanctioned_number_of_buildings',
                    projectuniqueid: 0,
                }
            };
            this.onBlurElement(data, 0, {}, -1, Number(buildingNoCountElem.dataset['stepid']));
        }
        if (buildingNoCountElem) {
            buildingNoCountElem.disabled = true;
        }
    }

    checkRelativeValueAndAction(fielddesc: string, groupId: number, pos: number): any {
        for (const obj of this.projectConf.sectionPlanSpecification) {
            if (obj.proposed === fielddesc || obj.sanctioned === fielddesc) {
                const pElem = <HTMLInputElement>document.getElementById(obj.proposed);
                const sElem = <HTMLInputElement>document.getElementById(obj.sanctioned);
                const rElem = <HTMLInputElement>document.getElementById(obj.reason);
                if (obj.proposed === fielddesc) {
                    if (sElem.value === '' && pElem.value !== '') {
                        sElem.value = pElem.value;
                        const data = {
                            tempid: '',
                            stepid: Number(sElem.dataset['stepid']),
                            fieldid: sElem.dataset['fieldid'],
                            fieldtype: 1,
                            fieldvalue: sElem.value,
                            fielddesc: obj.sanctioned,
                            projectuniqueid: 0
                        };
                        this.onBlurElement(data, groupId, {}, 2, Number(sElem.dataset['stepid']));
                    }
                }
                if (pElem && sElem && rElem) {
                    if (pElem.value !== '' && sElem.value !== '' && pElem.value !== sElem.value) {
                        rElem.disabled = false;
                    } else {
                        rElem.disabled = true;
                    }
                }
                break;
            }
        }
    }

    onCustomeDateSelect(event: any, obj: any, groupid: number, j: number, stepid: number) {
        obj.fieldvalue = event;
        this.onBlurElement(obj, groupid, {}, j, stepid);
    }

    getLatLong(address: string) {
        const data = {
            userid: this.common.getUserId(),
            address: address
        };
        this.rest.getLatLong(data).subscribe((res: any) => {
            if (res.success) {
                for (const obj of this.formDetails[this.stepList[1]]) {
                    if (obj.fielddetails.fielddesc == 'Geographic_Location') {
                        obj.fielddetails.fieldvalue = res.response.lat.toFixed(5);
                        const Geographic_Location = (<HTMLInputElement>document.getElementById('Geographic_Location'));
                        if (Geographic_Location) {
                            setTimeout(() => {
                                Geographic_Location.focus();
                            }, 200)
                        }
                    }
                    if (obj.fielddetails.fielddesc == 'Geo_Location_Lon') {
                        obj.fielddetails.fieldvalue = res.response.lng.toFixed(5);
                        const Geo_Location_Lon = (<HTMLInputElement>document.getElementById('Geo_Location_Lon'));
                        if (Geo_Location_Lon) {
                            setTimeout(() => {
                                Geo_Location_Lon.focus();
                            }, 500)
                        }
                    }
                    if (obj.fielddetails.fielddesc == 'Geographic_Other_Location') {
                        obj.fielddetails.fieldvalue = res.response.lng.toFixed(5);
                        const Geo_Location_Lon = (<HTMLInputElement>document.getElementById('Geographic_Other_Location'));
                        if (Geo_Location_Lon) {
                            setTimeout(() => {
                                Geo_Location_Lon.focus();
                            }, 500)
                        }
                    }
                }
            }
        });
    }

    onKeyUpChanges(obj: any) {
        if (obj.fielddetails.fielddesc === 'Registration_applied_for_which_phase') {
            this.checkAreaPhase();
        }
    }

    calculateDesimelToSqm(desc: string, pos: number, fieldValue: number, flag = 0) {
        let element: any;
        let value = '';
        let fieldid = 0;
        if (flag === 0) {
            element = <HTMLInputElement>document.getElementById('Plot_Area_in_sqm_' + pos);
            value = (Number(fieldValue) * 40.464831).toFixed(2);
            fieldid = 849;
        } else {
            element = <HTMLInputElement>document.getElementById('Area_of_the_Land_in_Decimal_' + pos);
            value = (Number(fieldValue) / 40.464831).toFixed(2);
            fieldid = 688;
        }
        if (element) {
            element.value = value;
            // element.focus();
            const data = {
                fieldid: fieldid,
                tempid: '',
                fieldtype: 1,
                fieldvalue: value,
                fielddesc: desc,
                projectuniqueid: 0,
                internal: true

            };
            this.onBlurElement(data, 30, {}, pos, 6);
        }
    }

    calculateTotalArea(fielddesc: string, groupid: number, pos: number, stepId: number, fieldGroupId: number, fieldGroupPos: number) {
        console.log(fielddesc, groupid, pos, stepId, fieldGroupId, fieldGroupPos);
        const unitElem = <HTMLInputElement>document.getElementById('Number_of_Units_' + pos + '_' + fieldGroupPos);
        let value = '';
        let fieldId: any = '';
        if (this.projectConf.areaElemList[fielddesc]) {
            const elem = <HTMLInputElement>document.getElementById(fielddesc + '_' + pos + '_' + fieldGroupPos);
            const totalElem = <HTMLInputElement>document.getElementById(this.projectConf.areaElemList[fielddesc] + '_' + pos + '_' + fieldGroupPos);
            if (elem && unitElem.value !== '') {
                totalElem.value = (Number(elem.value) * Number(unitElem.value)) + '';
                value = (Number(elem.value) * Number(unitElem.value)) + '';
                fieldId = totalElem.dataset['fieldid'];
                this.saveValue(this.projectConf.areaElemList[fielddesc], fieldId, value, groupid, pos, stepId, fieldGroupId, fieldGroupPos);
            }
        } else if (fielddesc === 'Number_of_Units') {
            const keys = Object.keys(this.projectConf.areaElemList);
            for (const key of keys) {
                const elem = <HTMLInputElement>document.getElementById(key + '_' + pos + '_' + fieldGroupPos);
                const totalElem = <HTMLInputElement>document.getElementById(this.projectConf.areaElemList[key] + '_' + pos + '_' + fieldGroupPos);
                if (elem && unitElem.value !== '') {
                    totalElem.value = (Number(elem.value) * Number(unitElem.value)) + '';
                    value = (Number(elem.value) * Number(unitElem.value)) + '';
                    fieldId = totalElem.dataset['fieldid'];
                    this.saveValue(this.projectConf.areaElemList[key], fieldId, value, groupid, pos, stepId, fieldGroupId, fieldGroupPos);
                }
            }
        } else if (this.projectConf.shopElemList[fielddesc]) {
            let shopUnitElem = <HTMLInputElement>document.getElementById('Number_of_Shops_' + pos + '_' + fieldGroupPos);
            const elem = <HTMLInputElement>document.getElementById(fielddesc + '_' + pos + '_' + fieldGroupPos);
            const totalElem = <HTMLInputElement>document.getElementById(this.projectConf.shopElemList[fielddesc] + '_' + pos + '_' + fieldGroupPos);
            if (elem && shopUnitElem.value !== '') {
                totalElem.value = (Number(elem.value) * Number(shopUnitElem.value)) + '';
                value = (Number(elem.value) * Number(shopUnitElem.value)) + '';
                fieldId = totalElem.dataset['fieldid'];
                this.saveValue(this.projectConf.shopElemList[fielddesc], fieldId, value, groupid, pos, stepId, fieldGroupId, fieldGroupPos);
            }
        } else if (fielddesc === 'Number_of_Shops') {
            let shopUnitElem = <HTMLInputElement>document.getElementById('Number_of_Shops_' + pos + '_' + fieldGroupPos);
            const keys = Object.keys(this.projectConf.shopElemList);
            for (const key of keys) {
                const elem = <HTMLInputElement>document.getElementById(key + '_' + pos + '_' + fieldGroupPos);
                const totalElem = <HTMLInputElement>document.getElementById(this.projectConf.shopElemList[key] + '_' + pos + '_' + fieldGroupPos);
                if (elem && shopUnitElem.value !== '') {
                    totalElem.value = (Number(elem.value) * Number(shopUnitElem.value)) + '';
                    value = (Number(elem.value) * Number(shopUnitElem.value)) + '';
                    fieldId = totalElem.dataset['fieldid'];
                    this.saveValue(this.projectConf.shopElemList[key], fieldId, value, groupid, pos, stepId, fieldGroupId, fieldGroupPos);
                }
            }
        }
    }

    saveValue(fielddesc: string, fieldId: any, value: string, groupid: number, pos: number, stepId: number, fieldGroupId: number, fieldGroupPos: number) {
        const data = {
            fieldid: fieldId,
            tempid: '',
            fieldtype: 1,
            fieldvalue: value,
            fielddesc: fielddesc,
            projectuniqueid: 0

        };
        this.onBlurElement(data, groupid, {}, pos, stepId, fieldGroupId, fieldGroupPos);
    }

    calculateLandAreaDecimalToSqm(fieldValue: string, groupId: number, fieldGroupId: number, pos: number, groupFieldPosition: number, flag: number = 0) {
        let value = '';
        let element: any;
        console.log("groupFieldPosition", groupFieldPosition);
        if (groupId === 0) {
            element = <HTMLInputElement>document.getElementById('Land_Area_in_SqM');
        } else if (groupFieldPosition == -1) {
            element = <HTMLInputElement>document.getElementById('Land_Area_in_SqM_' + pos);
        } else {
            element = <HTMLInputElement>document.getElementById('Land_Area_in_SqM_' + pos + '_' + groupFieldPosition);
        }
        if (fieldValue === '') {
            fieldValue = '0';
        }
        value = (Number(fieldValue) * 40.464831).toFixed(2);
        if (element) {
            element.value = value;
            element.disabled = true;
            // element.focus();
            const data = groupId !== 0 ? {
                fieldid: element.dataset.fieldid,
                tempid: '',
                fieldtype: 1,
                fieldvalue: value + '',
                fielddesc: 'Land_Area_in_SqM',
                projectuniqueid: 0,
                internal: true

            } : {
                tempid: '',
                stepid: element.dataset.stepid,
                fielddetails: {
                    fieldid: element.dataset.fieldid,
                    fieldtype: 1,
                    fieldvalue: value + '',
                    fielddesc: 'Land_Area_in_SqM',
                    projectuniqueid: 0,
                },
                internal: true
            };
            this.onBlurElement(data, groupId, {}, pos, element.dataset.stepid, fieldGroupId, groupFieldPosition);
        }
    }

    calculateProjectCost() {
        const devCost: any = document.getElementById('Estimated_Development_Cost_Rs');
        const landCost: any = document.getElementById('Estimated_Cost_of_Land_Rs');
        const totalProjectCost: any = document.getElementById('Total_Project_Cost_project_info');
        const landCostPer: any = document.getElementById('Land_Cost_of_Project_Cost');

        if (devCost && landCost && totalProjectCost && landCostPer && devCost.value !== '' && landCost.value !== '') {
            const totalCost = Number(devCost.value) + Number(landCost.value);
            const percentage = (Number(landCost.value) / totalCost) * 100;
            totalProjectCost.value = totalCost;
            landCostPer.value = percentage.toFixed(2);

            const data = {
                tempid: '',
                stepid: totalProjectCost.dataset.stepid,
                fielddetails: {
                    fieldid: totalProjectCost.dataset.fieldid,
                    fieldtype: 1,
                    fieldvalue: totalCost + '',
                    fielddesc: 'Total_Project_Cost_project_info',
                    projectuniqueid: 0,
                },
                internal: true
            };
            this.onBlurElement(data, 0, {}, -1, totalProjectCost.dataset.stepid, null, -1);

            const data1 = {
                tempid: '',
                stepid: landCostPer.dataset.stepid,
                fielddetails: {
                    fieldid: landCostPer.dataset.fieldid,
                    fieldtype: 1,
                    fieldvalue: percentage.toFixed(2),
                    fielddesc: 'Total_Project_Cost_project_info',
                    projectuniqueid: 0,
                },
                internal: true
            };
            this.onBlurElement(data1, 0, {}, -1, landCostPer.dataset.stepid, null, -1);
        }
    }


    onBlurElement(obj: any, groupid = 0, event: any = {}, pos: number = -1, stepId = 0, fieldGroupId: any = null, fieldGroupPos: number = -1, externalProjectId: number = 0): any {
        if (groupid === 21) {
            externalProjectId = this.pastProjectIdList[pos];
        }
        // console.log('externalProjectId >>>>>>>>>> ', externalProjectId);
        stepId = groupid === 0 ? obj.stepid : stepId;
        const fieldtype = groupid === 0 ? obj.fielddetails.fieldtype : obj.fieldtype;
        let fieldValue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        const fielddesc = groupid === 0 ? obj.fielddetails.fielddesc : obj.fielddesc;
        if (fielddesc === 'Does_it_Fall_under_Planning_Area' && fieldValue === 'No') {
            return false;
        }

        if (fieldtype == 5 && event) {
            if (event.target.files.length > 0) {
                const fileSize = event.target.files[0].type.indexOf('pdf') > -1 ? 10485760 : 2097152;
                if (event.target.files[0].size > fileSize) {
                    this.notifier.notify('error', 'File size limit exceeds.');
                    return false;
                }
            }
        }

        if(Array.isArray(fieldValue)) {
            fieldValue = fieldValue.join('|');
        }
        if (groupid === 24) {
            this.checkRelativeValueAndAction(fielddesc, groupid, pos);
        } else if (groupid === 13) {
            this.calculateTotalArea(fielddesc, groupid, pos, stepId, fieldGroupId, fieldGroupPos);
        }
        let isvalid = true;
        if (fielddesc === 'Contact_No') {
            isvalid = this.common.validMobile(obj, groupid);
            if (!isvalid) {
                obj.valideerr = 'Invalid Contact Number';
            } else {
                obj.valideerr = '';
            }
        } /* else if (fielddesc === 'Project_Completion_Date') {
            this.checkDelayedStatus();
        } */
        else if (fielddesc === 'Project_Completion_Date' || fielddesc === 'Project_Commencement_Date') {
            this.calculateCompletionDate();
        } else if (fielddesc === 'Registration_applied_for_which_phase') {
            this.checkAreaPhase();
        } else if (fielddesc.indexOf('Area_of_the_Land_in_Decimal') > -1 && obj.internal === undefined) {
            this.calculateDesimelToSqm('Plot_Area_in_sqm', pos, fieldValue, 0);
        } else if (fielddesc.indexOf('Plot_Area_in_sqm') > -1 && obj.internal === undefined) {
            // this.calculateDesimelToSqm('Area_of_the_Land_in_Decimal', pos, fieldValue, 1);
        } else if (fielddesc === 'Number_of_Other_Projects_Launched_in_Past_Years') {
            if (fieldValue === '0') {
                this.toggleElement('grp_36', 0);
            } else {
                this.toggleElement('grp_36', 1);
            }
        } else if (fielddesc === 'share_of_Landowner_in_the_Project') {
            this.calculateTotalTotalShare();
        } else if (fielddesc === 'Land_Area_in_Decimal' && obj.internal === undefined) {
            this.calculateLandAreaDecimalToSqm(fieldValue, groupid, fieldGroupId, pos, fieldGroupPos, 0);
        } else if ((fielddesc === 'Estimated_Development_Cost_Rs' || fielddesc === 'Estimated_Cost_of_Land_Rs') && obj.internal === undefined) {
            this.calculateProjectCost();
        }
        const isuniqueid = groupid === 0 ? obj.fielddetails.projectuniqueid : obj.projectuniqueid;
        const fd = new FormData();
        fd.append('userid', this.common.getUserId());
        fd.append('reraid', this.common.getReraId());
        fd.append('entityid', this.common.getEntityId());
        fd.append('entitytypeid', this.entityTypeId + '');
        fd.append('projectid', this.projectId + '');
        fd.append('groupid', groupid !== 0 ? groupid + '' : '');
        fd.append('fieldid', groupid === 0 ? obj.fielddetails.fieldid : obj.fieldid);
        fd.append('fieldvalue', fieldValue);
        fd.append('tempid', obj.tempid !== undefined && obj.tempid !== null ? obj.tempid : '');
        fd.append('fieldgroupid', fieldGroupId === null ? '' : fieldGroupId);
        fd.append('isuniqueid', isuniqueid);
        fd.append('fieldtype', fieldtype);
        fd.append('pos', pos + '');
        fd.append('fieldGroupPos', fieldGroupPos + '');
        fd.append('stepid', stepId + '');
        fd.append('externalProjectId', externalProjectId + '');
        if (fieldtype == 5) {
            fd.append('file', event.target.files[0]);
        }
        if (fielddesc === 'Total_Land_Area' || fielddesc === 'Total_area_of_the_Project') {
            this.totalLandArea = fieldValue === '' ? 0 : Number(fieldValue);
        } else if (fielddesc === 'Project_Category') {
            this.projectCategory = fieldValue;
        }
        if (isvalid === true) {
            this.rest.storeTemp(fd).subscribe((res: any) => {
                if (res.success) {
                    obj.tempid = res.response.tempid;
                    if (fieldtype == 5 && groupid == 0) {
                        obj.fielddetails.fieldvalue = res.response.value;
                    } else if (fieldtype == 5 && groupid !== 0) {
                        obj.fieldvalue = res.response.value;
                    }
                } else {
                    if (fieldtype == 5) {
                        this.notifier.notify('error', res.message);
                    }
                }
            });
        }
    }

    removeImage(findx: number, obj: any, groupId: number = 0, groupPosition: number = -1, stepId: number = 0) {
        if (groupId === 0) {
            const fileArr = obj.fielddetails.fieldvalue.split(',');
            fileArr.splice(findx, 1);
            obj.fielddetails.fieldvalue = fileArr.join(',');
            this.saveCalculatedElem(obj.fielddetails.fieldid, 0, 1, obj.fielddetails.fieldvalue, obj.fielddetails.fielddesc, -1, obj.stepid, 'single');
        } else {
            const fileArr = obj.fieldvalue.split(',');
            fileArr.splice(findx, 1);
            obj.fieldvalue = fileArr.join(',');
            this.saveCalculatedElem(obj.fieldid, groupId, 1, obj.fieldvalue, obj.fielddesc, groupPosition, stepId, 'group');
        }
    }


    submitForm(): any {
        if(!this.isAccept) {
            this.notifier.notify('error', 'Check the declaration before submit.');
            return false;
        }
        this.modalService.open(this.confirmSubmitModal, {centered: true})
    }

    confirmSubmit(): any {
        const data = {
            userid: this.common.getUserId(),
            reraid: this.common.getReraId(),
            entityid: this.common.getEntityId(),
            entitytypeid: this.entityTypeId,
            projectid: this.projectId
        };
        this.common.loaderShow();
        this.rest.submitProject(data).subscribe((res: any) => {
            if (res.success) {
                this.moveWorkflow();
                this.isSubmitted = true;
                this.closeModal();
                // this.ngOnInit();
                this.common.loaderEnd();
                this.router.navigate(['/pages/project-dashboard']);
                this.notifier.notify('success', res.message);
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err: any) => {
        });
    }

    closeModal(): void {
        this.modalService.dismissAll();
    }


    moveWorkflow() {
        const data = {
            reraid: this.common.getReraId(),
            uniquepromoterid: this.common.getUserId(),
            uniqueprojectid: this.projectId,
            fromstepid: -1,
            forwardflg: 1,
            userid: this.common.getUserId(),
            workflowtype: 1
        };
        this.rest.moveWorkflow(data).subscribe((res: any) => {
            if (res.success) {
            }
        });
    }

    paymentCalculation(): void {
        let flag = 0;
        switch (this.projectCategory) {
            case 'Group Housing Project':
                if (this.totalLandArea <= 1000) {
                    this.totalAmount = this.totalLandArea * 5;
                } else {
                    this.totalAmount = this.totalLandArea * 10;
                }
                flag = 0;
                break;
            case 'Residential Apartment (G+3)':
                if (this.totalLandArea <= 1000) {
                    this.totalAmount = this.totalLandArea * 5;
                } else {
                    this.totalAmount = this.totalLandArea * 10;
                }
                flag = 0;
                break;
            case 'Residential Apartment (4 - 8 Floors)':
                if (this.totalLandArea <= 1000) {
                    this.totalAmount = this.totalLandArea * 5;
                } else {
                    this.totalAmount = this.totalLandArea * 10;
                }
                flag = 0;
                break;
            case 'Residential Apartment (8+ Floors)':
                if (this.totalLandArea <= 1000) {
                    this.totalAmount = this.totalLandArea * 5;
                } else {
                    this.totalAmount = this.totalLandArea * 10;
                }
                flag = 0;
                break;
            case 'Mixed Development Project':
                if (this.totalLandArea <= 1000) {
                    this.totalAmount = this.totalLandArea * 10;
                } else {
                    this.totalAmount = this.totalLandArea * 15;
                }
                flag = 0;
                break;
            case 'Commercial Project':
                if (this.totalLandArea <= 1000) {
                    this.totalAmount = this.totalLandArea * 20;
                } else {
                    this.totalAmount = this.totalLandArea * 25;
                }
                flag = 0;
                break;
            case 'Plotted Development Project':
                this.totalAmount = this.totalLandArea * 5;
                flag = 1;
                break;
        }
        if (flag === 0) {
            if (this.totalAmount > 500000) {
                this.totalAmount = 500000;
            }
        } else {
            if (this.totalAmount > 200000) {
                this.totalAmount = 200000;
            }
        }
    }

    numberInWords(number: number) {
        return this.common.numberInWords(number + '');
    }


    onButtonClick(step: string, fieldId: string, stepId: any, groupId: any) {
        if (fieldId === 'No_Of_Proj_Completed_Button') {
            const elem: any = document.getElementById('No_Of_Project_Completed')
            if (elem && elem.value !== '' && elem.value !== '0') {
                const totalProject = Number(elem.value);
                for (const obj of this.formDetails[step]) {
                    if (obj.groupid === 17) {
                        let remainingCount = totalProject - obj.fielddetails.length;
                        if (remainingCount > 0) {
                            for (let i = 0; i < remainingCount; i++) {
                                this.addMoreBtn(obj, 0, stepId, groupId);
                            }
                        } else {
                            remainingCount = (remainingCount) * (-1)
                            for (let i = 0; i < remainingCount; i++) {
                                obj.fielddetails.splice(obj.fielddetails.length - 1, 1);
                                obj.fielddetailskeys.splice(obj.fielddetails.length - 1, 1);
                            }
                        }
                    }
                }
            } else {
                this.notifier.notify('error', 'Number of project can not be zero or blank')
            }
        } else if (fieldId === 'Search_IFSC') {
            let elem: any = document.getElementById('Account_No');
            let elem2: any = document.getElementById('IFSC_Code');
            let elem3: any = document.getElementById('Confirm_Account_No');
            if (elem.value === elem3.value) {
                if (elem && elem.value !== '' && elem2 && elem2.value !== '') {
                    const accountno = elem.value.replace(" ", "").replace(" ", "");
                    const ifsc = elem2.value.replace(" ", "").replace(" ", "");
                    const ifscFieldId = elem.getAttribute('data-fieldID');
                    const ifscStepId = elem.getAttribute('data-stepID');
                    if (ifsc !== '' && accountno !== '') {
                        const data = {
                            "reraid": this.common.getReraId(),
                            "userid": this.common.getUserId(),
                            "fieldid": Number(ifscFieldId),
                            "stepid": Number(ifscStepId),
                            "groupid": 0,
                            "groupposition": 0,
                            "accountno": accountno,
                            "ifsc": ifsc,
                            "isRegistration": "false"
                        };
                        this.common.loaderShow();
                        this.rest.verifyIFSC(data).subscribe((res: any) => {
                            this.common.loaderEnd();
                            if (res.success) {
                                this.notifier.notify('success', res.message);

                            } else {
                                this.notifier.notify('error', res.message);
                            }
                        });
                    } else {
                        this.notifier.notify('error', 'Please enter IFSC Number and Account Number.');
                    }
                } else {
                    this.notifier.notify('error', 'Please enter IFSC Number and Account Number.');
                }
            } else {
                this.notifier.notify('error', 'Account Number and Confirm Account Number not matched.');
            }
        } else if (fieldId === 'Add_any_other_common_amenities_button') {
            // this.toggleButton();
        }
    }

    toggleButton() {
        const element = <HTMLButtonElement>document.getElementById('Add_any_other_common_amenities_button');
        if (element) {
            if (element.dataset['type'] == 'A') {
                element.dataset['type'] = 'R';
                element.innerText = 'Remove other common amenities';
                this.toggleElement('div_Add_any_other_common_amenities', 1);
                element.classList.remove('btn-primary');
                element.classList.add('btn-danger');
            } else {
                element.dataset['type'] = 'A';
                element.innerText = 'Add any other common amenities';
                element.classList.add('btn-primary');
                element.classList.remove('btn-danger');
                this.toggleElement('div_Add_any_other_common_amenities', 0);
            }
        }
    }

    openGoogleMaps(pos = -1) {
        let long: any = '';
        let lat: any = '';
        if(pos === -1) {
            try {
                long = (<HTMLInputElement>document.getElementById('Geo_Location_Lon')).value;
            } catch {
                if (long === undefined || long === null || long === '') {
                    try {
                        long = (<HTMLInputElement>document.getElementById('Geographic_Other_Location')).value;
                    } catch (e) {
                        long = null
                    }
                }
            }
            lat = (<HTMLInputElement>document.getElementById('Geographic_Location')).value;
        } else {
            lat = (<HTMLInputElement>document.getElementById('sLatitude_table_fiels_' + pos)).value;
            long = (<HTMLInputElement>document.getElementById('sLongitude_' + pos)).value;
        }
        if (long && lat) {
            window.open('https://www.google.com/maps/search/?api=1&query=' + lat + ',' + long, '_blank');
        }
    }

    handleResponse(res: any) {
        // console.log(JSON.stringify(res));
        if (typeof res != 'undefined'
            && typeof res.paymentMethod != 'undefined'
            && typeof res.paymentMethod.paymentTransaction != 'undefined'
            && typeof res.paymentMethod.paymentTransaction.statusCode != 'undefined'
            && res.paymentMethod.paymentTransaction.statusCode == '0300') {
            // success block
        } else if (typeof res != 'undefined'
            && typeof res.paymentMethod != 'undefined'
            && typeof res.paymentMethod.paymentTransaction != 'undefined'
            && typeof res.paymentMethod.paymentTransaction.statusCode != 'undefined'
            && res.paymentMethod.paymentTransaction.statusCode == '0398') {
            // initiated block
        } else if (typeof res != 'undefined'
            && typeof res.paymentMethod != 'undefined'
            && typeof res.paymentMethod.paymentTransaction != 'undefined'
            && typeof res.paymentMethod.paymentTransaction.statusCode != 'undefined'
            && res.paymentMethod.paymentTransaction.statusCode == '0399') {
            // initiated block
        } else {
            // error block
        }
    };

    makePayment(cartDescription: any, amount: number): any {
        if (cartDescription === '') {
            this.notifier.notify('error', 'Select the bank first');
            return false;
        }
        // amount = 100;
        if (amount == 0) {
            this.notifier.notify('error', 'Amount should be grater than zero.');
            return false;
        }
        const mrctCode = 'T206030';
        const n = new Date().getTime();
        // const orderId = "TXN_" + this.projectuid + n + "_" + Math.floor(1000 + Math.random() * 9000);
        const orderId = n + '' + this.randomFromTo(0, 1000);
        // const amount = 100;
        const currencyName = 'INR';
        const Remarks = 'Any Remarks';
        const meTransReqType = 'S';
        // const recurPeriod = '';
        // const recurDay = '';
        // const numberRecurring = '';
        const mid = 'WL0000000065479';
        if (cartDescription === 'axis') {
            const RID = this.common.getRandomIntInclusive(10000000,99999999);
            const CRN = this.common.getRandomIntInclusive(10000000,99999999);
            const data = {
                CID: '2881',
                RID: RID,
                CRN:CRN,
                AMT: amount,
                OrderId: orderId,
                userid: this.common.getUserId(),
                projectid: this.projectId,
                reraid: this.common.getReraId(),
                returnurl: window.location.href,
                totalLandArea: this.totalLandArea,
                projectCategory: this.projectCategory,
                paymentFor: 'project'
            };
            this.rest.makeAxisPayment(data).subscribe((res: any) => {
                if (res.success) {
                    this.makeAxisFormAndSubmit(res.response);
                }
            });
        } else {
            const data = {
                OrderId: orderId,
                amount: amount,
                currencyName: currencyName,
                Remarks: Remarks,
                meTransReqType: meTransReqType,
                mid: mid,
                userid: this.common.getUserId(),
                projectid: this.projectId,
                reraid: this.common.getReraId(),
                returnurl: window.location.href,
                totalLandArea: this.totalLandArea,
                projectCategory: this.projectCategory,
                paymentFor: 'project'
            };
            this.rest.makePayment(data).subscribe((res: any) => {
                if (res.success) {
                    // console.log('res.response >>>> ', JSON.stringify(res.response));
                    // this.merchantRequest = res.response;
                    this.makeFormAndSubmit(res.response, mid);
                }
            });
        }
    }

    makeAxisFormAndSubmit (resp: any) {
        const form = document.createElement('form');
        form.setAttribute('name', 'txnSubmitFrm');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', 'https://uat-etendering.axisbank.co.in/easypay2.0/frontend/index.php/api/payment');
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute("name", 'i');
        hiddenField.setAttribute('value', resp);
        form.appendChild(hiddenField);
        const btn = document.createElement('button');
        btn.setAttribute('type', 'submit');
        btn.id='psubmitbtn';
        // btn.innerText='Make payment';
        form.appendChild(btn);
        document.body.appendChild(form);
        btn.click();
    }

    makeFormAndSubmit(merchantRequest: any, mid: string): any {
        const form = document.createElement('form');
        form.setAttribute('name', 'txnSubmitFrm');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', 'https://cgt.in.worldline.com/ipg/doMEPayRequest');
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute("name", 'merchantRequest');
        hiddenField.setAttribute('value', merchantRequest);
        form.appendChild(hiddenField);
        const hiddenField2 = document.createElement('input');
        hiddenField2.setAttribute('type', 'hidden');
        hiddenField2.setAttribute("name", 'MID');
        hiddenField2.setAttribute('value', mid);
        form.appendChild(hiddenField2);
        const btn = document.createElement('button');
        btn.setAttribute('type', 'submit');
        btn.id='psubmitbtn';
        // btn.innerText='Make payment';
        form.appendChild(btn);
        document.body.appendChild(form);
        btn.click();
    }

    randomFromTo(from: number, to: number) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    onFocusElement(step: string, fieldDtl: any, type: string, j: number = -1, k = 1): any {
    }

    onChangeMultiSelect(step: string, obj: any, type: string, pos: number) {
        // console.log('value  >>> ', obj.fieldvalue);
    }

    calculateTotalTotalShare(): void {
        let totalShare = 0;
        let step = 'Land Details';
        for (const d of this.formDetails[step]) {
            if (d.groupid !== undefined && d.groupid === 47) {
                for (const lobj of d.fielddetails) {
                    for (const l1obj of lobj['Landowners'][0].fielddetails) {
                        totalShare += Number(l1obj['share_of_Landowner_in_the_Project'][0].fieldvalue);
                    }
                }
                break;
            }
        }
        const promoterShare = 100 - totalShare;
        const element: any = <HTMLInputElement>document.getElementById('Land_Owner_s_Share');
        if (element) {
            element.value = totalShare + '';
            this.saveCalculatedElem(element.dataset.fieldid, 0, 1, totalShare, 'Land_Owner_s_Share', -1, element.dataset.stepid, 'single');
            element.disabled = true;
        }
        const element1: any = <HTMLInputElement>document.getElementById('Promoter_Share');
        if (element1) {
            element1.value = promoterShare + '';
            this.saveCalculatedElem(element1.dataset.fieldid, 0, 1, promoterShare, 'Promoter_Share', -1, element1.dataset.stepid, 'single');
            element1.disabled = true;
        }
    }

    signatureUpload() {
        const elem = <HTMLButtonElement>document.getElementById('signatureupl');
        if (elem) {
            elem.click();
            elem.addEventListener('change', (event: any) => {
                if (event.target.files.length > 0) {
                    const fd = new FormData();
                    fd.append('projectid', this.projectId + '');
                    fd.append('file', event.target.files[0]);
                    this.rest.uploadSignature(fd).subscribe((res: any) => {
                        if (res.success) {
                            this.signatureImg = this.rest.FILE_ROOT + res.response.fileName;
                        } else {
                            this.notifier.notify('error', res.message);
                        }
                    })
                }
            });
        }
    }

    saveCalculatedElem(fieldid: number, groupid: number, fieldType: number, value: any, fielddesc: string, position: any, stepid: number, type = 'group', fieldGroupId: any = null, fieldGroupPos: number = -1,): any {
        let data: any = {};
        if (type === 'single') {
            data = {
                tempid: '',
                stepid: stepid,
                fielddetails: {
                    fieldid: fieldid,
                    fieldtype: fieldType,
                    fieldvalue: value + '',
                    fielddesc: fielddesc,
                    projectuniqueid: 0,
                },
                internal: true
            };
        } else {
            data = {
                fieldid: fieldid,
                tempid: '',
                fieldtype: fieldType,
                fieldvalue: value + '',
                fielddesc: fielddesc,
                projectuniqueid: 0,
                internal: true

            };
        }
        this.onBlurElement(data, groupid, {}, position, stepid);
    }

    disableCalculatedFieldInLandDetails(step: string) {
        const PromoterShare = <HTMLInputElement>document.getElementById('Promoter_Share');
        if (PromoterShare) {
            PromoterShare.disabled = true;
        }
        const LandOwnersShare = <HTMLInputElement>document.getElementById('Land_Owner_s_Share');
        if (LandOwnersShare) {
            LandOwnersShare.disabled = true;
        }
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

    getFinancialYearList(step: string): any {
        this.rest.getFinancialYearList({projectid: this.projectId, userid: this.common.getUserId()}).subscribe((res: any) => {
            if (res.success) {
                this.financialYearList = res.response.dateList;
                for(const d of this.formDetails[step]) {
                    if (d.groupid && d.groupid === 20) {
                        for (const obj of d.fielddetails) {
                            obj['Financial_Year'][0].controlvalue = this.financialYearList.join('|');
                        }
                        break;
                    }
                }
            }
        });
    }

    openLink(file: any) {
        window.open(this.FILE_ROOT + file, '_blank');
    }

    getCategoryWiseBuildingType(): any {
        for (const obj of this.categoryWiseBuildingType) {
            if (obj.category === this.projectCategory) {
                return obj.buildingType;
            }
        }
        return '';
    }

    reArrangeFieldsByLandType(step: string) {
        for (const d of this.formDetails[step]) {
            if (d.groupid !== undefined && d.groupid === 47) {
                for (const [j, lobj] of d.fielddetails.entries()) {
                    for (const [c, l1obj] of lobj['Landowners'][0].fielddetails.entries()) {
                        this.onRadioButtonChangeInFieldGroup(d, step, l1obj['Type_of_Land_radio'][0], j, c, 'Landowners');
                    }
                }
                break;
            }
        }
    }


    previewDetails() {
        this.common.totalAmount=this.totalAmount
        this.common.isPreventRegistration=this.isPreventRegistration
        this.common.isDataBlank =this.isDataBlank
        this.common.totalLandArea = this.totalLandArea
        this.common.isAccept = this.isAccept
        this.router.navigate(['/pages/preview-project'])
    }
}
