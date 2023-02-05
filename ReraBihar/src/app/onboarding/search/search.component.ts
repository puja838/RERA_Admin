import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../services/common.service";
import {SearchService} from "../../services/search.service";
import {Options} from "@angular-slider/ngx-slider";
import {timeout} from "rxjs/operators";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
    private searchSubscribe: any;
    projects: any[] = [];
    promoters: any[] = [];
    selected: any[] = [];
    notselected: any[] = [];
    private keyword: string = '';
    carpetMinValue: number = 0;
    carpetHighValue: number = 0;
    currentOptions: Options = {
        floor: 0,
        ceil: 0
    };
    costMinValue: number = 0;
    costHighValue: number = 0;
    costCurrentOptions: Options = {
        floor: 0,
        ceil: 0
    };
    states: any[] = [];
    stateSelected: any;
    districts: any[] = [];
    distSelected: string = '';
    categories: any[] = [];
    catSelected: string = '';
    queries: any[] = [];
    promqueries: any[] = [];
    pincode: string = "";
    projectPage: any;
    projectSize: any;
    limit = 9;
    projectoffset = 0;
    promoteroffset = 0;
    promoterSize: any;
    promoterPage: any;

    constructor(private notifier: NotifierService, private route: Router,
                private apiService: SearchService, private common: CommonService, private activatedRoute: ActivatedRoute,) {
        /*this.searchSubscribe = this.common.fetchSearchData().subscribe((data) => {
            this.keyword = data.keyword;
            console.log(JSON.stringify(data))
            this.projectoffset = 0;
            this.promoteroffset = 0;
            if (data.category) {
                this.queries.push({
                    "stepid": 1,
                    "fieldid": 1,
                    "value": data.category,
                    "key": "category"
                })
            }
            if (this.keyword !== "") {
                this.search(this.keyword, ['Promoter', 'Project'], this.queries, this.promqueries, '')
            }
        });*/
    }

    ngOnInit(): void {
        // console.log(this.keyword)
        this.projectPage = 1;
        this.promoterPage = 1;
        this.projectSize = 120;
        this.activatedRoute.queryParams.subscribe(
            params => {
                /*console.log(JSON.stringify(this.queries))
                console.log(params['keyword']);
                console.log(params['category']);*/
                const category = params['category'];
                this.keyword = params['keyword'];
                // console.log(JSON.stringify(data))
                this.projectoffset = 0;
                this.promoteroffset = 0;
                this.queries = [];
                this.promqueries = [];
                let type=['Promoter', 'Project'];
                if (category) {
                    this.queries.push({
                        "stepid": 1,
                        "fieldid": 1,
                        "value": category,
                        "key": "category"
                    });
                    if(!this.keyword){
                        type=['Project']
                    }
                }
                if (this.keyword !== "") {
                    this.search(this.keyword,type , this.queries, this.promqueries, '')
                }
            });

        // setTimeout(() => {
        //     if (this.keyword === "") {
        //         this.search(this.keyword, ['Promoter', 'Project'], this.queries, this.promqueries, '')
        //     }
        // }, 100)
    }

    openFilter() {
        // document.getElementsByClassName('filtersec_dv')[0].
        $(".filtersec_dv").addClass("open_filter");


        // const newOptions1: Options = Object.assign({}, this.costCurrentOptions);
        // newOptions1.ceil = 700;
        // this.costCurrentOptions = newOptions1;
        // this.costMinValue = 30;
        // this.costHighValue = 420;
        this.getState();
        this.fetchProjectType();
        this.maxFieldValue(16, 679).then((res: any) => {
            const maxunit = res.response[0].maximum;
            const newOptions: Options = Object.assign({}, this.currentOptions);
            newOptions.ceil = maxunit;
            this.currentOptions = newOptions;
            this.carpetMinValue = 0;
            this.carpetHighValue = maxunit;
        })
    }

    closeFilter() {
        $(".filtersec_dv").removeClass("open_filter");
    }

    ngOnDestroy(): void {
        if (this.searchSubscribe) {
            this.searchSubscribe.unsubscribe()
        }
    }

    fetchProjectType(): any {
        const data = {reraid: this.common.getReraId()};
        this.apiService.fetchProjectType(data).subscribe((res: any) => {
            if (res.success) {
                this.categories = res.response[0].controlvalue.split('|');
                this.categories.shift();
                this.categories.unshift('Select Project Type')
                this.catSelected = 'Select Project Type'
            } else {
                this.notifier.notify('error', 'You are not permitted')
            }
        });
    }

    maxFieldValue(stepid: number, fieldid: number): any {
        const promise = new Promise((resolve, reject) => {
            const data = {reraid: this.common.getReraId(), stepid: stepid, fieldid: fieldid};
            this.apiService.maxFieldValue(data).subscribe((res: any) => {
                if (res.success) {
                    resolve(res)
                } else {
                    this.notifier.notify('error', res.message)
                    reject()
                }
            }, () => {
                reject()
            });
        });
        return promise;
    }

    getState(): any {
        this.states = [];
        const data = {reraid: this.common.getReraId()};
        this.apiService.getState(data).subscribe((res: any) => {
            if (res.success) {
                this.states = res.response;
                this.stateSelected = 4;
                this.getDistricts();
            } else {
                this.notifier.notify('error', res.message)
            }
        });
    }

    getDistricts(): any {
        const data = {stateid: this.stateSelected};
        this.apiService.getDistricts(data).subscribe((res: any) => {
            if (res.success) {
                this.districts = res.response;
                this.districts.unshift({cityname: "Select District"})
                this.distSelected = "Select District";
            } else {
                this.notifier.notify('error', res.message)
            }
        });
    }

    search(keyword: string, type: any[], queries: any[], promqueries: any[], page = '') {
        // console.log(keyword)
        const data = {
            reraid: this.common.getReraId(),
            keyword: keyword,
            type: type,
            queries: queries,
            promqueries: promqueries,
            limit: this.limit,
            projectOffset: this.projectoffset,
            promoterOffset: this.promoteroffset
        };
        // console.log(JSON.stringify(data))
        this.common.loaderStart();
        this.apiService.search(data).subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                if (page === 'prom') {
                    this.promoters = res.response.promoter;
                } else if (page === 'proj') {
                    this.projects = res.response.project;
                } else {
                    this.projects = res.response.project;
                    this.promoters = res.response.promoter;
                }
                if (this.promoteroffset === 0 && res.response.promcountresp.length > 0) {
                    this.promoterSize = res.response.promcountresp[0].usercount;
                    // if()
                }
                if (this.projectoffset === 0 && res.response.projcountresp.length > 0) {
                    this.projectSize = res.response.projcountresp[0].projectcount;
                }
                if (page === '') {
                    // console.log(this.projects.length)
                    // console.log(this.selected)
                    if (this.projects.length > 0) {

                        if (this.selected.indexOf('Project') === -1) {
                            this.selected.push('Project');
                            if (this.notselected.indexOf('Project') > -1) {
                                this.notselected.splice(this.notselected.indexOf('Project'), 1)
                            }
                        }
                    } else {
                        if (this.notselected.indexOf('Project') === -1) {
                            this.notselected.push('Project');
                            if (this.selected.indexOf('Project') > -1) {
                                this.selected.splice(this.selected.indexOf('Project'), 1);
                            }
                        }
                    }
                    if (this.promoters.length > 0) {
                        if (this.selected.indexOf('Promoter') === -1) {
                            this.selected.push('Promoter');
                            if (this.notselected.indexOf('Promoter') > -1) {
                                this.notselected.splice(this.notselected.indexOf('Promoter'), 1);
                            }
                        }
                    } else {
                        if (this.notselected.indexOf('Promoter') === -1) {
                            this.notselected.push('Promoter')
                            if (this.selected.indexOf('Promoter') > -1) {
                                this.selected.splice(this.selected.indexOf('Promoter'), 1)
                            }
                        }
                    }
                    // console.log(this.selected)
                }
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err: any) => {
            this.common.loaderEnd();
        })

    }

    openProjects(id: any) {
        this.route.navigate(['/searchProject/' + id]);
    }

    openPromoter(id: any) {
        // console.log(id);
        this.route.navigate(['/searchPromoter/' + id]);
    }

    deselect(val: any, i: number) {
        this.projectoffset = 0;
        this.promoteroffset = 0;
        this.selected.splice(i, 1);
        // this.notselected.push(val);
        this.search(this.keyword, this.selected, this.queries, this.promqueries, '');
    }

    select(val: any, i: any) {
        this.projectoffset = 0;
        this.promoteroffset = 0;
        this.notselected.splice(i, 1);
        this.selected.push(val);
        this.search(this.keyword, this.selected, this.queries, this.promqueries, '');
    }

    apply() {
        if (this.pincode.trim() !== "") {
            this.queries.push({"stepid": 1, "fieldid": 10, "value": [this.pincode], "key": "pin"})
            this.promqueries.push({"stepid": 9, "fieldid": 21, "value": [this.pincode], "key": "pin"})
        } else {
            if (this.distSelected.trim() !== "" || this.distSelected.trim() !== "Select District") {
                this.queries.push({
                    "stepid": 1,
                    "fieldid": 514,
                    "value": [this.distSelected.trim()],
                    "key": "district"
                })
                this.promqueries.push({
                    "stepid": 9,
                    "fieldid": 19,
                    "value": [this.distSelected.trim()],
                    "key": "district"
                })
            }
        }
        if (this.catSelected !== "Select Project Type") {
            this.queries.push({
                "stepid": 1,
                "fieldid": 1,
                "value": this.catSelected.trim(),
                "key": "category"
            })
        }
        this.queries.push({
            "stepid": 16,
            "fieldid": 679,
            "value": this.carpetMinValue,
            "value1": this.carpetHighValue,
            "key": "carpet"
        });
        this.projectoffset = 0;
        this.promoteroffset = 0;
        this.search(this.keyword, this.selected, this.queries, this.promqueries, '')
        this.closeFilter()
    }

    reset() {
        this.distSelected = '';
        this.pincode = '';
        this.catSelected = '';
    }

    onProjectPageChange(page: any) {
        this.projectoffset = this.limit * (page - 1);
        this.search(this.keyword, ['Project'], this.queries, this.promqueries, 'proj');
        // console.log(page)
    }

    onPromoterPageChange(page: any) {
        this.promoteroffset = this.limit * (page - 1);
        console.log(page, this.promoteroffset);
        this.search(this.keyword, ['Promoter'], this.queries, this.promqueries, 'prom');
    }
}
