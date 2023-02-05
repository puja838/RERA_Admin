import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    PAYLOAD_ENC_DEC = "2e35f242a46d67eeb74aabc37d5e5d05";
    yearList: any = [];
    regmobile = /^[6789][0-9]{9}$/
    regemail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    adharValid = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
    nameformat = /[!@#$%^&*()_+\-=\[\]{};':"\\|,`~.<>\/?]+/;
    namehasNumber = /\d/;
    passwordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,13}$/;
    language: any;
    promotersType = ['Director', 'Proprietor', 'Society', 'Partnership', 'llp', 'Trustee', 'Member', 'Authorised'];
    modalSubject = new Subject<any>();
    private searchSubject = new Subject<any>();
    monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // private stepListShow = new Subject<any>();;
    // private formDetails= new Subject<any>();
    stepListShow:any = []
    formDetails:any = []
    signatureImg:any = ''
    totalAmount:any = ''
    isPreventRegistration:boolean = false
    isDataBlank:boolean=false
    totalLandArea:any = ''
    isAccept = false
    constructor(private spinner: NgxSpinnerService) {
    }

    decryptPayload(data: any) {
        return JSON.parse(CryptoJS.AES.decrypt(data, this.PAYLOAD_ENC_DEC.trim()).toString(CryptoJS.enc.Utf8));
    }

    encryptPayload(data: any) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), this.PAYLOAD_ENC_DEC).toString();
    }

    getDateStr(date: string): any {
        if (date !== '') {
            const arr = date.split('-');
            return arr[2] + ' ' + this.monthList[Number(arr[1]) - 1] + ' ' + arr[0]
        } else {
            return '';
        }
    }

    loaderShow(): void {
        this.spinner.show();
    }

    loaderStart(): void {
        this.spinner.show();
    }

    loaderEnd(): void {
        this.spinner.hide();
    }

    getReraId(): any {
        return 1
    }

    generateYearList() {
        const date = new Date('1990-01-01');
        const currentDate = new Date();
        while (true) {
            this.yearList.push(date.getFullYear());
            if (date.getFullYear() === currentDate.getFullYear() + 20) {
                break;
            }
            date.setFullYear(date.getFullYear() + 1);
        }
    }

    setUserData(data: any): any {
        sessionStorage.setItem('userid', data.userid);
        sessionStorage.setItem('reraid', data.reraid);
        sessionStorage.setItem('roleid', data.roleid);
        sessionStorage.setItem('name', data.username);
        sessionStorage.setItem('role', data.roledesc);
        sessionStorage.setItem('tp', data.roletype);
        sessionStorage.setItem('entitytypeid', data.entitytypeid);
        sessionStorage.setItem('pannum', data.userpan);
        sessionStorage.setItem('mobile', data.usermobile);
        sessionStorage.setItem('email', data.useremail);
        sessionStorage.setItem('issubmitted', data.issubmitted);
        sessionStorage.setItem('token', data.token);
    }

    clearUserData(): any {
        sessionStorage.removeItem('userid');
        sessionStorage.removeItem('reraid');
        sessionStorage.removeItem('roleid');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('tp');
        sessionStorage.removeItem('entitytypeid');
        sessionStorage.removeItem('pannum');
        sessionStorage.removeItem('mobile');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('issubmitted');
        sessionStorage.removeItem('entityid');
        sessionStorage.removeItem('token');
    }

    getUserId(): any {
        const userId = sessionStorage.getItem('userid');
        if (userId) {
            return JSON.parse(userId);
        } else {
            return null;
        }
    }

    getToken(): any {
        return sessionStorage.getItem('token');
    }

    getUserName(): any {
        const name = sessionStorage.getItem('name');
        if (name) {
            return name;
        } else {
            return null;
        }
    }

    getUserEmail(): any {
        const name = sessionStorage.getItem('email');
        if (name) {
            return name;
        } else {
            return null;
        }
    }

    setCaroselType(data: any): any {
        sessionStorage.setItem('caroseltype', data);
    }

    getCaroselType(): any {
        const name = sessionStorage.getItem('caroseltype');
        if (name) {
            return name;
        } else {
            return null;
        }
    }

    setQueryCount(data: any) {
        sessionStorage.setItem('queryCount', data);
    }

    getQueryCount(): any {
        const name = sessionStorage.getItem('queryCount');
        if (name) {
            return name;
        } else {
            return null;
        }
    }

    getUserMobile(): any {
        const name = sessionStorage.getItem('mobile');
        if (name) {
            return name;
        } else {
            return null;
        }
    }


    getRoleId(): any {
        const roleid = sessionStorage.getItem('roleid');
        if (roleid) {
            return roleid;
        } else {
            return null;
        }
    }


    getSubmittedFlag(): any {
        const issubmitted = sessionStorage.getItem('issubmitted');
        if (issubmitted) {
            return issubmitted;
        } else {
            return null;
        }
    }

    setProjectId(data: any) {
        sessionStorage.setItem("pid", data)
    }

    getEntityId(): any {
        return sessionStorage.getItem('entityid');
    }

    setEntityTypeId(data: any) {
        sessionStorage.setItem('entitytypeid', data)
    }

    getEntityTypeId(): any {
        const entityTypeId = sessionStorage.getItem('entitytypeid');
        if (entityTypeId) {
            return JSON.parse(entityTypeId);
        } else {
            return null;
        }
    }

    getUsername() {
        return sessionStorage.getItem('name');
    }

    getRolename() {
        return sessionStorage.getItem('role');
    }

    getRoletype() {
        return sessionStorage.getItem('tp');
    }

    getProjectId() {
        return sessionStorage.getItem('pid')
    }

    groupBy(xs: any, key: any) {
        return xs.reduce(function (rv: any, x: any) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    sortKeyAsFirst(firstArr: any, secondArr: any) {
        const newArr = [];
        for (const elem of firstArr) {
            if (secondArr.includes(elem)) {
                newArr.push(elem);
            }
        }
        return newArr;
    }

    checkParentFieldValue(fieldParentValues: any, fieldValue: string, flag: number = 1): boolean {
        if (flag === 1) {
            return fieldParentValues !== null ? fieldParentValues.split(',').includes(fieldValue) : false;
        } else {
            return fieldParentValues !== null ? !fieldParentValues.split(',').includes(fieldValue) : false;
        }
    }

    numberInWords(num: string) {
        const a = ['', 'First ', 'Second ', 'Third ', 'Fourth ', 'Fifth ', 'Sixth ', 'Seventh ', 'Eighth ', 'Ninth ', 'Tenth ', 'Eleventh ', 'Twelfth ', 'Thirteenth ', 'Fourteenth ', 'Fifteenth ', 'Sixteenth ', 'Seventeenth ', 'Eighteenth ', 'Nineteenth '];
        const b = ['', '', 'twenty ', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        if ((num = num.toString()).length > 9) return 'overflow';
        let n: any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' ' : '';
        return str;
    }

    validAdhar(obj: any, groupid: any) {
        let fieldvalue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        fieldvalue = this.format(fieldvalue);
        if (groupid === 0) {
            obj.fielddetails.fieldvalue = fieldvalue
        } else {
            obj.fieldvalue = fieldvalue
        }
        if (!this.adharValid.test(fieldvalue) && fieldvalue != '') {
            return false
        } else {
            return true
        }
    }

    format(res: any) {
        res = res.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
        return res;
    }

    validPAN(obj: any, groupid: any) {
        let fieldvalue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        if (!this.regpan.test(fieldvalue) && fieldvalue != '') {
            return false
        } else {
            fieldvalue = fieldvalue.toUpperCase();
            return true
        }
    }

    ValidateEmail(obj: any, groupid: any) {
        let fieldvalue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        if (this.regemail.test(fieldvalue) == false && fieldvalue != '') {
            return false
        } else {
            return true
        }

    }

    validMobile(obj: any, groupId: any) {
        const fieldValue = groupId === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        if (!this.regmobile.test(fieldValue) && fieldValue != '') {
            return false
        } else {
            return true
        }
    }

    nameValidation(obj: any, groupId: any) {
        const fieldValue = groupId === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
        if ((this.nameformat.test(fieldValue)) || this.namehasNumber.test(fieldValue)) {
            return false
        } else {
            return true
        }
    }

    loadJsScript(src: string): void {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        document.body.appendChild(script);
    }

    setLanguage(lang: string) {
        sessionStorage.setItem('language', lang);
    }

    getLanguage() {
        this.language = sessionStorage.getItem('language');
    }

    getPanNumber() {
        return sessionStorage.getItem('pannum');
    }

    getNumber() {
        return sessionStorage.getItem('mobile');
    }

    getEmail() {
        return sessionStorage.getItem('email');
    }

    formatDate(date: any, flag = 0) {
        let d = flag === 0 ? new Date(date) : date,
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }

    subDates(date: any, anotherDate: any = ''): any {
        const date1 = new Date(date);
        const date2 = anotherDate === '' ? new Date() : new Date(anotherDate);

        const Difference_In_Time = date2.getTime() - date1.getTime();
        const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return Math.round(Difference_In_Days);
    }

    setMenuType(data: any) {
        sessionStorage.setItem("mid", data)
    }
    getMenuType() {
        return sessionStorage.getItem("mid")
    }

    getRandomIntInclusive(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    daysInMonth(month: any, year: any) {
        return new Date(year, month, 0).getDate();
    }

    isEndMaxDate(startDate: string, endDate: string): boolean {
        const stMon = startDate.split('-')[0];
        const stYear = startDate.split('-')[1];
        const etMon = endDate.split('-')[0];
        const etYear = endDate.split('-')[1];
        const startDays = this.daysInMonth(stMon, stYear);
        const endDays = this.daysInMonth(etMon, etYear);
        const sD = new Date(stYear + '-' + stMon + '-' + startDays);
        const eD = new Date(etYear + '-' + etMon + '-' + endDays);
        return eD.getTime() >= sD.getTime();
    }

    isDateMaxThanToday(date: string, flag: number = 0): boolean {
        // If date is like 12-2022(MM-YYYY)
        const today = new Date();
        if (flag == 0) {
            const dArr = date.split('-');
            if (Number(dArr[1]) > today.getFullYear()) {
                return true;
            } else if (Number(dArr[0]) >= (today.getMonth() + 1) && Number(dArr[1]) === today.getFullYear()) {
                return true;
            }
        }
        return false;
    }

    diffDate(date1: any, date2: any) {
        const daysDiff = Math.ceil((Math.abs(date1 - date2)) / (1000 * 60 * 60 * 24));

        const years = Math.floor(daysDiff / 365.25);
        const remainingDays = Math.floor(daysDiff - (years * 365.25));
        const months = Math.floor((remainingDays / 365.25) * 12);
        const days = Math.ceil(daysDiff - (years * 365.25 + (months / 12 * 365.25)));

        return {
            daysAll: daysDiff,
            years: years,
            months: months,
            days: days
        }
    }

    sendSearchData(data: any) {
        this.searchSubject.next(data);
    }

    fetchSearchData(): Observable<any> {
        return this.searchSubject.asObservable();
    }

    setWorkflowType(data: any) {
        sessionStorage.setItem("wtp", data);
    }
    getWorkflowType() {
        let val = sessionStorage.getItem('wtp');
        if (val === null) {
            return 0
        } else {
            return JSON.parse(val)
        }
    }

    // setstepListShow(stepsDetails: any) {
    //     this.stepListShow.next(stepsDetails)
    //     console.log(">>>>>>setstepListShow>>>>>>>>>>>>>",this.stepListShow)
    // }

    // getstepListShow(): Observable<any> {
    //     return this.stepListShow.asObservable();
    // }

    // setformDetails(data: any) {
    //     this.formDetails.next(data)
    // }

    // getformDetails(): Observable<any> {
    //     this.formDetails = new Subject();
    //     return this.formDetails.asObservable();
    // }
}
