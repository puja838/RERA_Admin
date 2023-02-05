import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';
// import { AboutUsComponent } from './about-us/about-us.component';
import { ByAoInterimComponent } from './by-ao-interim/by-ao-interim.component';
import { ByAoOrderComponent } from './by-ao-order/by-ao-order.component';
import { ByAuthorityInterimComponent } from './by-authority-interim/by-authority-interim.component';
import { ByAuthorityOrderComponent } from './by-authority-order/by-authority-order.component';
import { CauseListComponent } from './cause-list/cause-list.component';
import { DemoComponent } from './demo/demo.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';
import { GalleryComponent } from './gallery/gallery.component';
import {SearchComponent} from "./search/search.component";
import {SearchProjectDetailsComponent} from "./search-project-details/search-project-details.component";
import { CourtProceedingsComponent } from './court-proceedings/court-proceedings.component';
import { SignificantJudgementComponent } from './significant-judgement/significant-judgement.component';
import {SearchPromoterDetailsComponent} from "./search-promoter-details/search-promoter-details.component";
import { GoogleMapViewComponent } from './google-map-view/google-map-view.component';

const routes: Routes = [{
  path: '',
  component: OnboardingComponent,
  children: [
    { path: 'demo', component: DemoComponent },
    {path: 'by-authority-order', component: ByAuthorityOrderComponent},
    {path: 'by-authority-interim', component: ByAuthorityInterimComponent},
    {path: 'by-ao-order', component: ByAoOrderComponent},
    {path: 'by-ao-interim', component: ByAoInterimComponent},
    {path: 'whats-new', component: WhatsNewComponent},
    {path: 'cause-list', component: CauseListComponent},
    {path: 'gallery', component: GalleryComponent},
    {path: 'search', component: SearchComponent},
    {path: 'searchProject/:projectuid', component: SearchProjectDetailsComponent},
    {path: 'searchPromoter/:promoterid', component: SearchPromoterDetailsComponent},
    {path: 'court-proceedings', component: CourtProceedingsComponent},
    {path: 'significant-judgement', component: SignificantJudgementComponent},
    {path: 'all-project-location', component: GoogleMapViewComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
