import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from "../../../services/rest-api.service";
import { CommonService } from "../../../services/common.service";
import { ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-profile-details',
    templateUrl: './profile-details.component.html',
    styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
    formDetails: any;
    stepList: any = [];
    stepListShow: any = [];
    backupDetails: any;
    selectedTabIndex = 0;
    projectId = 0;
    entityTypeId = 1;
    isComplete = 0;
    ignoreCheckType = [7, 8, 10, 11, 13];
    page = '';
    timerIdForAadhaar: any;
    timerIdForEmail: any;
    timerIdForMobile: any;
    timerPosition: any;
    timerSequence: any;
    timerTimeLeft: any;
    timerFieldSpc: any;
    @ViewChild('confirmSubmitModal') confirmSubmitModal: any;
    isSubmitted = false;
    loginUserName = '';
    loginUserMobile = '';
    loginUserEmail = '';
    loginPan = '';
    loginUserAddress = '';
    entytyType = '';
    previousUserEmail = '';
    previousUsrMobile = '';
    isSuccess: boolean = false;
    isSuccessMob: boolean = false;
    userID = this.common.getUserId();
    aadhaarData: any;
    aadhaarData1: any = { "success": true, "status": 200, "message": "OTP verification was successful.", "response": { "status": 200, "body": { "data": { "client_id": "aadhaar_v2_UYbbVuobWqogyDauWBVm", "full_name": "Puja Dey", "aadhaar_number": "246910235189", "dob": "1996-09-09", "gender": "F", "address": { "country": "India", "dist": "Kolkata", "state": "West Bengal", "po": "", "loc": "", "vtc": "KOLKATA", "subdist": "", "street": "BAISHNABGHATA PATULI", "house": "K/157", "landmark": "PANCHSAYAR" }, "face_status": false, "face_score": -1, "zip": "700094", "profile_image": "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", "has_image": true, "email_hash": "bc851e58e60acdf871dc5e541f76c4fe5e053da1bc7bb44130265764c0ba1cdc", "mobile_hash": "57ba14abb3c9650f3de7c3960d26677550ede2cf6e1f7531ce79c145608134ce", "raw_xml": "https://aadhaar-kyc-docs.s3.amazonaws.com/ifixtechglobal/aadhaar_xml/518920220806134906540/518920220806134906540-2022-08-06-081906939843.xml?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY5K3QRM5JSHZILL3%2F20220806%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220806T081907Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=e5612ad4f477a1a78965b747303e632c3d7bed4284d5aafeddf90c323ae7e1fa", "zip_data": "https://aadhaar-kyc-docs.s3.amazonaws.com/ifixtechglobal/aadhaar_xml/518920220806134906540/518920220806134906540-2022-08-06-081906652141.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY5K3QRM5JSHZILL3%2F20220806%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220806T081907Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=81be75240f5d3228df9ec91a0d5c9c4088c37a0025c53afecc11b82300070785", "care_of": null, "share_code": "8659", "mobile_verified": false, "reference_id": "518920220806134906540", "aadhaar_pdf": null }, "status_code": 200, "success": true, "message": null, "message_code": "success" } } };
    entytyType1: any;
    cityName: any = [];
    stateList: any = [];
    stateNameList: any = [];
    stateName: any = [];
    FILE_ROOT = '';
    fileUploadToolTip = 'Maximum file size of a PDF is 5MB and for image 2MB';
    constructor(private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
        private modalService: NgbModal, private notifier: NotifierService) {
        this.FILE_ROOT = this.rest.FILE_ROOT;
    }

    ngOnInit(): void {
        this.activeRoute.queryParams.subscribe(params => {
            if (params['page']) {
                this.page = params['page'];
            }
            this.getFormInfo();
            this.getFormSubmitInfo();
            this.getState();
        });
    }

    validationValue(event: any, obj: any, groupid: number = 0): any {
        const fieldDesc = groupid === 0 ? obj.fielddetails.fielddesc : obj.fielddesc;
        const fieldvalue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        const fieldtype = groupid === 0 ? obj.fielddetails.fieldtype : obj.fieldtype;
        const myArray = fieldDesc.split("_");
        const entityType = myArray[myArray.length - 1];
        if (fieldDesc === 'Pin_Code'  || fieldDesc.indexOf("Pin_Code") > -1) {
            if (fieldvalue === '' && event.key != 8) {
                return false;
            }
            return (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && fieldvalue.length < 6) || event.keyCode == 8;
        } else if (fieldDesc === "Mobile_Number_" + entityType || fieldDesc.indexOf("Mobile_Number_" + entityType) > -1 || fieldDesc === "Alternate_Contact_No") {
            return (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && fieldvalue.length < 10) || event.keyCode == 8;
        } else if (fieldDesc === "Aadhaar_Card" || fieldDesc.indexOf("Aadhaar_Card") > -1) {
            return (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && fieldvalue.length < 12) || event.keyCode == 8;
        } else if (fieldDesc == 'PAN_No' || fieldDesc.indexOf("PAN_No") > -1) {
            return groupid === 0 ? !(obj.fielddetails.fieldvalue.length >= 10 && event.keyCode !== 8): !(obj.fieldvalue.length >= 10 && event.keyCode !== 8);
        } else if (fieldtype === 2 || fieldtype === 3) {
            if (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) || event.keyCode == 8 || event.keyCode == 190 || event.keyCode == 110) {
                return true;
            } else {
                return false;
            }
        }
    }

    getFormSubmitInfo() {
        const data = {
            reraid: this.common.getReraId(),
            userid: this.common.getUserId()
        };
        this.common.loaderShow();
        this.rest.getFormSubmitInfo(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                if (Number(res.response[0].issubmitted) === 1) {
                    this.isSubmitted = true;
                } else {
                    this.isSubmitted = false;
                }
            }
        });
    }

    getState() {
        const data = {
            reraid: this.common.getReraId()
        }
        this.rest.getState(data).subscribe((res: any) => {
            if (res.success) {
                this.stateList = res.response;
                for (let i = 0; i < res.response.length; i++) {
                    this.stateName.push(res.response[i].statename);
                }
                // this.stateName.splice(-1)
                this.stateName.unshift('Select State');
            }
        });

    }

    getDistricts(data: any, dtl: any, flag: string, groupPosition: number = -1, index: number = -1) {
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
                            if (key === 'District' || key === 'District_P'|| key.indexOf('District') > -1 || key.indexOf('District_P') > -1) {
                                field[key][0].controlvalue = this.cityName.join('');
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.formDetails[dtl].length; i++) {
                        if (this.formDetails[dtl][i].fielddetails.fielddesc === 'District' || this.formDetails[dtl][i].fielddetails.fielddesc === 'District_P'
                            || this.formDetails[dtl][i].fielddetails.fielddesc === 'District_N') {
                            this.formDetails[dtl][i].fielddetails.controlvalue = this.cityName.join('')
                        }
                    }
                }

            }
        });
    }

    getFormInfo() {
        this.common.loaderShow();
        const data = {
            reraid: this.common.getReraId(),
            entityid: this.common.getEntityId(),
            entitytypeid: this.common.getEntityTypeId(),
            userid: this.common.getUserId(),
            iscomplete: this.isComplete
        };
        console.log(JSON.stringify(data));
        
        this.rest.getProfileFormInfo(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                
                this.stepList = Object.keys(res.response);
                this.stepListShow = Object.keys(res.response);
                if (this.page === 'signup') {
                    this.stepListShow.splice(this.stepListShow.length - 2, 2);
                }
                for (const step of this.stepList) {
                    res.response[step].sort(function (a: any, b: any) {
                        return a.sequenceno - b.sequenceno
                    });
                    const details = res.response[step];
                    if (details.length > 0 && details[0].istableview == '1') {
                        const groupData = this.common.groupBy(details, 'rowname');
                        // console.log(JSON.stringify(groupData));
                        const keyData = Object.keys(groupData);
                        res.response[step] = {
                            keys: keyData,
                            details: groupData
                        }
                    }
                }
                this.formDetails = JSON.parse(JSON.stringify(res.response));
                let newObj: any = {};
                let result;
                for (const step of this.stepList) {
                    if (Array.isArray(this.formDetails[step])) {
                        newObj[step] = this.formDetails[step].filter((item: any) => !(item.parentfieldid == null))
                        this.formDetails[step] = this.formDetails[step].filter((item: any) => !(item.parentfieldid !== null));
                        for (const [index, obj] of this.formDetails[step].entries()) {
                            if (obj.groupid !== null) {
                                for (const [index, field] of obj.fielddetails.entries()) {
                                    for (let i = 0; i < obj.fielddetailskeys[index].length; i++) {
                                        const key = obj.fielddetailskeys[index][i];

                                        for (let j = 0; j < this.common.promotersType.length; j++) {
                                            result = field[key][0].fielddesc.includes(this.common.promotersType[j]);
                                            if (result === true) {
                                                const myArray = field[key][0].fielddesc.split("_");
                                                if (myArray[myArray.length - 1] === this.common.promotersType[j]) {
                                                    this.entytyType = myArray[myArray.length - 1]
                                                    this.entytyType1 = myArray[myArray.length - 1]
                                                }
                                            }
                                        }
                                        if (field[key][0].fielddesc == 'Aadhaar_Card') {
                                            if (field[key][0].isverified == 1) {
                                                this.hideOTPFieldBtns(index, -1, 'Aadhaar');
                                            } else {
                                                this.hideOTPFieldBtns(index, 1, 'Aadhaar');
                                            }
                                        }
                                        if (field[key][0].fielddesc == 'PAN_Card' || field[key][0].fielddesc == 'PAN_No') {
                                            if (field[key][0].isverified === 1) {
                                                this.hideOTPFieldBtns(index, -1, 'PAN');
                                            } else {
                                                this.hideOTPFieldBtns(index, 1, 'PAN');
                                            }
                                        }
                                        if (field[key][0].fielddesc == 'Email_ID_' + this.entytyType && !this.isSubmitted) {
                                            if (field[key][0].isverified == 1) {
                                                this.hideOTPFieldBtns(index, -1, 'Email');
                                            } else {
                                                this.hideOTPFieldBtns(index, 1, 'Email');
                                            }
                                        }
                                        if (field[key][0].fielddesc == 'Mobile_Number_' + this.entytyType  && !this.isSubmitted) {
                                            if (field[key][0].isverified == 1) {
                                                this.hideOTPFieldBtns(index, -1, 'Mobile');
                                            } else {
                                                this.hideOTPFieldBtns(index, 1, 'Mobile');
                                            }
                                        }
                                        if (field[key][0].fielddesc == 'DIN_' + index) {
                                            if (field[key][0].isverified == 1) {
                                                this.hideOTPFieldBtns(index, 1, 'DIN');
                                            } else {
                                                // this.hideOTPFieldBtns(index, 1, 'Mobile');
                                            }
                                        }
                                        // console.log(field[key][0].fielddesc);
                                        if (field[key][0].fielddesc === "State" || field[key][0].fielddesc === "State_P" || field[key][0].fielddesc === "State_N") {
                                            for (let i = 0; i < this.stateList.length; i++) {
                                                if (this.stateList[i].statename === field[key][0].fieldvalue) {
                                                    this.getDistricts(this.stateList[i].id, obj, 'group', index)
                                                }
                        
                                            }
                                        }
                                        
                                        if (field[key][0].fielddesc == 'Registered_Office_Address_Line_one' || field[key][0].fielddesc == 'Firm_Office_Address_Line_one' || field[key][0].fielddesc == 'Society_Registered_Office_Address_Line_one' || field[key][0].fielddesc == 'Firm_Registered_Office_Address_Line_one' || field[key][0].fielddesc == 'Trust_Registered_Office_Address_Line_one' || field[key][0].fielddesc == 'Cooperative_Society_Registered_Office_Address_Line_one' || field[key][0].fielddesc == 'Competent_Authority_Registered_Office_Address_Line_one') {
                                            this.loginUserAddress = field[key][0].fieldvalue
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
                            } else {
                                if (obj.fielddetails.fielddesc === "State" || obj.fielddetails.fielddesc === "State_P" || obj.fielddetails.fielddesc === "State_N") {
                                    obj.fielddetails.controlvalue = this.stateName.join('|');
                                    for (let i = 0; i < this.stateList.length; i++) {
                                        if (this.stateList[i].statename === obj.fielddetails.fieldvalue) {
                                            this.getDistricts(this.stateList[i].id, step, '', -1, index);
                                            break;
                                        }

                                    }
                                }
                                for (let j = 0; j < this.common.promotersType.length; j++) {
                                    result = obj.fielddetails.fielddesc.includes(this.common.promotersType[j]);
                                    if (result === true) {
                                        const myArray = obj.fielddetails.fielddesc.split("_");
                                        if (myArray[myArray.length - 1] === this.common.promotersType[j]) {
                                            this.entytyType = myArray[myArray.length - 1]
                                            this.entytyType1 = myArray[myArray.length - 1]
                                        }
                                    }
                                }
                                if (obj.fielddetails.fielddesc == 'Aadhaar_Card') {
                                    if (obj.fielddetails.isverified === 1) {
                                        this.hideOTPFieldBtns(-1, -1, 'Aadhaar');
                                    } else {
                                        this.hideOTPFieldBtns(-1, 1, 'Aadhaar');
                                    }
                                }
                                if (obj.fielddetails.fielddesc == 'Company_GSTIN') {
                                    if (obj.fielddetails.isverified === 1) {
                                        console.log('in if')
                                        this.hideOTPFieldBtns(-1, -1, 'GSTIN');
                                    } else {
                                        console.log('in else')
                                        // this.hideOTPFieldBtns(-1, 1, 'GSTIN');
                                    }
                                }
                                if (obj.fielddetails.fielddesc == 'PAN_Card' || obj.fielddetails.fielddesc == 'PAN_No') {
                                    if (obj.fielddetails.isverified === 1) {
                                        this.hideOTPFieldBtns(-1, -1, 'PAN');
                                    } else {
                                        this.hideOTPFieldBtns(-1, 1, 'PAN');
                                    }
                                }
                                if (obj.fielddetails.fielddesc == 'Email_ID_' + this.entytyType) {
                                    if (obj.fielddetails.isverified === 1) {
                                        this.hideOTPFieldBtns(-1, -1, 'Email');
                                    } else {
                                        this.hideOTPFieldBtns(-1, 1, 'Email');
                                    }
                                }
                                if (obj.fielddetails.fielddesc == 'Mobile_Number_' + this.entytyType) {
                                    if (obj.fielddetails.isverified === 1) {
                                        this.hideOTPFieldBtns(-1, -1, 'Mobile');
                                    } else {
                                        this.hideOTPFieldBtns(-1, 1, 'Mobile');
                                    }
                                }
                                if (obj.fielddetails.fielddesc == 'Registered_Office_Address_Line_one' || obj.fielddetails.fielddesc == 'Firm_Office_Address_Line_one' || obj.fielddetails.fielddesc == 'Society_Registered_Office_Address_Line_one' || obj.fielddetails.fielddesc == 'Firm_Registered_Office_Address_Line_one' || obj.fielddetails.fielddesc == 'Trust_Registered_Office_Address_Line_one' || obj.fielddetails.fielddesc == 'Cooperative_Society_Registered_Office_Address_Line_one' || obj.fielddetails.fielddesc == 'Competent_Authority_Registered_Office_Address_Line_one') {
                                    this.loginUserAddress = obj.fielddetails.fieldvalue
                                }

                            }
                        }

                        // console.log(JSON.stringify(this.formDetails[step]))
                    }
                }
                // console.log(JSON.stringify(newObj));
                this.backupDetails = JSON.parse(JSON.stringify(res.response));
                try {
                    for (const step of this.stepList) {
                        if (newObj[step]) {
                            for (const obj of newObj[step]) {
                                for (const item of this.backupDetails[step]) {
                                    if (obj.parentfieldid === item.fielddetails.fieldid && this.common.checkParentFieldValue(obj.parentfieldvalue, item.fielddetails.fieldvalue, 1)) {
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
                            this.formDetails[step].sort(function (a: any, b: any) {
                                return a.sequenceno - b.sequenceno
                            });
                        }
                    }
                } catch (e) {
                }
                // console.log(JSON.stringify(this.formDetails));
            }
        }, (err: any) => {
        })

        // this.CreateuserCustomize()
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

    addMoreBtn(obj: any, pos: number) {
        const data = JSON.parse(JSON.stringify(obj.fielddetails[0]));
        for (const key of obj.fielddetailskeys[pos]) {
            for (const [index, d] of data[key].entries()) {
                if (d.fieldgroupid == null) {
                    d.fieldvalue = '';
                    d.tempid = null;
                } else {
                    for (const d1 of d.fielddetails) {
                        for (const k1 of d.fielddetailskeys[0]) {
                            d1[k1][0].fieldvalue = '';
                            d1[k1][0].tempid = null;
                        }
                    }
                }
            }
        }
        obj.fielddetailskeys.push(JSON.parse(JSON.stringify(obj.fielddetailskeys[pos])));
        obj.fielddetails.push(data);
        this.hideOTPFieldBtns(obj.fielddetails.length - 1, 1, 'Aadhaar');
        this.hideOTPFieldBtns(obj.fielddetails.length - 1, 1, 'Email');
        this.hideOTPFieldBtns(obj.fielddetails.length - 1, 1, 'Mobile');
    }

    removeItemBtn(obj: any, pos: number, fieldGroup: any = {}, fieldGroupPos: number = 0): any {
        /*console.log('groupId >> ', obj.groupid, pos)
        console.log('fieldGroup >> ', fieldGroup.fieldgroupid, fieldGroupPos)*/
        const data = {
            userid: this.common.getUserId(),
            groupid: obj.groupid,
            position: pos,
            fieldgroupid: fieldGroup.fieldgroupid ? fieldGroup.fieldgroupid : '0',
            fieldgrouppos: fieldGroupPos,
            iscomplete: this.isComplete
        };
        this.rest.deleteProfileTemp(data).subscribe((res: any) => {
            if (fieldGroup.fieldgroupid) {
                fieldGroup.fielddetailskeys.splice(fieldGroupPos, 1);
                fieldGroup.fielddetails.splice(fieldGroupPos, 1);
            } else {
                obj.fielddetails.splice(pos, 1);
                obj.fielddetailskeys.splice(pos, 1);
            }
        }, (err: any) => {
        })
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
        console.log(JSON.stringify(obj));
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
                                /* for (const d1 of obj.fielddetails) {
                                   // console.log(d1);
                                 }*/
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
            let newObj: any = [];
            newObj = this.formDetails[step].filter((item: any) => (item.parentfieldid == obj.fieldid && this.common.checkParentFieldValue(item.parentfieldvalue, obj.fielddetails.fieldvalue, 0)));
            /*for(let i = 0; i < this.formDetails[step].length; i++) {
              const item = this.formDetails[step][i];
              console.log(JSON.stringify(item));
              if (item.parentfieldid == obj.fieldid && this.common.checkParentFieldValue(item.parentfieldvalue, obj.fielddetails.fieldvalue, 0)) {
                newObj.push(item);
                this.formDetails[step].splice(i, 1);
                i--;
              }
            }*/
            this.formDetails[step] = this.formDetails[step].filter((item: any) => !(item.parentfieldid == obj.fieldid && this.common.checkParentFieldValue(item.parentfieldvalue, obj.fielddetails.fieldvalue, 0)));

            for (const rmObj of newObj) {
                this.formDetails[step] = this.formDetails[step].filter((item: any) => !(item.parentfieldid !== null && item.parentfieldid == rmObj.fielddetails.fieldid));
                // console.log("1111111111 ", JSON.stringify(this.formDetails[step]))
                /*for(let i = 0; i < this.formDetails[step].length; i++) {
                  const item = this.formDetails[step][i];
                  console.log('item.parentfieldid, rmObj.fieldid', item.parentfieldid, rmObj.fieldid);
                  if (item.parentfieldid !== null && item.parentfieldid == rmObj.fieldid) {
                    this.formDetails[step].splice(i, 1);
                    i--;
                  }
                }*/
            }
            for (const d of this.backupDetails[step]) {
                if (this.common.checkParentFieldValue(d.parentfieldvalue, obj.fielddetails.fieldvalue, 1) && d.parentfieldid == obj.fielddetails.fieldid) {
                    const matchObj = JSON.parse(JSON.stringify(d));
                    this.formDetails[step].push(matchObj);
                    for (const d1 of this.backupDetails[step]) {
                        if (this.common.checkParentFieldValue(d1.parentfieldvalue, matchObj.fielddetails.fieldvalue, 1) && d1.parentfieldid == matchObj.fielddetails.fieldid) {
                            // console.log("d1 >>>>> ", JSON.stringify(d1))
                            this.formDetails[step].push(JSON.parse(JSON.stringify(d1)));
                        }
                    }
                }
            }
            this.formDetails[step].sort(function (a: any, b: any) {
                return a.sequenceno - b.sequenceno
            });
            if (obj.fielddetails.fielddesc === "State" || obj.fielddetails.fielddesc === "State_P" || obj.fielddetails.fielddesc === "State_N") {
                obj.fielddetails.controlvalue = this.stateName.join('|');
                for (let i = 0; i < this.stateList.length; i++) {
                    if (this.stateList[i].statename === obj.fielddetails.fieldvalue) {
                        this.getDistricts(this.stateList[i].id, step, '', -1);
                        break;
                    }

                }
            }
        }
    }

    goToNext(stepDtl: any): any {
        if (Array.isArray(stepDtl)) {
            for (const obj of stepDtl) {
                if (obj.isrequired === 1) {
                    if (!Array.isArray(obj.fielddetails)) {
                        if (!this.ignoreCheckType.includes(obj.fielddetails.controltype) && obj.fielddetails.fieldvalue === '') {
                            this.notifier.notify('error', 'All * mark fields are mandatory')
                            return false;
                        }
                    } else {
                        for (const d of obj.fielddetails) {
                            for (const key of Object.keys(d)) {
                                if (!this.ignoreCheckType.includes(d[key][0].controltype) && d[key][0].fieldvalue === '') {
                                    this.notifier.notify('error', 'All * mark fields are mandatory')
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
                        this.notifier.notify('error', 'All * mark fields are mandatory')
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
    }

    onBlurElement(obj: any, groupid = 0, event: any = {}, pos: number = -1, stepId = 0, fieldGroupId: any = null, fieldGroupPos: number = -1): any {
        const fieldDesc = groupid === 0 ? obj.fielddetails.fielddesc : obj.fielddesc;
        const myArray = fieldDesc.split('_');
        for (let j = 0; j < this.common.promotersType.length; j++) {
            if (myArray[myArray.length - 1] === this.common.promotersType[j]) {
                this.entytyType = myArray[myArray.length - 1]
            }
        }

        // console.log(fieldDesc)
        let isvalid = true;
        if (fieldDesc === "Aadhaar_Card") {
            isvalid = this.common.validAdhar(obj, groupid);
            if (!isvalid) {
                obj.validErr = "Sorry, Invalid Aadhaar no.";
                return false
            } else {
                obj.validErr = ""
            }
        }
        if (fieldDesc === "PAN_Card") {
            isvalid = this.common.validPAN(obj, groupid);
            if (!isvalid) {
                obj.validErr = "Sorry, Invalid PAN no.";
                return false;
            } else {
                obj.validErr = ""
            }
        }
        // console.log(fieldDesc, pos)
        if (fieldDesc == "Name" || fieldDesc == "Name_" + pos) {
            let fieldvalue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
            // console.log(">>>", fieldvalue)
            fieldvalue = fieldvalue.toUpperCase()
        }

        if (fieldDesc == "Name_of_Proprietorme" || fieldDesc == "Name_of_Proprietorme_" + pos) {
            let fieldvalue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
            fieldvalue = fieldvalue.toUpperCase()
        }

        if (fieldDesc === "PAN_No") {
            isvalid = this.common.validPAN(obj, groupid);
            if (!isvalid) {
                obj.validErr = "Sorry, Invalid PAN no.";
                return false;
            } else {
                obj.validErr = ""
            }
        }
        if (fieldDesc === "Email_ID_" + this.entytyType) {
            isvalid = this.common.ValidateEmail(obj, groupid);
            if (!isvalid) {
                obj.validErr = "Invalid Email Address";
                return false
            } else {
                obj.validErr = ""
            }
            let fieldvalue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
            this.check(fieldvalue, pos, 'E')
        }
        if (fieldDesc === "Mobile_Number_" + this.entytyType) {
            isvalid = this.common.validMobile(obj, groupid);
            if (!isvalid) {
                obj.validErr = "Invalid Mobile Number";
                return false
            } else {
                obj.validErr = ""
            }
            let fieldvalue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
            this.check(fieldvalue, pos, 'M')
        }

        stepId = groupid === 0 ? obj.stepid : stepId;
        const controlType = groupid === 0 ? obj.fielddetails.controltype : obj.controltype;
        const fieldtype = groupid === 0 ? obj.fielddetails.fieldtype : obj.fieldtype;
        if (fieldtype == 5 && event) {
            if (event.target.files.length > 0) {
                const fileSize = event.target.files[0].type.indexOf('pdf') > -1 ? 10485760 : 2097152;
                if (event.target.files[0].size > fileSize) {
                    this.notifier.notify('error', 'File size limit exceeds.');
                    return false;
                }
            }
        }
        let fieldValue = '';
        if (controlType === 12) {
            fieldValue = groupid === 0 ? obj.fielddetails.fieldvalue + '|' + obj.fielddetails.fieldvalue1 : obj.fieldvalue + '|' + obj.fieldvalue1;
        } else {
            fieldValue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        }
        const isuniqueid = groupid === 0 ? obj.fielddetails.isuniqueid : obj.isuniqueid;
        const fd = new FormData();
        fd.append('userid', this.common.getUserId());
        fd.append('reraid', this.common.getReraId());
        // fd.append('projectid', this.projectId + '');
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
        this.rest.storeProfileTemp(fd).subscribe((res: any) => {
            if (res.success) {
                obj.tempid = res.response.tempid;
                if (fieldtype == 5 && groupid == 0) {
                    obj.fielddetails.fieldvalue = res.response.value;
                } else {
                    obj.fieldvalue = res.response.value;
                }
            } else {
                this.notifier.notify('error', res.message);
            }
        });
    }

    submitForm(): any {
        const isValidate = this.checkRequiredField();
        if (!isValidate) {
            this.notifier.notify('error', 'All * mark fields are mandatory');
            return false;
        }
        this.CreateuserCustomize();
        this.modalService.open(this.confirmSubmitModal, { centered: true })
    }

    checkRequiredField(): any {
        let flag = 0;
        for (const step of this.stepList) {
            const stepDtl = this.formDetails[step];
            if (Array.isArray(stepDtl)) {
                for (const obj of stepDtl) {
                    if (obj.isrequired === 1) {
                        if (!Array.isArray(obj.fielddetails)) {
                            if (!this.ignoreCheckType.includes(obj.fielddetails.controltype) && obj.fielddetails.fieldvalue === '') {
                                // this.notifier.notify('error', 'All * mark fields are mandatory');
                                flag = 1;
                                return false;
                            }
                        } else {
                            for (const d of obj.fielddetails) {
                                for (const key of Object.keys(d)) {
                                    if (!this.ignoreCheckType.includes(d[key][0].controltype) && d[key][0].fieldvalue === '') {
                                        // this.notifier.notify('error', 'All * mark fields are mandatory');
                                        flag = 1;
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
                            console.log("d.fielddetails.fieldvalue >>>>>>> 33333 ", d.fielddetails.fieldvalue);
                            flag = 1;
                            return false;
                        }
                    }
                }
            }
        }
        return flag === 0;
    }

    confirmSubmit(): any {
        const data = {
            userid: this.common.getUserId(),
            reraid: this.common.getReraId(),
            entityid: this.common.getEntityId(),
            entitytypeid: this.common.getEntityTypeId(),
        };
        this.common.loaderShow();
        this.rest.submitProfile(data).subscribe((res: any) => {
            this.common.loaderEnd();
            this.closeModal();
            if (res.success) {
                this.isSubmitted = true;
                // this.ngOnInit();
                this.notifier.notify('success', res.message);
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err: any) => {
            this.common.loaderEnd();
            this.closeModal();
        });
    }

    closeModal(): void {
        this.modalService.dismissAll();
    }


    numberInWords(number: number) {
        return this.common.numberInWords(number + '');
    }

    onButtonClick(step: string, fieldId: string, obj: any, groupid: number = 0, groupposition: number = -1) {
        console.log("\n step==  ", step, "\n fieldId==  ", fieldId, "\n groupid==  ", groupid, "\n groupposition==  ", groupposition);
        const myArray = fieldId.split("_");
        for (let j = 0; j < this.common.promotersType.length; j++) {
            if (myArray[myArray.length - 1] === this.common.promotersType[j]) {
                this.entytyType = myArray[myArray.length - 1]
            }
        }

        let elem2: any;
        let aadhaarFieldId;
        let aadhaarStepId;
        if (groupid !== 0) {
            elem2 = document.getElementById('Aadhaar_Card_' + groupposition);
        } else {
            elem2 = document.getElementById('Aadhaar_Card');
        }
        if (elem2) {
            aadhaarFieldId = elem2.getAttribute('data-fieldID');
            aadhaarStepId = elem2.getAttribute('data-stepID');
        }
        let elem3: any;
        let emailFieldId;
        let emailStepId;
        if (groupid !== 0) {
            elem3 = document.getElementById('Email_ID_' + this.entytyType + "_" + groupposition);
        } else {
            elem3 = document.getElementById('Email_ID_' + this.entytyType);
        }
        if (elem3) {
            emailFieldId = elem3.getAttribute('data-fieldID');
            emailStepId = elem3.getAttribute('data-stepID');
        }
        let elem4: any;
        let mobileFieldId;
        let mobileStepId;
        if (groupid !== 0) {
            elem4 = document.getElementById('Mobile_Number_' + this.entytyType + "_" + groupposition);
        } else {
            elem4 = document.getElementById('Mobile_Number_' + this.entytyType);
        }
        if (elem4) {
            mobileFieldId = elem4.getAttribute('data-fieldID');
            mobileStepId = elem4.getAttribute('data-stepID');
        }

        let elem5: any;
        let panFieldId;
        let panStepId;
        if (document.getElementById('label_PAN_Card_' + groupposition) || document.getElementById('label_PAN_Card')) {
            if (groupid !== 0) {
                elem5 = document.getElementById('PAN_Card_' + groupposition);
            } else {
                elem5 = document.getElementById('PAN_Card');
            }
            if (elem5) {
                panFieldId = elem5.getAttribute('data-fieldID');
                panStepId = elem5.getAttribute('data-stepID');
            }
        } else {
            if (groupid !== 0) {
                elem5 = document.getElementById('PAN_No_' + groupposition);
            } else {
                elem5 = document.getElementById('PAN_No');
            }
            if (elem5) {
                panFieldId = elem5.getAttribute('data-fieldID');
                panStepId = elem5.getAttribute('data-stepID');
            }
        }
        if (fieldId === 'No_Of_Proj_Completed_Button') {
            const elem: any = document.getElementById('No_Of_Project_Completed');
            if (elem && elem.value !== '') {
                const totalProject = Number(elem.value);
                if (totalProject > 0) {
                    for (const obj of this.formDetails[step]) {
                        if (obj.groupid === 16) {
                            let remainingCount = totalProject - obj.fielddetails.length;
                            if (remainingCount > 0) {
                                for (let i = 0; i < remainingCount; i++) {
                                    this.addMoreBtn(obj, 0);
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
                    this.notifier.notify('error', 'Number of should be at least one.');
                }

            }
        } else if (fieldId === 'REQUEST_FOR_OTP_Adhaar' || fieldId === 'Resend_OTP_Aadhaar' || fieldId === 'Request_for_OTP_aadhar_no') {
            let elem: any;
            if (groupid !== 0) {
                elem = document.getElementById('Aadhaar_Card_' + groupposition);
            } else {
                elem = document.getElementById('Aadhaar_Card');
            }
            // let elem: any = document.getElementById('Aadhaar_Card');
            if (elem && elem.value !== '') {
                const aadhaarno = elem.value.replace(" ", "").replace(" ", "");
                if (aadhaarno !== '') {
                    const data = {
                        "reraid": this.common.getReraId(),
                        "userid": this.common.getUserId(),
                        "fieldid": Number(aadhaarFieldId),
                        "stepid": Number(aadhaarStepId),
                        "groupid": Number(groupid),
                        "groupposition": Number(groupposition),
                        "aadhaarno": aadhaarno
                    };
                    this.common.loaderShow();
                    this.rest.generateAadhaarOTP(data).subscribe((res: any) => {
                        this.common.loaderEnd()
                        if (res.success) {
                            this.notifier.notify('success', res.message);
                            elem2.setAttribute('tableID', res.response.id)
                            elem2.setAttribute('clientID', res.response.resReturn.client_id);
                            if (fieldId === 'REQUEST_FOR_OTP_Adhaar' || fieldId === 'Resend_OTP_Aadhaar') {
                                this.hideOTPFieldBtns(groupposition, 2, 'Aadhaar');
                            } else if (fieldId === 'Request_for_OTP_aadhar_no') {
                                this.hideOTPFieldBtns(groupposition, 2, 'Aadhaar');
                            }
                        } else {
                            this.notifier.notify('error', res.message);
                        }
                    });
                } else {
                    this.notifier.notify('error', 'Please enter Aadhaar Number.');
                }
            }
        } else if (fieldId === 'Verify_Aadhaar') {
            // const elem: any = document.getElementById('Enter_Aadhaar_OTP')
            let elem: any;
            if (groupid !== 0) {
                elem = document.getElementById('Enter_Aadhaar_OTP_' + groupposition);
            } else {
                elem = document.getElementById('Enter_Aadhaar_OTP');
            }
            let tableID = elem2.getAttribute('tableID');
            let aadhaarClientID = elem2.getAttribute('clientID');
            if (elem && elem.value !== '') {
                const aadhaarOTP = elem.value.replace(" ", "").replace(" ", "");
                if (aadhaarOTP !== '') {
                    const data = {
                        "id": Number(tableID),
                        "reraid": this.common.getReraId(),
                        "userid": this.common.getUserId(),
                        "fieldid": Number(aadhaarFieldId),
                        "stepid": Number(aadhaarStepId),
                        "groupid": Number(groupid),
                        "groupposition": Number(groupposition),
                        "clientid": aadhaarClientID,
                        "aadhaarOTP": aadhaarOTP,
                        "isProfile": "true"
                    };
                    this.common.loaderShow()
                    this.rest.submitAadhaarOTP(data).subscribe((res: any) => {
                        this.common.loaderEnd()
                        if (res.success) {
                            this.aadhaarData = res.response.body.data;
                            this.insertDataFromAadhaar(step, groupid, obj, groupposition)
                            if (groupid !== 0) {
                                this.hideOTPFieldBtns(groupposition, 3, 'Aadhaar');
                            } else {
                                this.hideOTPFieldBtns(groupposition, 3, 'Aadhaar');
                            }
                            this.notifier.notify('success', res.message);
                        } else {
                            this.notifier.notify('error', res.message);
                        }
                    });
                } else {
                    this.notifier.notify('error', 'Please enter OTP.');
                }
            }

        } else if (fieldId === 'Verify_Email_Id_' + this.entytyType || fieldId === 'Resend_Code_Email_' + this.entytyType) {
            let elem: any;
            if (groupid !== 0) {
                elem = document.getElementById('Email_ID_' + this.entytyType + "_" + groupposition);
            } else {
                elem = document.getElementById('Email_ID_' + this.entytyType);
            }
            
            if (elem && elem.value !== "") {
                const emailid = elem.value.replace(" ", "").replace(" ", "");
                this.previousUserEmail = emailid
                if (emailid !== '') {
                    const data = {
                        "reraid": this.common.getReraId(),
                        "userid": this.common.getUserId(),
                        "fieldid": Number(emailFieldId),
                        "stepid": Number(emailStepId),
                        "groupid": Number(groupid),
                        "groupposition": Number(groupposition),
                        "fieldvalue": emailid,
                        "isRegistration": "false",
                        "fieldtype": "Email",
                    };
                    this.common.loaderShow();
                    this.rest.generateFieldOTP(data).subscribe((res: any) => {
                        this.common.loaderEnd();
                        if (res.success) {
                            this.isSuccess = res.success
                            this.notifier.notify('success', res.message);
                            elem3.setAttribute('tableID', res.response.id)
                            elem3.setAttribute('clientID', res.response.resReturn.client_id);
                            this.hideOTPFieldBtns(groupposition, 2, 'Email');
                        } else {
                            this.notifier.notify('error', res.message);
                        }
                    });
                } else {
                    this.notifier.notify('error', 'Please enter Email ID.');
                }
            }
        } else if (fieldId === 'Verify_Code_Email_' + this.entytyType) {
            let elem: any;
            if (groupid !== 0) {
                elem = document.getElementById('Email_Verification_Code_' + this.entytyType + "_" + groupposition);
            } else {
                elem = document.getElementById('Email_Verification_Code_' + this.entytyType);
            }
            let tableID = elem3.getAttribute('tableID');
            let emailClientID = elem3.getAttribute('clientID');
            if (elem && elem.value !== '') {
                const emailOTP = elem.value.replace(" ", "").replace(" ", "");
                if (emailOTP !== '') {
                    const data = {
                        "id": Number(tableID),
                        "reraid": this.common.getReraId(),
                        "userid": this.common.getUserId(),
                        "fieldid": Number(emailFieldId),
                        "stepid": Number(emailStepId),
                        "groupid": Number(groupid),
                        "groupposition": Number(groupposition),
                        "clientid": emailClientID,
                        "verifyOTP": emailOTP,
                        "isProfile": "true",
                        "isRegistration": "false",
                        "fieldtype": "Email",
                    };
                    this.common.loaderShow()
                    this.rest.submitFieldOTP(data).subscribe((res: any) => {
                        this.common.loaderEnd()
                        if (res.success) {
                            if (groupid !== 0) {
                                this.hideOTPFieldBtns(groupposition, 3, 'Email');
                            } else {
                                this.hideOTPFieldBtns(groupposition, 3, 'Email');
                            }
                            this.notifier.notify('success', res.message);
                        } else {
                            this.notifier.notify('error', res.message);
                        }
                    });
                } else {
                    this.notifier.notify('error', 'Please enter OTP.');
                }
            }
        } else if (fieldId === 'Request_For_Otp_Mobile_' + this.entytyType || fieldId === 'Resend_Otp_Mobile_' + this.entytyType) {
            let elem: any;
            if (groupid !== 0) {
                elem = document.getElementById('Mobile_Number_' + this.entytyType + '_' + groupposition);
            } else {
                elem = document.getElementById('Mobile_Number_' + this.entytyType);
            }
            if (elem && elem.value !== '') {
                const mobileno = elem.value.replace(" ", "").replace(" ", "");
                this.previousUsrMobile = mobileno
                if (mobileno !== '') {
                    const data = {
                        "reraid": this.common.getReraId(),
                        "userid": this.common.getUserId(),
                        "fieldid": Number(mobileFieldId),
                        "stepid": Number(mobileStepId),
                        "groupid": Number(groupid),
                        "groupposition": Number(groupposition),
                        "fieldvalue": mobileno,
                        "isRegistration": "false"
                    };
                    this.common.loaderShow();
                    this.rest.generateFieldOTP(data).subscribe((res: any) => {
                        this.common.loaderEnd();
                        if (res.success) {
                            this.isSuccessMob = res.success
                            this.notifier.notify('success', res.message);
                            elem4.setAttribute('tableID', res.response.id)
                            elem4.setAttribute('clientID', res.response.resReturn.client_id);
                            this.hideOTPFieldBtns(groupposition, 2, 'Mobile');
                        } else {
                            this.notifier.notify('error', res.message);
                        }
                    });
                } else {
                    this.notifier.notify('error', 'Please enter Mobile Number.');
                }
            }
        } else if (fieldId === 'Verify_Otp_Mobile_' + this.entytyType) {
           
            let elem: any;
            if (groupid !== 0) {
                elem = document.getElementById('Enter_Mobile_Otp_' + this.entytyType + '_' + groupposition);
            } else {
                elem = document.getElementById('Enter_Mobile_Otp_' + this.entytyType);
            }
           
            let tableID = elem4.getAttribute('tableid');
            let mobileClientID = elem4.getAttribute('clientid');
            if (elem && elem.value !== '') {
                const mobileOTP = elem.value.replace(" ", "").replace(" ", "");
                if (mobileOTP !== '') {
                    const data = {
                        "id": Number(tableID),
                        "reraid": this.common.getReraId(),
                        "userid": this.common.getUserId(),
                        "fieldid": Number(mobileFieldId),
                        "stepid": Number(mobileStepId),
                        "groupid": Number(groupid),
                        "groupposition": Number(groupposition),
                        "clientid": mobileClientID,
                        "verifyOTP": mobileOTP,
                        "isProfile": "true",
                        "isRegistration": "false"
                    };
                    this.common.loaderShow()
                    this.rest.submitFieldOTP(data).subscribe((res: any) => {
                        this.common.loaderEnd()
                        if (res.success) {
                            if (groupid !== 0) {
                                this.hideOTPFieldBtns(groupposition, 3, 'Mobile');
                            } else {
                                this.hideOTPFieldBtns(groupposition, 3, 'Mobile');
                            }
                            this.notifier.notify('success', res.message);
                        } else {
                            this.notifier.notify('error', res.message);
                        }
                    });
                } else {
                    this.notifier.notify('error', 'Please enter OTP.');
                }
            }
        } else if (fieldId === 'Verify_Pan') {
            // PAN_Card_1
            let elem: any;
            let elem2: any;
            if (this.common.getEntityTypeId() === 3) {
                if (document.getElementById('label_PAN_Card_' + groupposition) || document.getElementById('label_PAN_Card')) {
                    if (groupid !== 0) {
                        elem = document.getElementById('PAN_Card_' + groupposition);
                    } else {
                        elem = document.getElementById('PAN_Card');
                    }
                } else {
                    if (groupid !== 0) {
                        elem = document.getElementById('PAN_No_' + groupposition);
                    } else {
                        elem = document.getElementById('PAN_No');
                    }
                }

                if (groupid !== 0) {
                    elem2 = document.getElementById('Name_of_Proprietorme_' + groupposition);
                } else {
                    elem2 = document.getElementById('Name_of_Proprietor');
                }
            } else {
                if (document.getElementById('label_PAN_Card_' + groupposition) || document.getElementById('label_PAN_Card')) {
                    if (groupid !== 0) {
                        elem = document.getElementById('PAN_Card_' + groupposition);
                    } else {
                        elem = document.getElementById('PAN_Card');
                    }
                } else {
                    if (groupid !== 0) {
                        elem = document.getElementById('PAN_No_' + groupposition);
                    } else {
                        elem = document.getElementById('PAN_No');
                    }
                }

                if (groupid !== 0) {
                    elem2 = document.getElementById('Name_' + groupposition);
                } else {
                    elem2 = document.getElementById('Name');
                }
            }

            if (elem && elem.value !== '' && elem2 && elem2.value !== '') {
                const panno = elem.value.replace(" ", "").replace(" ", "");
                const isvalidPan = this.common.regpan.test(panno)
                const username = elem2.value;
                if (panno !== '' && username !== '' && isvalidPan == true) {
                    const data = {
                        "reraid": this.common.getReraId(),
                        "userid": this.common.getUserId(),
                        "fieldid": Number(panFieldId),
                        "stepid": Number(panStepId),
                        "groupid": Number(groupid),
                        "groupposition": Number(groupposition),
                        "username": username.toUpperCase(),
                        "panno": panno.toUpperCase(),
                        "isRegistration": "false",
                        "isProfile": "true",
                    };
                    console.log("\n PAN VERIFICATION   ---------------   ", data);
                    this.common.loaderShow();
                    this.rest.verifyPAN(data).subscribe((res: any) => {
                        this.common.loaderEnd();
                        if (res.success) {
                            this.notifier.notify('success', res.message);
                            this.hideOTPFieldBtns(groupposition, 2, 'PAN');
                            if (groupid !== 0) {
                                (<HTMLButtonElement>document.getElementById('Verify_Pan_' + groupposition)).disabled = true;
                            } else {
                                (<HTMLButtonElement>document.getElementById('Verify_Pan')).disabled = true;
                            }
                        } else {
                            this.notifier.notify('error', res.message);
                        }
                    });
                } else {
                    this.notifier.notify('error', 'Please enter PAN Number.');
                }
            }
        } else if (fieldId === 'Verify_GSTIN') {
            this.verifyGSTIN();
        } else if (fieldId === 'verify_din') {
            this.verifyDin(groupid, groupposition);
        }
    }

    verifyDin(groupid: number, groupposition: number) {
        const dinElem: any = <HTMLInputElement>document.getElementById('DIN_' + groupposition);
        const directorElem: any = <HTMLInputElement>document.getElementById('Name_Director_' + groupposition);
        if (directorElem && directorElem.value !== '') {
            if (dinElem && dinElem.value !== '') {
                // console.log('din number >>> ', dinElem.value);
                const data = {
                    dinno: dinElem.value,
                    directorName: directorElem.value,
                    reraid: this.common.getReraId(),
                    userid: this.common.getUserId(),
                    fieldid: dinElem.dataset.fieldid,
                    stepid: dinElem.dataset.stepid,
                    groupid: groupid,
                    groupposition: groupposition
                };
                this.common.loaderShow();
                this.rest.verifyDIN(data).subscribe((res: any) => {
                    this.common.loaderEnd();
                    if (res.success) {
                        (<HTMLButtonElement>document.getElementById('verify_din_' + groupposition)).disabled = true;
                        this.notifier.notify('success', res.message);
                    } else {
                        this.notifier.notify('error', res.message);
                    }
                });
            } else {
                this.notifier.notify('error', 'DIN number is required');
            }
        } else {
            this.notifier.notify('error', 'Director name is required');
        }
    }

    verifyGSTIN() {
        const compElem = <HTMLInputElement>document.getElementById('Company_Name');
        const gstinElem: any = <HTMLInputElement>document.getElementById('Company_GSTIN');
        if (compElem && compElem.value !== '') {
            const companyName = compElem.value;
            if (gstinElem && gstinElem.value) {
                const data = {
                    gstinno: gstinElem.value,
                    filing_status: true,
                    companyName: companyName,
                    reraid: this.common.getReraId(),
                    userid: this.common.getUserId(),
                    fieldid: gstinElem.dataset.fieldid,
                    stepid: gstinElem.dataset.stepid
                };
                /*console.log('gstinElem >>> ', gstinElem.dataset.fieldid)
                console.log('gstinElem >>> ', gstinElem.dataset.stepid)*/
                this.common.loaderShow();
                this.rest.verifyGSTIN(data).subscribe((res: any) => {
                    this.common.loaderEnd();
                    if (res.success) {
                        (<HTMLButtonElement>document.getElementById('Verify_GSTIN')).disabled = true;
                        this.notifier.notify('success', res.message);
                    } else {
                        this.notifier.notify('error', res.message);
                    }
                });
            } else {
                this.notifier.notify('error', 'GSTIN number is required')
            }
        } else {
            this.notifier.notify('error', 'Company name is required');
        }
    }

    hideOTPFieldBtns(pos: number = -1, sequence: number = -1, fieldSpc: string): void {
        console.log(pos, sequence, fieldSpc)
        // Email Verification Verify_email_id_Director_0
        const Verify_email_id = 'Verify_Email_Id_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const Email_Verification_Code = 'Email_Verification_Code_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const label_Email_Verification_Code = 'label_Email_Verification_Code_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const Verify_Code_Email = 'Verify_Code_Email_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const Resend_Code_Email = 'Resend_Code_Email_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        // Mobile Verification
        const Request_for_Otp_Mobile = 'Request_For_Otp_Mobile_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const ENTER_MOBILE_OTP = 'Enter_Mobile_Otp_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const label_ENTER_MOBILE_OTP_mobile = 'label_Enter_Mobile_Otp_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const Verify_Otp_mobile = 'Verify_Otp_Mobile_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const Resend_Otp_mobile = 'Resend_Otp_Mobile_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        if (fieldSpc === 'Aadhaar') {
            setTimeout(() => {
                if (pos == -1) {
                    (<HTMLButtonElement>document.getElementById('REQUEST_FOR_OTP_Adhaar')).disabled = true;
                    (<HTMLButtonElement>document.getElementById('REQUEST_FOR_OTP_Adhaar')).classList.remove("btn-primary:hover");
                    (<HTMLInputElement>document.getElementById('Enter_Aadhaar_OTP')).disabled = true;
                    (<HTMLButtonElement>document.getElementById('label_Enter_Aadhaar_OTP')).disabled = true;
                    (<HTMLButtonElement>document.getElementById('Verify_Aadhaar')).disabled = true;
                    (<HTMLButtonElement>document.getElementById('Resend_OTP_Aadhaar')).disabled = true;
                    if (sequence === 1) {
                        (<HTMLButtonElement>document.getElementById('REQUEST_FOR_OTP_Adhaar')).disabled = false;
                    } else if (sequence === 2) {
                        (<HTMLInputElement>document.getElementById('Enter_Aadhaar_OTP')).disabled = false;
                        (<HTMLButtonElement>document.getElementById('label_Enter_Aadhaar_OTP')).disabled = false;
                        (<HTMLButtonElement>document.getElementById('Verify_Aadhaar')).disabled = false;
                        this.selIntervals(pos, sequence, fieldSpc);
                    } else if (sequence === 3) {
                        this.selIntervals(pos, sequence, fieldSpc);
                    }
                } else {
                    (<HTMLButtonElement>document.getElementById('Request_for_OTP_aadhar_no_' + pos)).disabled = true;
                    (<HTMLInputElement>document.getElementById('Enter_Aadhaar_OTP_' + pos)).disabled = true;
                    (<HTMLButtonElement>document.getElementById('label_Enter_Aadhaar_OTP_' + pos)).disabled = true;
                    (<HTMLButtonElement>document.getElementById('Verify_Aadhaar_' + pos)).disabled = true;
                    (<HTMLButtonElement>document.getElementById('Resend_OTP_Aadhaar_' + pos)).disabled = true;
                    if (sequence === 1) {
                        (<HTMLButtonElement>document.getElementById('Request_for_OTP_aadhar_no_' + pos)).disabled = false;
                    } else if (sequence === 2) {
                        (<HTMLInputElement>document.getElementById('Enter_Aadhaar_OTP_' + pos)).disabled = false;
                        (<HTMLButtonElement>document.getElementById('label_Enter_Aadhaar_OTP_' + pos)).disabled = false;
                        (<HTMLButtonElement>document.getElementById('Verify_Aadhaar_' + pos)).disabled = false;
                        this.selIntervals(pos, sequence, fieldSpc);
                    } else if (sequence === 3) {
                        this.selIntervals(pos, sequence, fieldSpc);
                    }
                }
            }, 1000);
        } else if (fieldSpc === 'Email') {
            setTimeout(() => {
                (<HTMLButtonElement>document.getElementById(Verify_email_id)).disabled = true;
                (<HTMLButtonElement>document.getElementById(Verify_email_id)).classList.remove("btn-primary:hover");
                (<HTMLInputElement>document.getElementById(Email_Verification_Code)).disabled = true;
                (<HTMLButtonElement>document.getElementById(label_Email_Verification_Code)).disabled = true;
                (<HTMLButtonElement>document.getElementById(Verify_Code_Email)).disabled = true;
                (<HTMLButtonElement>document.getElementById(Resend_Code_Email)).disabled = true;
                if (sequence === 1) {
                    (<HTMLButtonElement>document.getElementById(Verify_email_id)).disabled = false;
                } else if (sequence === 2) {
                    (<HTMLInputElement>document.getElementById(Email_Verification_Code)).disabled = false;
                    (<HTMLButtonElement>document.getElementById(label_Email_Verification_Code)).disabled = false;
                    (<HTMLButtonElement>document.getElementById(Verify_Code_Email)).disabled = false;
                    this.selIntervals(pos, sequence, fieldSpc);
                } else if (sequence === 3) {
                    this.selIntervals(pos, sequence, fieldSpc);
                }
            }, 1000);

        } else if (fieldSpc === 'Mobile') {
            setTimeout(() => {
                (<HTMLButtonElement>document.getElementById(Request_for_Otp_Mobile)).disabled = true;
                (<HTMLButtonElement>document.getElementById(Request_for_Otp_Mobile)).classList.remove("btn-primary:hover");
                (<HTMLInputElement>document.getElementById(ENTER_MOBILE_OTP)).disabled = true;
                (<HTMLButtonElement>document.getElementById(label_ENTER_MOBILE_OTP_mobile)).disabled = true;
                (<HTMLButtonElement>document.getElementById(Verify_Otp_mobile)).disabled = true;
                (<HTMLButtonElement>document.getElementById(Resend_Otp_mobile)).disabled = true;
                if (sequence === 1) {
                    (<HTMLButtonElement>document.getElementById(Request_for_Otp_Mobile)).disabled = false;
                } else if (sequence === 2) {
                    (<HTMLInputElement>document.getElementById(ENTER_MOBILE_OTP)).disabled = false;
                    (<HTMLButtonElement>document.getElementById(label_ENTER_MOBILE_OTP_mobile)).disabled = false;
                    (<HTMLButtonElement>document.getElementById(Verify_Otp_mobile)).disabled = false;
                    this.selIntervals(pos, sequence, fieldSpc);
                } else if (sequence === 3) {
                    this.selIntervals(pos, sequence, fieldSpc);
                }
            }, 1000);

        } else if (fieldSpc === 'PAN') {
            setTimeout(() => {
                if (pos == -1) {
                    (<HTMLButtonElement>document.getElementById('Verify_Pan')).disabled = true;
                } else {
                    (<HTMLButtonElement>document.getElementById('Verify_Pan_' + pos)).disabled = true;
                }
            }, 1000);
        } else if (fieldSpc === 'GSTIN') {
            setTimeout(() => {
                if (pos == -1) {
                    (<HTMLButtonElement>document.getElementById('Verify_GSTIN')).disabled = true;
                } else {
                    (<HTMLButtonElement>document.getElementById('Verify_GSTIN_' + pos)).disabled = true;
                }
            }, 1000);
        } else if (fieldSpc === 'DIN') {
            setTimeout(() => {
                if (pos == -1) {
                    (<HTMLButtonElement>document.getElementById('verify_din_')).disabled = true;
                } else {
                    (<HTMLButtonElement>document.getElementById('verify_din_' + pos)).disabled = true;
                }
            }, 1000);
        }
    }


    selIntervals(pos: number, sequence: number, fieldSpc: string) {
        const label_Resend_Code_Email = 'label_Resend_Code_Email_' + this.entytyType + (pos > -1 ? '_' + pos : '')
        const label_Resend_Otp_mobile = 'label_Resend_Otp_Mobile_' + this.entytyType + (pos > -1 ? '_' + pos : '')
        if (fieldSpc === 'Aadhaar') {
            if (this.timerIdForAadhaar) {
                clearInterval(this.timerIdForAadhaar);
            }
            if (pos == -1) {
                var timeLeft: number;
                if (sequence === 3) {
                    timeLeft = 0;
                } else {
                    (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar')).innerText = 'Resend OTP in 0:59s';
                    timeLeft = 58;
                }
                this.timerPosition = pos;
                this.timerSequence = sequence;
                this.timerTimeLeft = timeLeft;
                this.timerFieldSpc = fieldSpc;
                this.timerIdForAadhaar = setInterval(() => { this.countdown(pos, sequence, timeLeft, fieldSpc) }, 1000);
            } else {
                var timeLeft: number;
                if (sequence === 3) {
                    timeLeft = 0;
                } else {
                    (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar_' + pos)).innerText = 'Resend OTP in 0:59s';
                    timeLeft = 58;
                }
                this.timerPosition = pos;
                this.timerSequence = sequence;
                this.timerTimeLeft = timeLeft;
                this.timerFieldSpc = fieldSpc;
                this.timerIdForAadhaar = setInterval(() => { this.countdown(pos, sequence, timeLeft, fieldSpc) }, 1000);
            }
        } else if (fieldSpc === 'Email') {
            if (this.timerIdForEmail) {
                clearInterval(this.timerIdForEmail);
            }

            var timeLeft: number;
            if (sequence === 3) {
                timeLeft = 0;
            } else {
                (<HTMLInputElement>document.getElementById(label_Resend_Code_Email)).innerText = 'Resend OTP in 0:59s';
                timeLeft = 58;
            }
            this.timerPosition = pos;
            this.timerSequence = sequence;
            this.timerTimeLeft = timeLeft;
            this.timerFieldSpc = fieldSpc;
            this.timerIdForEmail = setInterval(() => { this.countdown(pos, sequence, timeLeft, fieldSpc) }, 1000);

        } else if (fieldSpc === 'Mobile') {
            if (this.timerIdForMobile) {
                clearInterval(this.timerIdForMobile);
            }
            var timeLeft: number;
            if (sequence === 3) {
                timeLeft = 0;
            } else {
                (<HTMLInputElement>document.getElementById(label_Resend_Otp_mobile)).innerText = 'Resend OTP in 0:59s';
                timeLeft = 58;
            }
            this.timerPosition = pos;
            this.timerSequence = sequence;
            this.timerTimeLeft = timeLeft;
            this.timerFieldSpc = fieldSpc;
            this.timerIdForMobile = setInterval(() => { this.countdown(pos, sequence, timeLeft, fieldSpc) }, 1000);

        }
    }


    countdown(pos: number, sequence: number, timeLeft: number, fieldSpc: string) {
        const label_Resend_Code_Email = 'label_Resend_Code_Email_' + this.entytyType + (pos > -1 ? '_' + pos : '')
        const Resend_Code_Email = 'Resend_Code_Email_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const Email_ID = 'Email_ID_' + this.entytyType + (pos > -1 ? '_' + pos : '');
        const label_Resend_Otp_mobile = 'label_Resend_Otp_Mobile_' + this.entytyType + (pos > -1 ? '_' + pos : '')
        const Resend_Otp_mobile = 'Resend_Otp_Mobile_' + this.entytyType + (pos > -1 ? '_' + pos : '')
        console.log(Resend_Otp_mobile)
        const Mobile_Number = 'Mobile_Number_' + this.entytyType + (pos > -1 ? '_' + pos : '')
        if (this.timerFieldSpc === 'Aadhaar') {
            if (this.timerPosition === -1) {
                if (this.timerSequence === 3) {
                    this.timerTimeLeft = 0;
                    (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar')).innerHTML = '&nbsp;';
                    clearTimeout(this.timerIdForAadhaar);
                } else {
                    if (this.timerTimeLeft === 0) {
                        (<HTMLButtonElement>document.getElementById('Resend_OTP_Aadhaar')).disabled = false;
                        (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar')).innerHTML = '&nbsp;';
                        clearTimeout(this.timerIdForAadhaar);
                    } else {
                        if (this.timerTimeLeft >= 10) {
                            (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar')).innerText = 'Resend OTP in 0:' + this.timerTimeLeft + 's';
                        } else {
                            (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar')).innerText = 'Resend OTP in 0:0' + this.timerTimeLeft + 's';
                        }
                        this.timerTimeLeft--;
                    }
                }
            } else {
                if (this.timerSequence === 3) {
                    this.timerTimeLeft = 0;
                    (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar_' + this.timerPosition)).innerHTML = '&nbsp;';
                    clearTimeout(this.timerIdForAadhaar);
                } else {
                    if (this.timerTimeLeft === 0) {
                        (<HTMLButtonElement>document.getElementById('Resend_OTP_Aadhaar_' + this.timerPosition)).disabled = false;
                        (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar_' + this.timerPosition)).innerHTML = '&nbsp;';
                        clearTimeout(this.timerIdForAadhaar);
                    } else {
                        if (this.timerTimeLeft >= 10) {
                            (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar_' + this.timerPosition)).innerText = 'Resend OTP in 0:' + this.timerTimeLeft + 's';
                        } else {
                            (<HTMLInputElement>document.getElementById('label_Resend_OTP_Aadhaar_' + this.timerPosition)).innerText = 'Resend OTP in 0:0' + this.timerTimeLeft + 's';
                        }
                        this.timerTimeLeft--;
                    }
                }
            }

        } else if (this.timerFieldSpc === 'Email') {
            if (this.timerSequence === 3) {
                this.timerTimeLeft = 0;
                (<HTMLInputElement>document.getElementById(label_Resend_Code_Email)).innerHTML = '&nbsp;';
                (<HTMLInputElement>document.getElementById(Email_ID)).disabled = true;
                clearTimeout(this.timerIdForEmail);
            } else {
                if (this.timerTimeLeft === 0) {
                    (<HTMLButtonElement>document.getElementById(Resend_Code_Email)).disabled = false;
                    (<HTMLInputElement>document.getElementById(label_Resend_Code_Email)).innerHTML = '&nbsp;';
                    clearTimeout(this.timerIdForEmail);
                } else {
                    if (this.timerTimeLeft >= 10) {
                        (<HTMLInputElement>document.getElementById(label_Resend_Code_Email)).innerText = 'Resend OTP in 0:' + this.timerTimeLeft + 's';
                    } else {
                        (<HTMLInputElement>document.getElementById(label_Resend_Code_Email)).innerText = 'Resend OTP in 0:0' + this.timerTimeLeft + 's';
                    }
                    this.timerTimeLeft--;
                }
            }
        } else if (this.timerFieldSpc === 'Mobile') {
            if (this.timerSequence === 3) {
                this.timerTimeLeft = 0;
                (<HTMLInputElement>document.getElementById(label_Resend_Otp_mobile)).innerHTML = '&nbsp;';
                (<HTMLInputElement>document.getElementById(Mobile_Number)).disabled = true;
                clearTimeout(this.timerIdForMobile);
            } else {
                if (this.timerTimeLeft === 0) {
                    (<HTMLButtonElement>document.getElementById(Resend_Otp_mobile)).disabled = false;
                    (<HTMLInputElement>document.getElementById(label_Resend_Otp_mobile)).innerHTML = '&nbsp;';
                    clearTimeout(this.timerIdForMobile);
                } else {
                    if (this.timerTimeLeft >= 10) {
                        (<HTMLInputElement>document.getElementById(label_Resend_Otp_mobile)).innerText = 'Resend OTP in 0:' + this.timerTimeLeft + 's';
                    } else {
                        (<HTMLInputElement>document.getElementById(label_Resend_Otp_mobile)).innerText = 'Resend OTP in 0:0' + this.timerTimeLeft + 's';
                    }
                    this.timerTimeLeft--;
                }
            }

        }
    }

    check(fieldvalue: any, pos: any, flag: string) {
        if (flag === 'E' && this.previousUserEmail !== fieldvalue && this.isSuccess) {
            this.hideOTPFieldBtns(pos, 1, 'Email')
            this.timerSequence = 2;
            this.timerTimeLeft = 0;
            this.timerFieldSpc = 'Email';
            this.countdown(pos, 2, 0, 'Email')
        } else if (flag === 'M' && this.previousUsrMobile !== fieldvalue && this.isSuccessMob === true) {
            this.hideOTPFieldBtns(pos, 1, 'Mobile')
            this.timerSequence = 2;
            this.timerTimeLeft = 0;
            this.timerFieldSpc = 'Mobile';
            this.timerPosition = pos;
            this.countdown(pos, 2, 0, 'Mobile')
        } else {
            console.log("Match")
        }
    }


    CreateuserCustomize() {
        let body = `clientId= 18&name=${this.common.getUserName()}&mobile=${this.common.getNumber()}&email=${this.common.getEmail()}&password=12345&roleSelected1=87&SptgrpSelected=434&login_name=${this.common.getPanNumber()}&user_id=758738&address=${this.loginUserAddress}&isNotEncrypted=true`
        this.rest.CreateUser(body).subscribe((res: any) => {
            if (res.success) {
                // this.notifier.notify('success',re)
            } else {
                // this.notifier.notify('error', res.errorMessage);
            }
        });
    }

    insertDataFromAadhaar(step: any, groupid: any, objData: any, grouppos: number = -1, fieldGroupId: any = null, fieldGroupPos: number = -1) {
        let fieldValue: { id: any; val: any; tempid: any; isuniqueid: any; fieldtype: any; stepid: any; }[] = [];
        if (groupid == 0 || groupid == null) {
            fieldValue = [{ id: '', val: '', tempid: '', isuniqueid: '', fieldtype: '', stepid: '' }]
            for (const obj of this.formDetails[step]) {
                if (obj.fielddetails.fielddesc === "Name_of_Proprietor") {
                    obj.fielddetails.fieldvalue = this.aadhaarData.full_name
                    if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                        fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                    }
                }
                if (obj.fielddetails.fielddesc === "Home_Address_Line_one") {
                    let address = this.aadhaarData.address.house + " " + this.aadhaarData.address.street + " " + this.aadhaarData.address.landmark + " " + this.aadhaarData.address.vtc
                    obj.fielddetails.fieldvalue = address
                    if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                        fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                    }
                }
                if (obj.fielddetails.fielddesc === "State" || obj.fielddetails.fielddesc === "State_P" || obj.fielddetails.fielddesc === "State_N") {
                    obj.fielddetails.fieldvalue = this.aadhaarData.address.state
                    for (let i = 0; i < this.stateList.length; i++) {
                        if (this.stateList[i].statename === obj.fielddetails.fieldvalue) {
                            this.getDistricts(this.stateList[i].id, step, '', grouppos)
                        }

                    }
                    if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                        fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                    }
                }

                if (obj.fielddetails.fielddesc === "District" || obj.fielddetails.fielddesc === "District_P" || obj.fielddetails.fielddesc === "District_N") {
                    obj.fielddetails.fieldvalue = this.aadhaarData.address.dist

                    if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                        fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                    }
                }
                if (obj.fielddetails.fielddesc === "Pin_Code") {
                    obj.fielddetails.fieldvalue = this.aadhaarData.zip
                    if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                        fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                    }
                }

                if (obj.fielddetails.fielddesc === "Full_Name") {
                    obj.fielddetails.fieldvalue = this.aadhaarData.full_name
                    if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                        fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                    }
                }

                if (obj.fielddetails.fielddesc === "Date_of_Birth") {
                    obj.fielddetails.fieldvalue = this.aadhaarData.dob
                    if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                        fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                    }
                }

                if (obj.fielddetails.fielddesc === "Gender") {
                    if (this.aadhaarData.gender === "M") {
                        obj.fielddetails.fieldvalue = "Male"
                        if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                            fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                        }

                    } else if (this.aadhaarData.gender === "F") {
                        obj.fielddetails.fieldvalue = "Female"
                        if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                            fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                        }
                    } else {
                        obj.fielddetails.fieldvalue = "Others"
                        if (!fieldValue.some(item => item.val === obj.fielddetails.fieldvalue)) {
                            fieldValue.push({ 'id': obj.fielddetails.fieldid, 'val': obj.fielddetails.fieldvalue, 'tempid': obj.tempid, 'isuniqueid': obj.fielddetails.isuniqueid, 'fieldtype': obj.fielddetails.fieldtype, 'stepid': obj.stepid })
                        }
                    }
                }
            }
            for (let i = 0; i < fieldValue.length; i++) {
                const fd = new FormData();
                fd.append('userid', this.common.getUserId());
                fd.append('reraid', this.common.getReraId());
                // fd.append('projectid', this.projectId + '');
                fd.append('groupid', groupid !== 0 ? groupid + '' : '');
                fd.append('fieldid', fieldValue[i].id);
                fd.append('fieldvalue', fieldValue[i].val);
                fd.append('tempid', fieldValue[i].tempid !== undefined && fieldValue[i].tempid !== null ? fieldValue[i].tempid:'');
                fd.append('fieldgroupid', fieldGroupId === null ? '' : fieldGroupId);
                fd.append('isuniqueid', fieldValue[i].isuniqueid);
                fd.append('fieldtype', fieldValue[i].fieldtype);
                fd.append('pos', grouppos + '');
                fd.append('fieldGroupPos', fieldGroupPos + '');
                fd.append('stepid', fieldValue[i].stepid + '');
                this.rest.storeProfileTemp(fd).subscribe((res: any) => {
                    if (res.success) {
                        // obj.fieldvalue = res.response.value;
                    }
                });

            }
        } else {
            fieldValue = [{ id: '', val: '', tempid: '', isuniqueid: '', fieldtype: '', stepid: '' }]
            for (let i = 0; i < objData.fielddetailskeys[grouppos].length; i++) {
                const myArray = objData.fielddetailskeys[grouppos][i].split("_");
                for (let j = 0; j < this.common.promotersType.length; j++) {
                    if (myArray[myArray.length - 1] === this.common.promotersType[j]) {
                        this.entytyType1 = myArray[myArray.length - 1]
                        break;
                    }
                }
                if (objData.fielddetailskeys[grouppos][i] === "Name_" + this.entytyType1) {
                    objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue = this.aadhaarData.full_name
                    if (!fieldValue.some(item => item.val === objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue)) {
                        fieldValue.push({ 'id': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldid, 'val': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue, 'tempid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].tempid, 'isuniqueid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].isuniqueid, 'fieldtype': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldtype, 'stepid': objData.stepid })
                    }
                }
                if (objData.fielddetailskeys[grouppos][i] === "Home_Address_Line_one") {
                    let address = this.aadhaarData.address.house + " " + this.aadhaarData.address.street + " " + this.aadhaarData.address.landmark + " " + this.aadhaarData.address.vtc
                    objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue = address
                    if (!fieldValue.some(item => item.val === objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue)) {
                        fieldValue.push({ 'id': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldid, 'val': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue, 'tempid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].tempid, 'isuniqueid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].isuniqueid, 'fieldtype': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldtype, 'stepid': objData.stepid })
                    }
                }
                if (objData.fielddetailskeys[grouppos][i] === "State" || objData.fielddetailskeys[grouppos][i] === "State_P" || objData.fielddetailskeys[grouppos][i] === "State_N") {
                    objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue = this.aadhaarData.address.state
                    for (let i = 0; i < this.stateList.length; i++) {
                        if (this.stateList[i].statename === this.aadhaarData.address.state) {
                            this.getDistricts(this.stateList[i].id, objData, 'group', grouppos)
                        }

                    }
                    if (!fieldValue.some(item => item.val === objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue)) {
                        fieldValue.push({ 'id': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldid, 'val': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue, 'tempid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].tempid, 'isuniqueid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].isuniqueid, 'fieldtype': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldtype, 'stepid': objData.stepid })
                    }
                }
                if (objData.fielddetailskeys[grouppos][i] === "District" || objData.fielddetailskeys[grouppos][i] === "District_P" || objData.fielddetailskeys[grouppos][i] === "District_N") {
                    objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue = this.aadhaarData.address.dist
                    if (!fieldValue.some(item => item.val === objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue)) {
                        fieldValue.push({ 'id': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldid, 'val': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue, 'tempid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].tempid, 'isuniqueid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].isuniqueid, 'fieldtype': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldtype, 'stepid': objData.stepid })
                    }
                }
                if (objData.fielddetailskeys[grouppos][i] === "Pin_Code") {
                    objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue = this.aadhaarData.zip
                    if (!fieldValue.some(item => item.val === objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue)) {
                        fieldValue.push({ 'id': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldid, 'val': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldvalue, 'tempid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].tempid, 'isuniqueid': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].isuniqueid, 'fieldtype': objData.fielddetails[grouppos][objData.fielddetailskeys[grouppos][i]][0].fieldtype, 'stepid': objData.stepid })
                    }
                }

            }

            for (let i = 0; i < fieldValue.length; i++) {
                const fd = new FormData();
                fd.append('userid', this.common.getUserId());
                fd.append('reraid', this.common.getReraId());
                // fd.append('projectid', this.projectId + '');
                fd.append('groupid', groupid !== 0 ? groupid + '' : '');
                fd.append('fieldid', fieldValue[i].id);
                fd.append('fieldvalue', fieldValue[i].val);
                fd.append('tempid', fieldValue[i].tempid !== undefined && fieldValue[i].tempid !== null ? fieldValue[i].tempid:'');
                fd.append('fieldgroupid', fieldGroupId === null ? '' : fieldGroupId);
                fd.append('isuniqueid', fieldValue[i].isuniqueid);
                fd.append('fieldtype', fieldValue[i].fieldtype);
                fd.append('pos', grouppos + '');
                fd.append('fieldGroupPos', fieldGroupPos + '');
                fd.append('stepid', fieldValue[i].stepid + '');
                this.rest.storeProfileTemp(fd).subscribe((res: any) => {
                    if (res.success) {
                        // obj.fieldvalue = res.response.value;
                    }
                });

            }
        }
    }

    openLink(file: any) {
        window.open(this.FILE_ROOT + file, '_blank');
    }

}
