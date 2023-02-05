import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifierService} from "angular-notifier";
import {RestApiService} from "../../services/rest-api.service";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.css']
})
export class AgentDetailsComponent implements OnInit, OnChanges {

  formDetails: any;
  stepList: any = [];
  stepListShow: any = [];
  backupDetails: any;
  selectedTabIndex = 0;
  projectId = 0;
  @Input() entityTypeId = 0;
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
  isSubmitted = true;
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
  @Input() userID = 0;
  entytyType1: any;
  cityName: any = [];
  stateList: any = [];
  stateNameList: any = [];
  stateName: any = [];
  FILE_ROOT = '';
  fileUploadToolTip = 'Maximum file size of a PDF is 5MB and for image 2MB';
  signatureImg = '';
  isAccept = true;
  paymentAmount = 10000;
  flexRadioDefault: any = 'panjab';
  isPaymentComplete = true;

  constructor(private rest: RestApiService, private common: CommonService, private activeRoute: ActivatedRoute,
              private modalService: NgbModal, private notifier: NotifierService, private router: Router) {
    this.FILE_ROOT = this.rest.FILE_ROOT;
  }

  ngOnInit(): void {
    // this.getFormInfo();
  }

  ngOnChanges(changes: any): void {
    if (this.entityTypeId == 1) {
      this.paymentAmount = 10000;
    } else {
      this.paymentAmount = 50000;
    }
    if (this.userID !== 0 && this.entityTypeId !== 0) {
      this.getFormInfo();
    }
  }

