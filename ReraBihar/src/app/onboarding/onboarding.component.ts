import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonService } from "../services/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuServiceService } from './menu-service.service';
import { RestApiService } from "../services/rest-api.service";

@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit, AfterViewInit {
    languageList = [
        { id: 'en', name: 'English' },
        { id: 'hn', name: 'हिंदी' },
    ];
    lang = '';
    navItems = [] as any;
    sideItem = [] as any;
    hide = true;
    hide2 = false;
    hide3 = false;
    htmlContent = '' as any;
    linkPath = '' as any;
    url = '' as any;
    orderbyurl: any;
    routing: any;
    menuId = '' as any;
    currentURL = '' as any;
    menuIcon = '' as any;
    urlSet = [] as any;
    isDemoShow = false;
    keyword = '';
    noticeList: any = [];
    newsList: any = [];
    FILE_URL = '';
    regProjectCount = 0;
    regAgent = 0;
    completedProject = 0;
    complaintsResolved = 0;
    projectCountDist: any = [];
    selectedSize = 2;

    constructor(private common: CommonService, private rest: MenuServiceService, public translate: TranslateService,
        private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer,
        private restApi: RestApiService) {
        translate.addLangs(['en', 'hn']);
        translate.setDefaultLang('en');
        this.FILE_URL = this.restApi.FILE_URL;
    }

    ngOnInit(): void {
        this.common.getLanguage();
        if (this.common.language != null || this.common.language != undefined) {
            this.translate.use(this.common.language);
        } else {
            this.switchLang('en');
            this.translate.use('en');
        }
        this.getMenuData();
        setTimeout(() => {
            this.getDataByUrl()
        }, 250);
        this.getOnboardingCountData();

    }

    getCaroselType() {
        let type = this.common.getCaroselType()
        if (type !== '') {
            console.log(type)
            if (type == 'imp_notic') {
                let news1 = document.getElementById('imp_notic')
                if (news1 != null) {
                    news1.scrollIntoView()

                    let pos = news1.style.position;
                    let top = news1.style.top;
                    news1.style.position = 'relative';
                    news1.style.top = '-150px';
                    news1.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    news1.style.top = top;
                    news1.style.position = pos;
                }
            } else if (type == 'latest_news') {
                let news = document.getElementById('latest_news')
                if (news != null) {
                    // news.scrollIntoView()
                    let pos = news.style.position;
                    let top = news.style.top;
                    news.style.position = 'relative';
                    news.style.top = '-80px';
                    news.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    news.style.top = top;
                    news.style.position = pos;

                }
            }
        }
    }

    getOnboardingCountData() {


        this.restApi.getOnboardingCountData({ reraid: this.common.getReraId() }).subscribe((res: any) => {
            if (res.success) {
                this.regProjectCount = res.response.regProjectCount;
                this.regAgent = res.response.regAgent;
                this.completedProject = res.response.completedProject;
                this.complaintsResolved = res.response.complaintsResolved;
                this.projectCountDist = res.response.projectCountDist;
                this.getNotices('news');
                this.getNotices('notice');
            }
        })
    }

    getNotices(type: string): void {
        const data = {
            type: type,
            start: 0,
            limit: 10
        };
        this.restApi.getNotices(data).subscribe((res: any) => {
            if (res.success) {
                if (type === 'news') {
                    for (const obj of res.response) {
                        this.newsList.push({
                            content: obj.subject,
                            date: this.common.getDateStr(obj.dateofnotice),
                            file: obj.document,
                            img: obj.bannarimage
                        })
                    }
                } else {
                    for (const obj of res.response) {
                        this.noticeList.push({
                            content: obj.subject,
                            date: this.common.getDateStr(obj.dateofnotice),
                            file: obj.document,
                            img: obj.bannarimage
                        })
                    }
                }
            }
        })
    }

    openFile(file: string) {
        window.open(this.FILE_URL + 'news/' + file, '_blank');
    }

    searchKeyword() {
        if (this.keyword.trim() !== "") {
            if (this.router.url.indexOf('/search') === -1) {
                this.hide = false;
                this.hide2 = false;
                this.hide3 = true;

            }
            this.router.navigate(['search'], { queryParams: { keyword: this.keyword } })
            this.keyword = '';
            // console.log(this.keyword)
            /*setTimeout(()=>{
                this.common.sendSearchData({keyword: this.keyword});
            },10)*/

        }
    }

    redirectTo(url: string, flag = ''): void {
        if (flag === 'feedback') {
            url = this.restApi.FEEDBACK_URL;
        } else if (flag === 'legal') {
            url = this.restApi.CGM_APP_URL;
        } else if (flag === 'admin') {
            url = this.restApi.PRM_ADMIN_URL;
        } else if (flag === 'userguide') {
            url = this.restApi.FILE_URL + 'pdf/New_System_User_Guide.pdf';
        } else if (flag === 'CGM') {
            url = this.restApi.CGM_URL;
        } else if (flag === 'grievance_login') {
            url = this.restApi.CGM_URL + 'testIFIX';
        } else if (flag === 'grievance') {
            this.getGrievance();
        }
        if (flag !== 'grievance') {
            window.open(url, '_blank');
        }
    }

    switchLang(lang: string) {
        this.common.setLanguage(lang)
        this.translate.use(lang);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            // this.common.loadJsScript('assets/js/jquery.min.js');
            // this.common.loadJsScript('assets/js/bootstrap.min.js');
            // this.common.loadJsScript('assets/js/owl.carousel.min.js');
            // this.common.loadJsScript('assets/js/responsiveslides.min.js');
            this.common.loadJsScript('assets/js/script.js');
            // this.common.loadJsScript('assets/js/custome.js');
        }, 1000)
    }

    goTo(path: string): any {
        if (path === 'http://20.219.31.104:8092') {
            window.open(path, "_blank");
        } else {
            this.router.navigate([path]);
        }
    }

    goToWithParam(path: string, params: any) {
        this.router.navigate([path], {
            queryParams: params
        });
    }

    whatsNewFun(path: any): any {

        this.router.navigate([path]);
        this.hide = false;
        this.hide2 = false;
        this.hide3 = true;

        console.log("Button Click")

    }


    getDataByUrl(): any {


        this.hide = true;
        this.hide2 = false;
        this.hide3 = false;


        this.route.queryParams
            .subscribe(params => {
                // console.log(params); // { orderby: "price" }
                this.orderbyurl = params['u'];
                // console.log(this.orderbyurl); // price

                if (this.orderbyurl) {
                    this.hide2 = true;
                    this.hide = false;
                    this.hide3 = false;
                    this.isDemoShow = false;
                    var data = {
                        menuUrl: this.orderbyurl
                    };

                    // setTimeout(() => {
                    //     this.common.loadJsScript('assets/js/script1.js');
                    // }, 3000);
                    if (this.orderbyurl === 'demo') {
                        this.hide2 = true;
                        this.isDemoShow = true;
                    } else {
                        this.isDemoShow = false;
                    }

                    this.rest.getMenuContentbyURL(data).subscribe((result) => {
                        if (result.response.success) {
                            if (result.response.menuDetail.menuType == 'html') {
                                this.hide2 = true;
                                this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(result.response.menuDetail.content);
                                this.menuId = result.response.menuDetail.menuId

                                // console.log(this.menuId)

                                for (let item of this.navItems) {
                                    // console.log(item)

                                    if (item.menuId == this.menuId) {
                                        // console.log(this.menuId)

                                        if (item.children.length == 0) {
                                            this.sideItem = [];
                                            this.sideItem.push(item)
                                            //  console.log("Array Empty", this.sideItem)
                                            //  console.log("Array",this.sideItem)
                                        } else {
                                            this.sideItem = item.children;
                                            // console.log("Array2",this.sideItem)
                                        }
                                    }
                                    for (let child of item.children) {
                                        if (child.menuId == this.menuId) {
                                            // console.log(this.menuId)
                                            this.sideItem = item.children;
                                            // console.log(this.sideItem)
                                            this.openBlock = child.menuId
                                            this.openBlockChild = '';
                                        }
                                        for (let subchild of child.children) {
                                            if (subchild.menuId == this.menuId) {
                                                // console.log(this.menuId)
                                                this.sideItem = item.children;
                                                this.openBlock = child.menuId
                                                this.openBlockChild = subchild.menuId
                                            }

                                        }
                                    }

                                }


                            }
                        }
                    })
                } else {
                    this.currentURL = window.location.href;
                    // console.log(this.currentURL)
                    try {
                        if (this.currentURL.split('/')[4] && this.currentURL.split('/')[4] !== '#') {
                            this.hide = false;
                            this.hide3 = true;
                            this.hide2 = false;
                            console.log('1 if')
                        } else {
                            this.hide = true;
                            this.hide3 = false;
                            this.hide2 = false;
                            console.log('1 else')
                        }
                    } catch (e) {
                        this.hide = true;
                        this.hide3 = false;
                        this.hide2 = false;
                        console.log('catch')
                    }
                    if (this.router.url.indexOf('/cause-list') > -1 || this.router.url.indexOf('/demo') > -1
                        || this.router.url.indexOf('/search') > -1
                        || this.router.url.indexOf('/searchProject') > -1
                        || this.router.url.indexOf('/court-proceedings') > -1
                        || this.router.url.indexOf('/significant-judgement') > -1
                        || this.router.url.indexOf('/all-project-location') > -1
                        || this.router.url.indexOf('/gallery') > -1) {
                        this.hide = false;
                        this.hide2 = false;
                        this.hide3 = true;

                    }
                }
            }
            );

    }

    imageObject = [{
        image: 'assets/images/bannr-img1.png',
        thumbImage: 'assets/images/bannr-img1.png',

    }, {
        image: 'assets/images/bannr-img2.png',
        thumbImage: 'assets/images/bannr-img2.png',

    }];

    openBlock = ''


    menuItem(item: any): any {
        this.openBlock = item
        this.openBlockChild = ''

        // console.log(data)

        var data = {
            menuId: item
        }

        this.rest.getMenuContent(data).subscribe((result) => {
            // console.log(result)
            if (result.response.success) {
                // this.htmlContent = result.response.menuDetail.content
                // this.url = result.response.menuDetail.menuUrl
                // // console.log("menuItem", result.response)
                // this.router.navigate(
                //   ['/header'],
                //   { queryParams: { u: this.url } }
                // );
                // // console.log(result.response)

                if (result.response.menuDetail.menuType == 'html') {
                    // console.log("Print HTML")
                    this.hide2 = true;
                    this.htmlContent = result.response.menuDetail.content
                    this.url = result.response.menuDetail.menuUrl
                    // this.menuIcon = result.response.menuDetail.icon
                    // console.log("nav", result.response)
                    // this.router.navigate(["/header"]);
                    this.router.navigate(
                        ['/'],
                        { queryParams: { u: this.url } }
                    );
                }

                if (result.response.menuDetail.menuType == 'link') {
                    // console.log("Print Link")
                    this.linkPath = result.response.menuDetail.link
                    this.hide3 = true;
                    this.router.navigate(["/", this.linkPath]);
                }
            }
        })

    }


    menuItem2(item: any): any {

        if (this.openBlock == '') {
            this.openBlock = item
        } else {
            this.openBlock = ''
        }


        // console.log(item)
    }

    openBlockChild = ''

    menuItemChild(item: any, item2: any): any {
        console.log('menuItemChild');
        this.openBlock = item2;
        this.openBlockChild = item;
        // console.log(data)
        const data = {
            menuId: item
        };

        this.rest.getMenuContent(data).subscribe((result) => {
            // console.log(result)
            if (result.response.success) {
                // this.htmlContent = result.response.menuDetail.content
                // this.url = result.response.menuDetail.menuUrl
                // // console.log("menuItem2", result.response)
                // this.router.navigate(
                //   ['/header'],
                //   { queryParams: { u: this.url } }
                // );
                if (result.response.menuDetail.menuType == 'html') {
                    // console.log("Print HTML")
                    this.hide2 = true;
                    this.htmlContent = result.response.menuDetail.content
                    this.url = result.response.menuDetail.menuUrl
                    // this.menuIcon = result.response.menuDetail.icon
                    // console.log("nav", result.response)
                    // this.router.navigate(["/header"]);
                    this.router.navigate(
                        ['/'],
                        { queryParams: { u: this.url } }
                    );
                }

                if (result.response.menuDetail.menuType == 'link') {
                    // console.log("Print Link")
                    this.linkPath = result.response.menuDetail.link
                    this.hide3 = true
                    this.router.navigate(["/", this.linkPath]);
                }
            }
        })

    }


    indexFun(): any {
        this.hide = true;
        this.hide2 = false;
        this.hide3 = false
        this.router.navigate(
            ['/']
        );
        this.clearMenuSelectionAndSet({}, 1)
    }

    clearMenuSelectionAndSet(itemObj: any, flag = 0) {
        for (const item of this.navItems) {
            item.selectedClass = '';
        }
        if (flag === 0) {
            itemObj.selectedClass = 'mselected';
        }
    }

    navFun(data: any, item: any, itemObj: any): any {
        console.log('navFun');
        this.clearMenuSelectionAndSet(itemObj);
        this.hide = true;
        this.hide2 = false;
        this.hide3 = false;
        this.sideItem = data
        this.htmlContent = ''
        this.openBlock = item

        var datas = {
            menuId: item
        }

        this.rest.getMenuContent(datas).subscribe((result) => {

            if (result.response.success) {
                if (result.response.menuDetail.menuType == 'html') {
                    // console.log("Print HTML")
                    this.hide = false;
                    this.hide2 = true;
                    this.htmlContent = result.response.menuDetail.content;
                    this.url = result.response.menuDetail.menuUrl;
                    // this.menuIcon = result.response.menuDetail.icon
                    // console.log("nav", result.response)
                    // this.router.navigate(["/header"]);
                    this.router.navigate(
                        ['/'],
                        { queryParams: { u: this.url } }
                    );
                }

                if (result.response.menuDetail.menuType == 'link') {
                    // console.log("Print Link")

                    this.linkPath = result.response.menuDetail.link;

                    if (this.linkPath === 'enterfeedback') {
                        this.hide = true;
                        this.hide2 = false;
                        this.hide3 = false;
                        this.redirectTo('', 'feedback');
                    } else if (this.linkPath === 'grievance') {
                        this.hide = true;
                        this.hide2 = false;
                        this.hide3 = false;
                        // this.redirectTo('', 'grievance');
                        this.getGrievance();
                    } else {
                        this.hide = false;
                        this.hide2 = false;
                        this.hide3 = true;
                        this.router.navigate(["/", this.linkPath]);
                    }
                }
            }
        })
    }

    getGrievance() {
        this.common.loaderShow();
        this.restApi.getGrievance().subscribe((res: any) => {
            this.common.loaderEnd();
            if (res.success) {
                window.open(res.details.finalURl, '_blank');
            }
        })
    }

    navFun2(data: any, data2: any, data3: any, data4: any, itemObj: any): any {
        console.log('navFun2');
        this.clearMenuSelectionAndSet(itemObj);
        // this.hide = false;
        // this.hide2 = true;
        this.sideItem = data
        this.htmlContent = ''

        var datas = {
            menuId: data4
        }

        this.rest.getMenuContent(datas).subscribe((result) => {


            // console.log(result.response)
            if (result.response.success) {

                if (result.response.menuDetail.menuType == 'html') {
                    // console.log("Print HTML")
                    this.hide2 = true;
                    this.htmlContent = result.response.menuDetail.content
                    // console.log("nav2", result.response)
                    // this.router.navigate(["/header"]);

                    // if(result.response.menuDetail.children==0){
                    //   this.sideItem = result.response.menuDetail.name
                    // }
                    this.url = result.response.menuDetail.menuUrl
                    this.router.navigate(
                        ['/'],
                        { queryParams: { u: this.url } }
                    );
                } else if (result.response.menuDetail.menuType == 'link') {
                    // console.log("Print Link")
                    this.linkPath = result.response.menuDetail.link
                    this.hide3 = true;
                    this.hide = false;
                    this.router.navigate(["/", this.linkPath]);
                }

            }
        })

    }

    navFun3(item: any, data: any): any {
        console.log('navFun3');
        this.clearMenuSelectionAndSet(data);
        this.hide = false;
        this.hide2 = false;
        this.hide3 = false;
        this.htmlContent = ''
        this.openBlock = item

        if (data.children.length == 0) {
            this.sideItem = [];
            this.sideItem.push(data)
        }


        // console.log(data)
        // console.log(item)

        var datas = {
            menuId: item
        }

        this.rest.getMenuContent(datas).subscribe((result) => {
            // console.log(result.response)
            if (result.response.success) {

                // console.log(result.response)

                if (result.response.menuDetail.menuType == 'html') {
                    // console.log("Print HTML")
                    this.hide2 = true;
                    this.htmlContent = result.response.menuDetail.content;
                    this.url = result.response.menuDetail.menuUrl;
                    // this.sideItem = result.response.menuDetail.name
                    // this.router.navigate(["/header"]);

                    // if(result.response.menuDetail.children==0){
                    //   this.sideItem = result.response.menuDetail.name
                    // }

                    this.router.navigate(
                        ['/'],
                        { queryParams: { u: this.url } }
                    );
                }

                if (result.response.menuDetail.menuType == 'link') {
                    // console.log("Print Link")
                    this.linkPath = result.response.menuDetail.link
                    this.hide3 = true
                    this.router.navigate(["/", this.linkPath]);
                }
            }
        })
    }

    getMenuData(): any {
        var data = {}
        this.rest.getFullMenu(data).subscribe((result) => {
            if (result.response.success) {
                if (result.response.menuList) {
                    this.navItems = result.response.menuList;
                    this.urlSet = result.response.urlSet;
                    // console.log(result.response)
                    for (let url of this.urlSet) {
                        for (let item of this.navItems) {
                            item.selectedClass = '';
                            if (item.menuId == url.menuId) {
                                item.icon = url.icon
                            }
                            for (let child of item.children) {
                                if (child.menuId == url.menuId) {
                                    child.icon = url.icon
                                }
                                for (let ochild of child.children) {
                                    if (ochild.menuId == url.menuId) {
                                        ochild.icon = url.icon
                                    }

                                }
                            }

                        }
                    }
                    this.getCaroselType()
                }
            }
        })

    }

    searchProject(category: string) {
        if (this.router.url.indexOf('/search') === -1) {
            this.hide = false;
            this.hide2 = false;
            this.hide3 = true;
            // this.router.navigate(['search'])
        }
        let params: any = { category: category }
        if (this.keyword !== '') {
            params.keyword = this.keyword
        }
        this.keyword = '';
        this.router.navigate(['search'], { queryParams: params })

        // console.log(this.keyword)
        /*setTimeout(()=>{
            this.common.sendSearchData({keyword:this.keyword,category:category});
        },10)*/
    }

    onChangeSize(flag: number) {
        this.selectedSize = flag;
        const bodyElem: any = document.getElementsByTagName('body');
        if (bodyElem && bodyElem.length > 0) {
            switch (flag) {
                case 1:
                    bodyElem[0].className = 'mat-typography sm-wb-site';
                    break;
                case 2:
                    bodyElem[0].className = 'mat-typography md-wb-site';
                    break;
                case 3:
                    bodyElem[0].className = 'mat-typography lg-wb-site';
                    break;
                default:
                    console.log('No Match');
            }
        }
    }

}
