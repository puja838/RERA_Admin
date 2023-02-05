import {Component, OnInit, ViewChild} from '@angular/core';
import {RestApiService} from '../../services/rest-api.service';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NotifierService} from "angular-notifier";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

import * as sha512 from 'js-sha512';

declare var $: any;

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
    formDetails: any;
    stepList: any = [];
    stepListShow: any = [];
    backupDetails: any;
    selectedTabIndex = 0;
    projectId = 0;
    entityTypeId = 1;
    isComplete = 0;
    ignoreCheckType = [7, 8, 10, 11, 13];
    name = '';
    verificationsFields: any = [];
    totalLandArea = 0;
    projectCategory = '';
    totalAmount = 0;
    @ViewChild('confirmSubmitModal') confirmSubmitModal: any;
    isSubmitted = false;
    flexRadioDefault: any = '';
    projectuid: any = '';
    stateName: any = [];
    stateList: any = [];
    cityName: any = [];
    userId = this.common.getUserId();
    projectStatus = '';
    phaseStatus: any;
    stepDesc: any;
    constructor(private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
                private modalService: NgbModal, private notifier: NotifierService, private router: Router) {
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
        }
        this.getState()
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

    getSystemVerificationFields(): void {
        const data = {
            reraid: this.common.getReraId()
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
            }
        });
    }

    getFormInfo() {
        let distField: any
        const data = {
            reraid: this.common.getReraId(),
            entityid: this.common.getEntityId(),
            entitytypeid: this.common.getEntityTypeId(),
            projectid: this.projectId,
            iscomplete: this.isComplete
        };
        this.rest.getFormInfo(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                this.stepList = Object.keys(res.response);
                this.stepListShow = Object.keys(res.response);
                this.stepListShow.push('Payment');
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
                                    for (const [index, field] of obj.fielddetails.entries()) {
                                        for (let i = 0; i < obj.fielddetailskeys[index].length; i++) {
                                            const key = obj.fielddetailskeys[index][i];
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
                            } else {
                                if (obj.fielddetails.fielddesc === 'Total_Land_Area') {
                                    this.totalLandArea = obj.fielddetails.fieldvalue === '' ? 0 : Number(obj.fielddetails.fieldvalue);
                                } else if (obj.fielddetails.fielddesc === 'Project_Category') {
                                    this.projectCategory = obj.fielddetails.fieldvalue;
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
                // setTimeout(() => {
                //     this.checkDelayedStatus();
                //     this.checkAreaPhase();
                // }, 2000)
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
        for (const key of obj.fielddetailskeys[position]) {
            for (const [index, d] of data[key].entries()) {
                if (d.fieldgroupid == null) {
                    d.fieldvalue = '';
                    d.tempid = null;
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
        obj.fielddetailskeys.push(JSON.parse(JSON.stringify(obj.fielddetailskeys[position])));
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
        this.common.loaderShow();
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
        this.rest.deleteProjectTemp(data).subscribe((res: any) => {
            if (fieldGroup.fieldgroupid) {
                fieldGroup.fielddetails.splice(fieldGroupPos, 1);
            } else {
                obj.fielddetails.splice(pos, 1);
            }
        }, (err: any) => {
        });
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
        let distField
        if (flag === 'group') {
            this.removeParentFieldNotMatch(step, parentItem);
            for (const [i, d] of this.backupDetails[step].entries()) {
                if (d.groupid !== null) {
                    let flag = 0;
                    for (const [index, field] of d.fielddetails.entries()) {
                        for (let j = 0; j < d.fielddetailskeys[index].length; j++) {
                            const key = d.fielddetailskeys[index][j];
                            if (field[key][0].parentfieldid !== null && field[key][0].parentfieldid === parentItem.fieldid
                                && this.common.checkParentFieldValue(field[key][0].parentfieldvalue, parentItem.fieldvalue, 1)) {
                                flag = 1;
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
        console.log(desc)
        console.log(parentItem)
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
        } else if(desc === 'Phase_Wise') {
            this.phaseStatus = obj.fielddetails.fieldvalue;
            setTimeout(() => {
                this.checkAreaPhase();
            }, 2000)
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
                elem1.innerText = "Area of Phase" + " " + cmpDate
                
            } else if(this.phaseStatus ==='Yes' && cmpDate === ''){
                elem1.innerText = "Area of Phase"
                this.toggleElement('Area_of_Phase', 0);
                this.toggleElement('label_Area_of_Phase', 0);
            }
        } else {
            elem1.innerText = "Area of Phase";
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
        console.log(JSON.stringify(stepDtl))
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
        if (this.selectedTabIndex < (this.stepListShow.length - 1)) {
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
            this.paymentCalculation();
        } else if(this.stepListShow[this.selectedTabIndex-1]=== this.stepDesc){
            const elem : any = document.getElementById('Phase_Wise')
            const elem1 : any = document.getElementById('Project_Completion_Date')
            if(elem){
                this.checkAreaPhase();
            }
            if(elem1){
                this.checkDelayedStatus()
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
        }
        else if (fielddesc === 'Registration_applied_for_which_phase') {
            this.checkAreaPhase();
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
        if (fielddesc === 'Total_Land_Area') {
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
                    } else if (fieldtype == 5 && groupid == 1) {
                        obj.fieldvalue = res.response.value;
                    }
                }
            });
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
            userid: this.common.getUserId()
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
        }
    }


    openGoogleMaps() {
        let long: any = '';
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
        const lat = (<HTMLInputElement>document.getElementById('Geographic_Location')).value;
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

    makePayment(cartDescription: any, amount: number, txnId: any) {
        const mrctCode = 'T206030';
        // txnId = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
        txnId = "TXN_" + this.projectuid + "_" + Math.floor(1000 + Math.random() * 9000);
        // amount = 1;
        let accNo = '';
        let custID = 'WL0000000065479';
        let mobNo = this.common.getUserMobile();
        let email = this.common.getUserEmail();
        let debitStartDate = '';
        let debitEndDate = '';
        let maxAmount = '';
        let amountType = '';
        let frequency = '';
        let cardNumber = '';
        let expMonth = '';
        let expYear = '';
        let cvvCode = '';
        let SALT = '3976262521OAOQBJ';
        cartDescription = 'Cart Description';

        const datastring = mrctCode + '|' + txnId + '|' + amount + '|'
            + accNo + '|' + custID + '|' + mobNo + '|' + email + '|' + debitStartDate + '|'
            + debitEndDate + '|' + maxAmount + '|' + amountType + '|' + frequency + '|'
            + cardNumber + '|' + expMonth + '|' + expYear + '|' + cvvCode + '|' + SALT;

        const hashValue = sha512.sha512(datastring);


        const configJson = {
            'tarCall': false,
            'features': {
                'showPGResponseMsg': true,
                'enableAbortResponse': true,
                'enableExpressPay': true,
                'enableNewWindowFlow': true,    //for hybrid applications please disable this by passing false
                'enableMerTxnDetails': true,

                'enableInstrumentDeRegistration': false,  //if unique customer identifier is passed then option to delete saved card by end customer
                'siDetailsAtMerchantEnd': false,
                'enableSI': false,
                'hideSIDetails': false,
                'enableDebitDay': false,
                'expandSIDetails': false,
                'enableTxnForNonSICards': false,
                'showSIConfirmation': false,
                'showSIResponseMsg': false,

            },
            'consumerData': {
                'deviceId': 'WEBSH2',	//possible values 'WEBSH1', 'WEBSH2' and 'WEBMD5'
                //'token': 'ca25c3ecb179f82d06059d693b6ad4ad901671ea09e1bdec318d908cead1ed1eab3ca1265e833f98614ef92691d125d9d6eb92599e900c20eb593e95afbeedc5',
                'token': hashValue,
                'returnUrl': '',
                //'SALT': SALT,
                'responseHandler': this.handleResponse,
                'paymentMode': 'all', //all, cards
                'merchantLogoUrl': 'https://www.paynimo.com/CompanyDocs/company-logo-md.png',  //provided merchant logo will be displayed
                'merchantId': mrctCode,
                'mrctCode': mrctCode,
                'currency': 'INR',
                'consumerId': custID,
                'custID': custID,
                'scheme': 'test',
                'consumerMobileNo': mobNo,
                'consumerEmailId': email,
                'txnId': txnId,   //Unique merchant transaction ID
                'items': [{
                    'itemId': 'test',
                    'amount': amount,
                    'comAmt': '0'
                }],
                'customStyle': {
                    'PRIMARY_COLOR_CODE': '#3977b7',   //merchant primary color code
                    'SECONDARY_COLOR_CODE': '#FFFFFF',   //provide merchant's suitable color code
                    'BUTTON_COLOR_CODE_1': '#1969bb',   //merchant's button background color code
                    'BUTTON_COLOR_CODE_2': '#FFFFFF'   //provide merchant's suitable color code for button text
                },
                'accountType': '',  //Required for eNACH registration this is mandatory field
                'debitStartDate': debitStartDate,
                'debitEndDate': debitEndDate,
                'maxAmount': maxAmount,
                'amountType': amountType,
                'frequency': frequency,
                'cartDescription': cartDescription
            }
        };
        $.pnCheckout(configJson);
    }


}
