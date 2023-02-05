import {Injectable} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  PAYLOAD_ENC_DEC = "2e35f242a46d67eeb74aabc37d5e5d05";
  fieldTypeDict: any = {
    '1': 'Text',
    '2': 'Integer',
    '3': 'Float',
    '4': 'Date',
    '5': 'File',
    '6': 'Button',
    '7': 'Heading',
    '8': 'Label',
    '9': 'Is Approved',
    '10': 'HR',
    '11': 'Blank Space',
    '12': 'Image',
    '13': 'Table Heading'
  };
  controlTypeDict: any = {
    '1': 'Text',
    '2': 'Combo',
    '3': 'Radio',
    '4': 'Checkbox',
    '5': 'Date',
    '6': 'File',
    '7': 'Button',
    '8': 'Heading',
    '9': 'Textarea',
    '10': 'Label',
    '11': 'Is Approved',
    '12': 'Radio with Value',
    '13': 'HR',
    '14': 'Blank Space',
    '15': 'Image',
    '16': 'Table Heading',
    '17': 'Multi Select'
  };
  regmobile = /^[6789][0-9]{9}$/
  promotersType = ['Director', 'Proprietor', 'Society', 'Partnership', 'llp', 'Trustee', 'Member', 'Authorised'];
  yearList: any = [];
  modalSubject = new Subject<any>();
  constructor(private spinner: NgxSpinnerService, private router: Router) {
  }

  getEntityId(): any {
    return 1
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

  getEntityTypeId(): any {
    const entityTypeId = sessionStorage.getItem('entitytypeid');
    if (entityTypeId) {
      return JSON.parse(entityTypeId);
    } else {
      return null;
    }
  }

  getUserId(): any {
    const userId = sessionStorage.getItem('userid');
    if (userId) {
      return JSON.parse(userId)
    } else {
      return null;
    }
  }

  setProjectId(data: any) {
    sessionStorage.setItem("pid", data);
  }
  setExtensionId(data: any) {
    sessionStorage.setItem("eid", data);
  }
  setAgentId(data: any) {
    sessionStorage.setItem("aid", data);
  }
  setWorkflowType(data: any) {
    sessionStorage.setItem("wtp", data);
  }
  setMenuType(data: any) {
    sessionStorage.setItem("mid", data)
  }
  getMenuType() {
    return sessionStorage.getItem("mid")
  }

  setEntityTypeId(data: any) {
    sessionStorage.setItem('entitytypeid', data)
  }

  getProjectId() {
    return sessionStorage.getItem('pid')
  }
  getExtensionId() {
    return sessionStorage.getItem('eid');
  }
  getAgentId() {
    return sessionStorage.getItem('aid');
  }
  getWorkflowType() {
    let val=sessionStorage.getItem('wtp');
    if(val === null){
      return 0
    }else{
      return JSON.parse(val)
    }
  }
  getToken(): any {
    return sessionStorage.getItem('token');
  }
  setToken(token:string){
     sessionStorage.setItem('token',token);
  }
  clearUserData(){
    sessionStorage.clear();
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
  encryptPayload(data: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.PAYLOAD_ENC_DEC).toString();
  }
  decryptPayload(data: any) {
    /*const bytes = await CryptoJS.AES.decrypt(data, this.PAYLOAD_ENC_DEC);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));*/
    return JSON.parse(CryptoJS.AES.decrypt(data,  this.PAYLOAD_ENC_DEC.trim()).toString(CryptoJS.enc.Utf8));
  }

  setUserData(data: any): any {
    sessionStorage.setItem('userid', data.userid);
    sessionStorage.setItem('reraid', data.reraid);
    sessionStorage.setItem('roleid', data.roleid);
    sessionStorage.setItem('name', data.username);
    sessionStorage.setItem('role', data.roledesc);
    sessionStorage.setItem('tp', data.roletype);
  }

  getReraId(): any {
    const reraId = sessionStorage.getItem('reraid');
    if (reraId) {
      return JSON.parse(reraId)
    } else {
      return null;
    }
  }
  setTileType(data: any) {
    sessionStorage.setItem("tile", data);
  }
  getTileType() {
    let val=sessionStorage.getItem('tile');
    if(val === null){
      return 0
    }else{
      return JSON.parse(val)
    }
  }
  getRoleId(): any {
    const roleid = sessionStorage.getItem('roleid');
    if (roleid) {
      return JSON.parse(roleid)
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

  // getUserName(): any {
  //   const name = sessionStorage.getItem('name');
  //   if (name) {
  //     return name;
  //   } else {
  //     return null;
  //   }
  // }
  getNumber() {
    return sessionStorage.getItem('mobile');
  }

  loaderStart(): void {
    this.spinner.show();
  }

  loaderEnd(): void {
    this.spinner.hide();
  }

  isLoggedIn(): any {
    const uType = sessionStorage.getItem('userid')
    if (uType) {
      const roleId = this.getRoleId()
      if (roleId != null && roleId != 1 && roleId != 11) {
        this.router.navigate(['/user']);
      } else if (roleId == 1 || roleId == 11) {
        this.router.navigate(['/mst']);
      } else {
        this.router.navigate(['/']);
      }
    }
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

  validMobile(obj: any, groupId: any) {
    const fieldValue = groupId === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
    if (!this.regmobile.test(fieldValue) && fieldValue != '') {
      return false
    } else {
      return true
    }
  }
}
