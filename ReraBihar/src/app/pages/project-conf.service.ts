import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProjectConfService {
    sectionPlanSpecification: any = [{
        proposed: "Proposed_table_field",
        sanctioned: "Sanctioned_table_field",
        reason: "Reason_for_Difference_if_Any_table_field"
    }, {
        proposed: "Proposed_Buildings_table_field",
        sanctioned: "Sanctioned_Buildings_table_field",
        reason: "Reason_for_Difference_if_Any_Buildings_table_field"
    }, {
        proposed: "Proposed_Recreational_table_field",
        sanctioned: "Sanctioned_Recreational_table_field",
        reason: "Reason_for_Difference_if_Any_Recreational_table_field"
    }, {
        proposed: "Proposed_Nu_table_field",
        sanctioned: "Sanctioned_Nu_table_field",
        reason: "Reason_for_Difference_if_Any_Nu_table_field"
    }, {
        proposed: "Proposed_to_table_field",
        sanctioned: "Sanctioned_to_table_field",
        reason: "Reason_for_Difference_if_Any_to_table_field"
    }, {
        proposed: "Proposed_Number_table_field",
        sanctioned: "Sanctioned_number_table_field",
        reason: "Reason_for_Difference_if_Any_Number_table_field"
    }, {
        proposed: "Proposed_cover_table_field",
        sanctioned: "Sanctioned_cover_table_field",
        reason: "Reason_for_Difference_if_Any_cover_table_field"
    }, {
        proposed: "Proposed_ga_table_field",
        sanctioned: "Sanctioned_ga_table_field",
        reason: "Reason_for_Difference_if_Any_ga_table_field"
    }, {
        proposed: "Proposed_area_table_field",
        sanctioned: "Sanctioned_area_table_field",
        reason: "Reason_for_Difference_if_Any_area_table_field"
    }, {
        proposed: "proposed_total",
        sanctioned: "sanctioned_total",
        reason: "reason_total"
    }, {
        proposed: "proposed_covered",
        sanctioned: "sanctioned_covered",
        reason: "reason_covered"
    }];

    areaElemList: any = {
        Unit_Carpet_Area_sq_mtr: 'Total_Carpet_Area_sq_mtr',
        Unit_Open_Terrace_Atea: 'Total_Open_terrace_Area',
        Unit_Balcony_Verandah_Area: 'Total_Balcony_Verandah_Area'
    };

    shopElemList: any = {
        Shop_Type_by_Carpet_Area: 'C_Total_Carpet_Area_sqm',
        Unit_Open_Terrace_Atea_C: 'C_Total_Open_terrace_Area',
        C_Unit_Balcony_Verandah_Area: 'C_Total_Balcony_Verandah_Area'
    };
    buildingDetailsDisableFieldList: any = ['Total_Carpet_Area_sq_mtr_', 'C_Total_Carpet_Area_sqm_', 'C_Total_Open_terrace_Area_', 'C_Total_Balcony_Verandah_Area_', 'Total_Balcony_Verandah_Area_', 'Total_Open_terrace_Area_'];
    constructor() {
    }

    checkAndDisable(): any {
        for (const obj of this.sectionPlanSpecification) {
            const pElem = <HTMLInputElement>document.getElementById(obj.proposed);
            const sElem = <HTMLInputElement>document.getElementById(obj.sanctioned);
            const rElem = <HTMLInputElement>document.getElementById(obj.reason);
            if (pElem && sElem && rElem) {
                if (pElem.value !== '' && sElem.value !== '' && pElem.value !== sElem.value) {
                    rElem.disabled = false;
                } else {
                    rElem.disabled = true;
                }
            }
        }
    }

    checkRelativeValueAndAction(fielddesc: string): any {
        for (const obj of this.sectionPlanSpecification) {
            if (obj.proposed === fielddesc || obj.sanctioned === fielddesc) {
                const pElem = <HTMLInputElement>document.getElementById(obj.proposed);
                const sElem = <HTMLInputElement>document.getElementById(obj.sanctioned);
                const rElem = <HTMLInputElement>document.getElementById(obj.reason);
                if (obj.proposed === fielddesc) {
                    sElem.value = pElem.value;
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

    disableCalculationFieldList(fieldList: any = []) {
        for (const field of fieldList) {
            try{
                const elems: any = document.querySelectorAll('[id^="' + field + '"]');
                for (let i = 0; i < elems.length; i++) {
                    elems[i].disabled = true;
                }
            } catch (e) {}
        }
    }
}
