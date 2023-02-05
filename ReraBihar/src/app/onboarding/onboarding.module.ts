import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { GalleryModule } from 'ng-gallery';
import { GALLERY_CONFIG } from 'ng-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GoogleMapsModule } from '@angular/google-maps'

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AboutUsComponent } from './about-us/about-us.component';
import { ByAoInterimComponent } from './by-ao-interim/by-ao-interim.component';
import { ByAoOrderComponent } from './by-ao-order/by-ao-order.component';
import { ByAuthorityInterimComponent } from './by-authority-interim/by-authority-interim.component';
import { ByAuthorityOrderComponent } from './by-authority-order/by-authority-order.component';
import { CauseListComponent } from './cause-list/cause-list.component';
import { DemoComponent } from './demo/demo.component';
import { FooterComponent } from './footer/footer.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';
import { MapComponent } from './map/map.component';
import { GalleryComponent } from './gallery/gallery.component';
import { SearchProjectDetailsComponent } from './search-project-details/search-project-details.component';
import { SearchComponent } from './search/search.component';
import { SearchPromoterDetailsComponent } from './search-promoter-details/search-promoter-details.component';
import { CourtProceedingsComponent } from './court-proceedings/court-proceedings.component';
import { SignificantJudgementComponent } from './significant-judgement/significant-judgement.component';
import { GoogleMapViewComponent } from './google-map-view/google-map-view.component';

const notifierDefaultOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12,
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: false,
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};

@NgModule({
  declarations: [
    MapComponent,
    OnboardingComponent,
    AboutUsComponent,
    ByAoInterimComponent,
    ByAoOrderComponent,
    ByAuthorityInterimComponent,
    ByAuthorityOrderComponent,
    CauseListComponent,
    DemoComponent,
    FooterComponent,
    WhatsNewComponent,
    GalleryComponent,
    SearchProjectDetailsComponent,
    SearchComponent,
    CourtProceedingsComponent,
    SignificantJudgementComponent,
    SearchPromoterDetailsComponent,
    GoogleMapViewComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    IvyCarouselModule,
    MatMenuModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxSpinnerModule,
    GalleryModule,
    MatTabsModule,
    NgbPaginationModule,
    NgxSliderModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    GoogleMapsModule,
  ],
  providers: [
    {
      provide: GALLERY_CONFIG,
      useValue: {
        dots: true,
        imageSize: 'cover'
      }
    }
  ],
  exports: [FooterComponent]
})
export class OnboardingModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

