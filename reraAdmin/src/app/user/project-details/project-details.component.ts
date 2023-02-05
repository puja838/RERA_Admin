import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {ConfigService} from "../../services/config.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit, OnChanges {

    formDetails: any;
    stepList: any = [];
    stepListShow: any = [];
    backupDetails: any;
    selectedTabIndex = 0;
    @Input() projectId = 0;
    entityTypeId = 1;
    isComplete = 1;
    ignoreCheckType = [7, 8, 10, 11, 13];
    name = '';
    verificationsFields: any = [];
    isDisabled = true;
    FILE_ROOT = this.config.FILE_ROOT;
    @Input() entityid = 1;
    @Input() entitytypeid = 0;
    totalLandArea = 0;
    projectCategory = '';
    totalAmount = 0;
    @ViewChild('confirmSubmitModal') confirmSubmitModal: any;
    stateName: any = [];
    stateList: any = [];
    cityName: any = [];
    projectStatus = '';
    phaseStatus: any;
    stepDesc: any;
    isDataBlank: boolean = false;
    isPaymentComplete = false;
    totalPastProject = 0;
    projectuid: any = '';
    stepListBackup: any = [];
    @Input() userId = 0;
    isAccept = true;
    signatureImg = 'assets/images/net-bank.png';
    paymentAmount = 0;
    constructor(private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
                private modalService: NgbModal, private notifier: NotifierService, private config: ConfigService, private router: Router) {
    }

    ngOnInit(): void {
        // this.userId = this.common.getUserId();
        // this.name = this.common.getUserName();
        // this.projectId = Number(this.activeRoute.snapshot.paramMap.get('id'));
        // this.isComplete = Number(this.activeRoute.snapshot.paramMap.get('isComplete'));
        // this.projectuid = this.activeRoute.snapshot.paramMap.get('projectuid');
        this.common.loaderStart();
        if (this.projectId !== 0) {
            // this.getFormInfo();
        }
    }

    logout() {
        sessionStorage.clear();
        this.router.navigate(['/']);
    }

    ngOnChanges(): void {
        if (this.projectId !== 0 && this.entitytypeid !== 0) {
            this.getFormInfo();
        }
    }

    onClickDocument(fileName: string): void {
        window.open(this.FILE_ROOT + fileName, '_blank');
    }

    goToProfile() {
        this.router.navigate(['/pages/profile-details'])
    }

    getState() {
        const data = {
            reraid: this.common.getReraId()
        }
        this.rest.getState(data).subscribe((res: any) => {
            if (res.success) {
                this.stateList = res.response
                for (let i = 0; i < res.response.length; i++) {
                    this.stateName.push(res.response[i].statename, '|');
                }
                this.stateName.splice(-1)
                this.stateName.unshift('Select State|');
            }
        });

    }

    getDistricts(data: any, dtl: any, flag: string, groupPosition: number = -1) {
        const dist = {
            stateid: data
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
            if (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) || event.keyCode == 8 || event.keyCode == 190) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    async getCashListByProject(projectRegNo: string, obj: any) {
        return new Promise((resolve, reject) => {
            try {
                this.rest.getCaseByProject({projectRegNo: projectRegNo}).subscribe((res: any) => {
                    if (res.success) {
                        if (obj['RERA Filed Cases']) {
                            obj['RERA Filed Cases'][0].fielddetails[0]['Total_No_of_Cases'][0].fieldvalue = res.details.totalCaseFiles;
                            obj['RERA Filed Cases'][0].fielddetails[0]['No_of_Open_Cases'][0].fieldvalue = res.details.Open_Case;
                            obj['RERA Filed Cases'][0].fielddetails[0]['No_of_Disposed_Case'][0].fieldvalue = res.details.Disposed_Cases;
                            obj['RERA Filed Cases'][0].fielddetails[0]['No_of_Cases_Under_Execution'][0].fieldvalue = res.details.Cases_Under_Execution;
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
            try {
                // projectRegNo = '4gpw5rzl4qpoda6';
                const finalDetailsArr: any = [];
                const finalKeyArr: any = [];
                this.rest.getPastProjectOutsideCaseDtl({projectid: projectid}).subscribe((res: any) => {
                    if (res.success && res.response) {
                        // console.log(JSON.stringify(res.response))
                        for (const pos of Object.keys(res.response)) {
                            const fieldDetails = JSON.parse(JSON.stringify(obj['Is there any Cases?'][0].fielddetails[0]));
                            const fieldKeys = JSON.parse(JSON.stringify(obj['Is there any Cases?'][0].fielddetailskeys[0]));
                            finalKeyArr.push(fieldKeys);
                            for (const d of res.response[pos]) {
                                if (fieldDetails[d.fielddesc]) {
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

    getPastProjects(step: any) {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId(),
            projectid: this.projectId
        };
        this.rest.getPastProjects(data).subscribe(async (res: any) => {
            if (res.success) {
                this.isDataBlank = false;
                if (this.backupDetails[step].length > 0) {
                    for (let t = 0; t < this.backupDetails[step].length; t++) {
                        if (this.backupDetails[step][t].groupid === 21) {
                            if (res.response.pastproject_values !== undefined) {
                                this.isDataBlank = false;
                                this.totalPastProject = res.response.pastproject_values.length;
                                if (res.response.pastproject_values.length > 0) {
                                    const storeFieldDetailsKeys = JSON.parse(JSON.stringify(this.backupDetails[step][t].fielddetailskeys[0]));
                                    let defaultFieldKeysArray = [];
                                    const storeFieldDetails = JSON.parse(JSON.stringify(this.backupDetails[step][t].fielddetails[0]));
                                    let defaultFieldDetails = JSON.parse(JSON.stringify(storeFieldDetails));
                                    let defaultFieldDetailsArray = [];
                                    let defaultLandDetailsValues = JSON.parse(JSON.stringify(storeFieldDetails["Land Details"][0].fielddetails[0]));
                                    let defaultLandDetailsValuesArray = JSON.parse(JSON.stringify(defaultLandDetailsValues));
                                    if (res.response.pastproject_values.length > 0) {
                                        this.backupDetails[step][t].fielddetailskeys = [];
                                        this.backupDetails[step][t].fielddetails = [];
                                        const field_values = res.response.pastproject_values;
                                        const field_keys = res.response.pastproject_keys;
                                        for (let i = 0; i < field_values.length; i++) {
                                            defaultFieldKeysArray.push(storeFieldDetailsKeys);
                                            for (let j = 0; j < field_keys.length; j++) {
                                                if (field_keys[j] == "Land Details") {
                                                    const landdetails_values = JSON.parse(JSON.stringify(field_values[i]["Land Details"]));
                                                    // console.log(JSON.stringify(landdetails_values))
                                                    // console.log(JSON.stringify(defaultFieldDetails["Land Details"]))
                                                    const landdetails_keys = defaultFieldDetails["Land Details"][0].fielddetailskeys[0];
                                                    const landdetailsKeys = [];
                                                    const defaultLandDetailsArray = [];
                                                    if (landdetails_values.length > 0) {
                                                        for (let p = 0; p < landdetails_values.length; p++) {
                                                            landdetailsKeys.push(landdetails_keys);
                                                            for (let q = 0; q < landdetails_keys.length; q++) {
                                                                if (defaultLandDetailsValuesArray[landdetails_keys[q]] !== undefined) {
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
                                                    if (defaultFieldDetails[field_keys[j]] !== undefined) {
                                                        defaultFieldDetails[field_keys[j]][0].fieldvalue = field_values[i][field_keys[j]];
                                                    }
                                                }
                                                /*if (defaultFieldDetails[field_keys[j]]) {
                                                    console.log(field_keys[j]);
                                                    console.log(JSON.stringify(defaultFieldDetails[field_keys[j]][0]));
                                                }*/
                                            }
                                            // console.log('3333333333333333333333333')
                                            defaultFieldDetails = await this.getCashListByProject(field_values[i].projectRegNo, defaultFieldDetails);
                                            // console.log('777777777777777777777')
                                            if (defaultFieldDetails['Is there any Cases?']) {
                                                defaultFieldDetails['Is there any Cases?'][0].projectid = field_values[i]['projectid']
                                                defaultFieldDetails = await this.getPastProjectOutsideCaseDtl(field_values[i].projectid, defaultFieldDetails);
                                            }
                                            defaultFieldDetailsArray.push(JSON.parse(JSON.stringify(defaultFieldDetails)));
                                            defaultFieldDetails = JSON.parse(JSON.stringify(storeFieldDetails));
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
    }

    getFormInfo() {
        let distField: any
        const data = {
            reraid: this.common.getReraId(),
            entityid: this.entityid,
            entitytypeid: this.entitytypeid,
            projectid: this.projectId,
            iscomplete: this.isComplete,
          userid:this.common.getUserId()
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
                                        // console.log('obj >>>>>>>>>> ', JSON.stringify(obj));
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
                                                    // console.log(fieldDetailsArr)
                                                    const groupData = this.common.groupBy(fieldDetailsArr, 'rowname');
                                                    const keyData = Object.keys(groupData);
                                                    field[key][0].fielddetails = {
                                                        keys: keyData,
                                                        details: groupData
                                                    }
                                                }
                                                if (field[key][0].parentfieldid !== null) {
                                                    // console.log(JSON.stringify(field[key][0]))
                                                    const isMatch = this.checkParentFieldValue(field, obj.fielddetailskeys[index], field[key][0].parentfieldid, field[key][0].parentfieldvalue);
                                                    if (!isMatch) {
                                                        obj.fielddetailskeys[index].splice(i, 1);
                                                        delete field[key];
                                                        i--;
                                                    }
                                                }
                                                if (step === 'Land Details' && key === 'Select_Development_Agreement') {
                                                    // console.log(JSON.stringify(field));
                                                    if (field[key] !== undefined) {
                                                        this.onFocusElement(step, field[key][0], 'group', index, 0);
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
                                else if (obj.fielddetails.fielddesc === 'Phase_Wise') {
                                    this.phaseStatus = obj.fielddetails.fieldvalue;
                                    this.stepDesc = obj.stepdesc;
                                } else if (obj.fielddetails.fieldid === 687) {
                                    obj.fieldwidth = 6;
                                }
                                // else if (obj.fielddetails.fielddesc === 'Registration_applied_for_which_phase'){
                                //     this.checkAreaPhase(obj.fielddetails.fieldvalue)
                                // }
                            }
                        }
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
                // setTimeout(() => {
                //     this.checkDelayedStatus();
                //     this.checkAreaPhase();
                // }, 2000)
                // console.log(JSON.stringify(this.formDetails['Declaration']))
            }
        }, (err: any) => {
        })
    }

    checkParentFieldValue(field: any, keys: any, parentFieldId: number, parentValue: any): any {
        let flag = 0;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (field[key][0].fieldid === parentFieldId && this.common.checkParentFieldValue(parentValue, field[key][0].fieldvalue, 1)) {
                flag = 1;
                return true;
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

    addMoreBtn(obj: any, grouppos: any, stepId: any, groupId: any, pos: number = -1) {
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
        this.addFieldDetails(obj, stepId, groupId, grouppos);
    }

    addFieldDetails(obj: any, stepId: any, groupId: any, grouppos: any) {
        const data = {
            reraid: this.common.getReraId(),
            obj: obj,
            stepid: stepId,
            groupid: groupId,
            groupposition: grouppos + '',
            projectid: this.projectId
        };
        this.common.loaderStart();
        this.rest.addAllFieldDetails(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                // console.log("\n RESPONSE ------------    ", res);
                // this.notifier.notify('success', res.message);
            } else {
                this.notifier.notify('error', res.message);
            }
        });
    }


    removeItemBtn(obj: any, pos: number, fieldGroup: any = {}, fieldGroupPos: number = 0): any {
        const data = {
            projectid: this.projectId,
            groupid: obj.groupid,
            position: pos,
            fieldgroupid: fieldGroup.fieldgroupid ? fieldGroup.fieldgroupid : '0',
            fieldgrouppos: fieldGroupPos,
            iscomplete: this.isComplete,
            userid: this.common.getUserId()
        };
        /*this.rest.deleteProjectTemp(data).subscribe((res: any) => {
            if (fieldGroup.fieldgroupid) {
                fieldGroup.fielddetails.splice(fieldGroupPos, 1);
            } else {
                obj.fielddetails.splice(pos, 1);
            }
        }, (err: any) => {
        });*/
        // obj.fielddetails.splice(pos, 1);
    }

    removeParentFieldNotMatch(step: string, parentItem: any = {}): void {
        for (const obj of this.formDetails[step]) {
            if (obj.groupid !== null) {
                for (const [index, field] of obj.fielddetails.entries()) {
                    for (let i = 0; i < obj.fielddetailskeys[index].length; i++) {
                        const key = obj.fielddetailskeys[index][i];
                        if (field[key][0].parentfieldid !== null && field[key][0].parentfieldid === parentItem.fieldid
                            && this.common.checkParentFieldValue(field[key][0].parentfieldvalue, parentItem.fieldvalue, 0)) {
                            obj.fielddetailskeys[index].splice(i, 1);
                            delete field[key];
                            i--;
                        }
                    }
                }
            }
        }
    }


    onRadioButtonChange(obj: any, step: string, parentItem: any = {}, flag = 'single', groupPosition = 0): void {
        if (flag === 'group') {
            this.removeParentFieldNotMatch(step, parentItem);
            for (const [i, d] of this.backupDetails[step].entries()) {
                if (d.groupid !== null) {
                    let flag = 0;
                    for (const [index, field] of d.fielddetails.entries()) {
                        for (let j = 0; j < d.fielddetailskeys[index].length; j++) {
                            const key = d.fielddetailskeys[index][j];
                            // console.log(field[key][0]);
                            if (field[key][0].parentfieldid !== null && field[key][0].parentfieldid === parentItem.fieldid
                                && this.common.checkParentFieldValue(field[key][0].parentfieldvalue, parentItem.fieldvalue, 1)) {
                                flag = 1;
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
                                obj.fielddetails[groupPosition][key] = field[key];
                                if (!obj.fielddetailskeys[groupPosition].includes(key)) {
                                    obj.fielddetailskeys[groupPosition].push(key);
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
                }

            }
        } else if (desc === 'Project_being_registered') {
            this.projectStatus = obj.fielddetails.fieldvalue;
            this.checkDelayedStatus();
        } else if (desc === 'Phase_Wise') {
            this.phaseStatus = obj.fielddetails.fieldvalue;
            setTimeout(() => {
                this.checkAreaPhase();
            }, 1000)
        } else if (desc === 'Project_Category') {
            this.projectCategory = obj.fielddetails.fieldvalue;
            this.adjustStepList(this.projectCategory);
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
            if (this.phaseStatus === 'Yes' && cmpDate !== '' && cmpDate !== '0') {
                this.toggleElement('Area_of_Phase', 1);
                this.toggleElement('label_Area_of_Phase', 1);
                if (elem1) {
                    elem1.innerText = "Area of Phase" + " " + cmpDate;
                }

            } else if (this.phaseStatus === 'Yes' && cmpDate === '') {
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
        // console.log(JSON.stringify(stepDtl))
        if (Array.isArray(stepDtl)) {
            for (const obj of stepDtl) {
                if (obj.isrequired === 1) {
                    if (!Array.isArray(obj.fielddetails)) {
                        if (!this.ignoreCheckType.includes(obj.fielddetails.controltype) && obj.fielddetails.fieldvalue === '') {
                            this.notifier.notify('error', 'All * mark fields are mandatory');
                            return false;
                        }
                    } else {
                        for (const d of obj.fielddetails) {
                            for (const key of Object.keys(d)) {
                                if (d[key][0].isrequired === 1 && !this.ignoreCheckType.includes(d[key][0].controltype) && d[key][0].fieldvalue === '') {
                                    this.notifier.notify('error', 'All * mark fields are mandatory');
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            for (const key of stepDtl.keys) {
                for (const d of stepDtl.details[key]) {
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
        if (this.stepListShow[this.selectedTabIndex - 1] === 'Payment') {
            if (this.paymentAmount !== null && this.paymentAmount !== 0) {
                this.totalAmount = this.paymentAmount;
            } else {
                this.paymentCalculation();
            }
        } else if (this.stepListShow[this.selectedTabIndex - 1] === this.stepDesc) {
            const elem: any = document.getElementById('Phase_Wise')
            const elem1: any = document.getElementById('Project_Completion_Date')
            if (elem) {
                this.checkAreaPhase();
            }
            if (elem1) {
                this.checkDelayedStatus()
            }
        } else if (this.stepListShow[this.selectedTabIndex - 1] === 'Past Projects') {
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

    calculateDesimelToSqm(desc: string, pos: number, fieldValue: number) {
        const element = <HTMLInputElement>document.getElementById('Plot_Area_in_sqm_' + pos);
        if (element) {
            element.value = (Number(fieldValue) * 40.464831) + '';
            // element.focus();
            const data = {
                fieldid: 849,
                tempid: '',
                fieldtype: 1,
                fieldvalue: (Number(fieldValue) * 40.464831) + '',
                fielddesc: 'Plot_Area_in_sqm',
                projectuniqueid: 0

            };
            this.onBlurElement(data, 30, {}, pos, 6);
        }
    }

    onBlurElement(obj: any, groupid = 0, event: any = {}, pos: number = -1, stepId = 0, fieldGroupId: any = null, fieldGroupPos: number = -1) {
        stepId = groupid === 0 ? obj.stepid : stepId;
        const fieldtype = groupid === 0 ? obj.fielddetails.fieldtype : obj.fieldtype;
        const fieldValue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        const fielddesc = groupid === 0 ? obj.fielddetails.fielddesc : obj.fielddesc;
        // console.log(">>>>..........",fieldValue)
        let isvalid = true;
        if (fielddesc === 'Contact_No') {
            isvalid = this.common.validMobile(obj, groupid);
            if (!isvalid) {
                obj.valideerr = 'Invalid Contact Number';
            } else {
                obj.valideerr = '';
            }
        } else if (fielddesc === 'Project_Completion_Date') {
            this.checkDelayedStatus();
        } else if (fielddesc === 'Registration_applied_for_which_phase') {
            this.checkAreaPhase();
        } else if (fielddesc.indexOf('Area_of_the_Land_in_Decimal') > -1) {
            this.calculateDesimelToSqm('Area_of_the_Land_in_Decimal', pos, fieldValue);
        }
        const isuniqueid = groupid === 0 ? obj.fielddetails.projectuniqueid : obj.projectuniqueid;
        const fd = new FormData();
        fd.append('userid', this.common.getUserId());
        fd.append('reraid', this.common.getReraId());
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
        if (fieldtype == 5) {
            fd.append('file', event.target.files[0]);
        }
        if (fielddesc === 'Total_Land_Area' || fielddesc === 'Total_area_of_the_Project') {
            this.totalLandArea = fieldValue === '' ? 0 : Number(fieldValue);
        } else if (fielddesc === 'Project_Category') {
            this.projectCategory = fieldValue;
        }
        if (isvalid === true) {
            /*this.rest.storeTemp(fd).subscribe((res: any) => {
                if (res.success) {
                    obj.tempid = res.response.tempid;
                    if (fieldtype == 5 && groupid == 0) {
                        obj.fielddetails.fieldvalue = res.response.value;
                    } else if (fieldtype == 5 && groupid == 1) {
                        obj.fieldvalue = res.response.value;
                    }
                }
            });*/
        }
    }


    submitForm() {
        this.modalService.open(this.confirmSubmitModal, {centered: true})
    }

    confirmSubmit() {
        const data = {
            userid: this.common.getUserId(),
            reraid: this.common.getReraId(),
            entityid: this.common.getEntityId(),
            entitytypeid: this.entityTypeId,
            projectid: this.projectId
        };
        // this.common.loaderStart();
        /*this.rest.submitProject(data).subscribe((res: any) => {
            if (res.success) {
                this.moveWorkflow();
                this.closeModal();
                this.common.loaderEnd();
                this.router.navigate(['/pages/project-dashboard']);
                this.notifier.notify('success', res.message);
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err: any) => {
        });*/
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
            userid: this.common.getUserId()
        };
        /*this.rest.moveWorkflow(data).subscribe((res: any) => {
            if (res.success) {
            }
        });*/
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
                        this.common.loaderStart();
                        /*this.rest.verifyIFSC(data).subscribe((res: any) => {
                            this.common.loaderEnd();
                            if (res.success) {
                                this.notifier.notify('success', res.message);

                            } else {
                                this.notifier.notify('error', res.message);
                            }
                        });*/
                    } else {
                        this.notifier.notify('error', 'Please enter IFSC Number and Account Number.');
                    }
                } else {
                    this.notifier.notify('error', 'Please enter IFSC Number and Account Number.');
                }
            } else {
                this.notifier.notify('error', 'Account Number and Confirm Account Number not matched.');
            }
        }
    }


    openGoogleMaps() {
        let long: any = '';
        try {
            long = (<HTMLElement>document.getElementById('Geo_Location_Lon')).innerText;
        } catch {
            if (long === undefined || long === null || long === '') {
                try {
                    long = (<HTMLElement>document.getElementById('Geographic_Other_Location')).innerText;
                } catch (e) {
                    long = null
                }
            }
        }
        const lat = (<HTMLElement>document.getElementById('Geographic_Location')).innerText;
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
            returnurl: window.location.href
        };
        /*this.rest.makePayment(data).subscribe((res: any) => {
            if (res.success) {
                console.log('res.response >>>> ', JSON.stringify(res.response));
                // this.merchantRequest = res.response;
                this.makeFormAndSubmit(res.response, mid);
            }
        });*/
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
        btn.id = 'psubmitbtn';
        // btn.innerText='Make payment';
        form.appendChild(btn);
        document.body.appendChild(form);
        btn.click();
    }

    randomFromTo(from: number, to: number) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    onFocusElement(step: string, fieldDtl: any, type: string, j: number = -1, flag = 1): any {
        // console.log(JSON.stringify(fieldDtl));
        if (fieldDtl.fielddesc === 'Select_Development_Agreement') {
            for (const d of this.formDetails[step]) {
                if (d.groupid !== undefined && d.groupid === 38) {
                    const range = [];
                    for (const [index, agreement] of d.fielddetails.entries()) {
                        let flag = 0;
                        for (const key of d.fielddetailskeys[0]) {
                            if (agreement[key][0].fieldvalue !== '' && agreement[key][0].fieldvalue !== null) {
                                flag = 1;
                            }
                        }
                        if (flag === 1) {
                            range.push('Agreement-' + (index + 1));
                        }
                    }
                    if (range.length === 0) {
                        if (flag === 1) {
                            this.notifier.notify('error', 'Please enter the agreement details first.');
                        }
                        fieldDtl.controlvalue = '';
                        return false;
                    }
                    fieldDtl.controlvalue = range.join('|')
                    break;
                }
            }
        }
    }

    viewFile(fileName: string): void {
        window.open(this.rest.FILE_ROOT + fileName, '_blank');
    }

}