  validationValue(event: any, obj: any, groupid: number = 0): any {
    const fieldDesc = groupid === 0 ? obj.fielddetails.fielddesc : obj.fielddesc;
    const fieldvalue = groupid === 0 ? obj.fielddetails.fieldvalue : obj.fieldvalue;
    const fieldtype = groupid === 0 ? obj.fielddetails.fieldtype : obj.fieldtype;
    const myArray = fieldDesc.split("_");
    const entityType = myArray[myArray.length - 1];
    if (fieldDesc === 'Pin_Code' || fieldDesc.indexOf("Pin_Code") > -1) {
      if (fieldvalue === '' && event.key != 8) {
        return false;
      }
      return (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && fieldvalue.length < 6) || event.keyCode == 8;
    } else if (fieldDesc === "Mobile_Number_" + entityType || fieldDesc.indexOf("Mobile_Number_" + entityType) > -1 || fieldDesc === "Alternate_Contact_No") {
      return (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && fieldvalue.length < 10) || event.keyCode == 8;
    } else if (fieldDesc === "Aadhaar_Card" || fieldDesc.indexOf("Aadhaar_Card") > -1) {
      return (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && fieldvalue.length < 12) || event.keyCode == 8;
    } else if (fieldDesc == 'PAN_No' || fieldDesc.indexOf("PAN_No") > -1) {
      return groupid === 0 ? !(obj.fielddetails.fieldvalue.length >= 10 && event.keyCode !== 8) : !(obj.fieldvalue.length >= 10 && event.keyCode !== 8);
    } else if (fieldtype === 2 || fieldtype === 3) {
      if (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) || event.keyCode == 8 || event.keyCode == 190 || event.keyCode == 110) {
        return true;
      } else {
        return false;
      }
    }
  }

  getState() {
    const data = {
      reraid: this.common.getReraId()
    };
    this.rest.getState(data).subscribe((res: any) => {
      if (res.success) {
        this.stateList = res.response;
        for (let i = 0; i < res.response.length; i++) {
          this.stateName.push(res.response[i].statename);
        }
        // this.stateName.splice(-1)
        this.stateName.unshift('Select State');
        this.getFormInfo();
      }
    });

  }

  getDistricts(fielddesc: string, data: any, dtl: any, flag: string, groupPosition: number = -1, index: number = -1) {
    const dist = {
      stateid: data
    };
    this.rest.getDistricts(dist).subscribe((res: any) => {
      if (res.success) {
        this.cityName = [];
        for (let i = 0; i < res.response.length; i++) {
          this.cityName.push(res.response[i].cityname, '|');
        }
        this.cityName.splice(-1);
        this.cityName.unshift('Select City|');
        let dist = '';
        if (fielddesc === 'State_P') {
          dist = 'District_P';
        } else if (fielddesc === 'State') {
          dist = 'District';
        } else if (fielddesc === 'State_N') {
          dist = 'District_N';
        } else if (fielddesc === 'State_C') {
          dist = 'District_C';
        }
        if (flag === 'group') {
          if (Array.isArray(dtl.fielddetails)) {
            const field = dtl.fielddetails[groupPosition];
            for (let i = 0; i < dtl.fielddetailskeys[groupPosition].length; i++) {
              const key = dtl.fielddetailskeys[groupPosition][i];
              if (key === dist) {
                field[key][0].controlvalue = this.cityName.join('');
                break;
              }
            }
          }
        } else {
          for (let i = 0; i < this.formDetails[dtl].length; i++) {
            if (this.formDetails[dtl][i].fielddetails.fielddesc === dist) {
              this.formDetails[dtl][i].fielddetails.controlvalue = this.cityName.join('')
            }
          }
        }

      }
    });
  }

  getFormInfo() {
    this.common.loaderStart();
    const data = {
      reraid: this.common.getReraId(),
      entityid: 2,
      entitytypeid: this.entityTypeId,
      userid: this.common.getUserId(),
      promoterid:this.userID,
      iscomplete: 1
    };
    this.rest.getProfileFormInfo(data).subscribe((res: any) => {
      this.common.loaderEnd();
      if (res.success) {
        this.stepList = Object.keys(res.response);
        this.stepListShow = Object.keys(res.response);
        this.stepListShow.push('Declaration');
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
                    if (field[key][0].fielddesc == 'Mobile_Number_' + this.entytyType && !this.isSubmitted) {
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
                    console.log(field[key][0].fielddesc);
                    if (field[key][0].fielddesc === "State" || field[key][0].fielddesc === "State_P" || field[key][0].fielddesc === "State_N"
                        || field[key][0].fielddesc === "State_C") {
                      field[key][0].controlvalue = this.stateName.join('|');
                      for (let i = 0; i < this.stateList.length; i++) {
                        if (this.stateList[i].statename === field[key][0].fieldvalue) {
                          this.getDistricts(field[key][0].fielddesc, this.stateList[i].id, obj, 'group', index)
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
                if (obj.fielddetails.fielddesc === "State" || obj.fielddetails.fielddesc === "State_P"
                    || obj.fielddetails.fielddesc === "State_N" || obj.fielddetails.fielddesc === "State_C") {
                  obj.fielddetails.controlvalue = this.stateName.join('|');
                  for (let i = 0; i < this.stateList.length; i++) {
                    if (this.stateList[i].statename === obj.fielddetails.fieldvalue) {
                      this.getDistricts(obj.fielddetails.fielddesc, this.stateList[i].id, step, '', -1, index);
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

                if (obj.fielddetails.fieldid === 409) {
                  this.onFocusElement(obj, step);
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
                          if(field[key][0].fielddesc === 'State_C' || field[key][0].fielddesc === 'State' || field[key][0].fielddesc === 'State_P' || field[key][0].fielddesc === 'State_N') {
                            field[key][0].controlvalue = this.stateName.join('|');
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
      userid: this.userID,
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
      if (parentItem.fielddesc === 'State_N' || parentItem.fielddesc === 'State_C' || parentItem.fielddesc === 'State_P' || parentItem.fielddesc === 'State') {
        for (let i = 0; i < this.stateList.length; i++) {
          if (this.stateList[i].statename === parentItem.fieldvalue) {
            this.getDistricts(parentItem.fielddesc, this.stateList[i].id, obj, 'group', groupPosition);
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
      if (obj.fielddetails.fielddesc === "State" || obj.fielddetails.fielddesc === "State_P"
          || obj.fielddetails.fielddesc === "State_N" || obj.fielddetails.fielddesc === "State_C") {
        obj.fielddetails.controlvalue = this.stateName.join('|');
        for (let i = 0; i < this.stateList.length; i++) {
          if (this.stateList[i].statename === obj.fielddetails.fieldvalue) {
            this.getDistricts(obj.fielddetails.fielddesc, this.stateList[i].id, step, '', -1);
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

  closeModal(): void {
    this.modalService.dismissAll();
  }


  numberInWords(number: number) {
    return this.common.numberInWords(number + '');
  }

  onButtonClick(step: string, fieldId: string, obj: any, groupid: number = 0, groupposition: number = -1) {
    // console.log("\n step==  ", step, "\n fieldId==  ", fieldId, "\n groupid==  ", groupid, "\n groupposition==  ", groupposition);
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
            "userid": this.userID,
            "fieldid": Number(aadhaarFieldId),
            "stepid": Number(aadhaarStepId),
            "groupid": Number(groupid),
            "groupposition": Number(groupposition),
            "aadhaarno": aadhaarno
          };
          this.common.loaderStart();
          /*this.rest.generateAadhaarOTP(data).subscribe((res: any) => {
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
          });*/
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
            "userid": this.userID,
            "fieldid": Number(aadhaarFieldId),
            "stepid": Number(aadhaarStepId),
            "groupid": Number(groupid),
            "groupposition": Number(groupposition),
            "clientid": aadhaarClientID,
            "aadhaarOTP": aadhaarOTP,
            "isProfile": "true"
          };
          this.common.loaderStart()
          /*this.rest.submitAadhaarOTP(data).subscribe((res: any) => {
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
          });*/
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
            "userid": this.userID,
            "fieldid": Number(emailFieldId),
            "stepid": Number(emailStepId),
            "groupid": Number(groupid),
            "groupposition": Number(groupposition),
            "fieldvalue": emailid,
            "isRegistration": "false",
            "fieldtype": "Email",
          };
          this.common.loaderStart();
          /*this.rest.generateFieldOTP(data).subscribe((res: any) => {
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
          });*/
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
            "userid": this.userID,
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
          this.common.loaderStart()
          /*this.rest.submitFieldOTP(data).subscribe((res: any) => {
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
          });*/
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
            "userid": this.userID,
            "fieldid": Number(mobileFieldId),
            "stepid": Number(mobileStepId),
            "groupid": Number(groupid),
            "groupposition": Number(groupposition),
            "fieldvalue": mobileno,
            "isRegistration": "false"
          };
          this.common.loaderStart();
          /*this.rest.generateFieldOTP(data).subscribe((res: any) => {
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
          });*/
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
            "userid": this.userID,
            "fieldid": Number(mobileFieldId),
            "stepid": Number(mobileStepId),
            "groupid": Number(groupid),
            "groupposition": Number(groupposition),
            "clientid": mobileClientID,
            "verifyOTP": mobileOTP,
            "isProfile": "true",
            "isRegistration": "false"
          };
          this.common.loaderStart()
          /*this.rest.submitFieldOTP(data).subscribe((res: any) => {
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
          });*/
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
        const isvalidPan = true; //this.common.regpan.test(panno)
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
          this.common.loaderStart();
          /*this.rest.verifyPAN(data).subscribe((res: any) => {
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
          });*/
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
        this.common.loaderStart();
        /*this.rest.verifyDIN(data).subscribe((res: any) => {
          this.common.loaderEnd();
          if (res.success) {
            (<HTMLButtonElement>document.getElementById('verify_din_' + groupposition)).disabled = true;
            this.notifier.notify('success', res.message);
          } else {
            this.notifier.notify('error', res.message);
          }
        });*/
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
        this.common.loaderStart();
        /*this.rest.verifyGSTIN(data).subscribe((res: any) => {
          this.common.loaderEnd();
          if (res.success) {
            (<HTMLButtonElement>document.getElementById('Verify_GSTIN')).disabled = true;
            this.notifier.notify('success', res.message);
          } else {
            this.notifier.notify('error', res.message);
          }
        });*/
      } else {
        this.notifier.notify('error', 'GSTIN number is required')
      }
    } else {
      this.notifier.notify('error', 'Company name is required');
    }
  }

  hideOTPFieldBtns(pos: number = -1, sequence: number = -1, fieldSpc: string): void {
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
          try {
            (<HTMLButtonElement>document.getElementById('Request_for_OTP_aadhar_no_' + pos)).disabled = true;
          } catch(e) {
            (<HTMLButtonElement>document.getElementById('REQUEST_FOR_OTP_Adhaar_' + pos)).disabled = true;
          }
          (<HTMLInputElement>document.getElementById('Enter_Aadhaar_OTP_' + pos)).disabled = true;
          (<HTMLButtonElement>document.getElementById('label_Enter_Aadhaar_OTP_' + pos)).disabled = true;
          (<HTMLButtonElement>document.getElementById('Verify_Aadhaar_' + pos)).disabled = true;
          try{
            (<HTMLButtonElement>document.getElementById('Resend_OTP_Aadhaar_' + pos)).disabled = true;
          } catch (e) {}
          try{
            (<HTMLButtonElement>document.getElementById('RESEND_CODE_Aadhar_' + pos)).disabled = true;
          } catch (e) {}
          if (sequence === 1) {
            try {
              (<HTMLButtonElement>document.getElementById('Request_for_OTP_aadhar_no_' + pos)).disabled = false;
            } catch(e) {
              (<HTMLButtonElement>document.getElementById('REQUEST_FOR_OTP_Adhaar_' + pos)).disabled = false;
            }
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
        try{
          (<HTMLButtonElement>document.getElementById(Verify_email_id)).disabled = true;
          (<HTMLButtonElement>document.getElementById(Verify_email_id)).classList.remove("btn-primary:hover");
          (<HTMLInputElement>document.getElementById(Email_Verification_Code)).disabled = true;
          (<HTMLButtonElement>document.getElementById(label_Email_Verification_Code)).disabled = true;
          (<HTMLButtonElement>document.getElementById(Verify_Code_Email)).disabled = true;
          (<HTMLButtonElement>document.getElementById(Resend_Code_Email)).disabled = true;
        } catch(e){}
        if (sequence === 1) {
          try{
            (<HTMLButtonElement>document.getElementById(Verify_email_id)).disabled = false;
          } catch(e) {}
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
        this.timerIdForAadhaar = setInterval(() => {
          this.countdown(pos, sequence, timeLeft, fieldSpc)
        }, 1000);
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
        this.timerIdForAadhaar = setInterval(() => {
          this.countdown(pos, sequence, timeLeft, fieldSpc)
        }, 1000);
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
      this.timerIdForEmail = setInterval(() => {
        this.countdown(pos, sequence, timeLeft, fieldSpc)
      }, 1000);

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
      this.timerIdForMobile = setInterval(() => {
        this.countdown(pos, sequence, timeLeft, fieldSpc)
      }, 1000);

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

  openLink(file: any) {
    window.open(this.FILE_ROOT + file, '_blank');
  }

  onFocusElement(obj: any, step: string) {
    if (obj.fielddetails.fieldid === 409) {
      const directorArr = [];
      for (const d of this.formDetails[step]) {
        if (d.groupid && d.groupid === 20) {
          for(const fieldDtl of d.fielddetails) {
            if (fieldDtl['Name'] && fieldDtl['Name'][0].fieldvalue !== '') {
              directorArr.push(fieldDtl['Name'][0].fieldvalue);
            }
          }
          break;
        }
      }
      obj.fielddetails.controlvalue = directorArr.join('|');
    }
  }

  randomFromTo(from: number, to: number) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

}
