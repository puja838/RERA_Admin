import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule} from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {IvyCarouselModule} from 'angular-responsive-carousel';

import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {ProjectComponent} from './project/project.component';
import {ProjectDashboardComponent} from './project-dashboard/project-dashboard.component';
import {RegistrationComponent} from './profile/registration/registration.component';
import {ProfileDetailsComponent} from './profile/profile-details/profile-details.component';
import {ProjectDetailsComponent} from './project-details/project-details.component';
import {WorkflowChecklistComponent} from './workflow-checklist/workflow-checklist.component';
import {CalenderComponent} from './shared/calender/calender.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ProfileViewComponent} from './profile/profile-view/profile-view.component';
import {DeleteConfirmationModalComponent} from './shared/delete-confirmation-modal/delete-confirmation-modal.component';
import {PostApproveUpdateProjectComponent} from './post-approve-update-project/post-approve-update-project.component';
import {AnnualReportComponent} from './annual-report/annual-report.component';
import {OnboardingModule} from "../onboarding/onboarding.module";
import {ProjectExecutionComponent} from './project-execution/project-execution.component';
import {ProjectExecutionEditComponent} from './project-execution-edit/project-execution-edit.component';
import {AgentRegistrationComponent} from './agents/registration/registration.component';
import {AgentRegisterComponent} from './agents/agent-register/agent-register.component';
import { RegistrationApplicationComponent } from './agents/registration-application/registration-application.component';
import { DashboardComponent } from './agents/dashboard/dashboard.component';
import { ProjectExtensionDtlComponent } from './project-extension-dtl/project-extension-dtl.component';
import { ProjectDtlShortViewComponent } from './shared/project-dtl-short-view/project-dtl-short-view.component';
import { PromoterResponseComponent } from './promoter-response/promoter-response.component';
import { ViewQueryComponent } from './view-query/view-query.component';
import { PromoterQueryDashboardComponent } from './promoter-query-dashboard/promoter-query-dashboard.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { NotificationViewComponent } from './notification-view/notification-view.component';
import { ProjectExtensionListComponent } from './project-extension-list/project-extension-list.component';
import { AlertNotifucationComponent } from './alert-notifucation/alert-notifucation.component';
import { PreviewDetailsComponent } from './preview-details/preview-details.component';
import { PreviewComponent } from './preview/preview.component';


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
        PagesComponent,
        ProjectComponent,
        ProjectDashboardComponent,
        RegistrationComponent,
        ProfileDetailsComponent,
        ProjectDetailsComponent,
        WorkflowChecklistComponent,
        CalenderComponent,
        ProfileViewComponent,
        DeleteConfirmationModalComponent,
        PostApproveUpdateProjectComponent,
        AnnualReportComponent,
        ProjectExecutionComponent,
        ProjectExecutionEditComponent,
        AgentRegistrationComponent,
        AgentRegisterComponent,
        RegistrationApplicationComponent,
        DashboardComponent,
        ProjectExtensionDtlComponent,
        ProjectDtlShortViewComponent,
        PromoterResponseComponent,
        ViewQueryComponent,
        PromoterQueryDashboardComponent,
        DashboardHeaderComponent,
        NotificationViewComponent,
        ProjectExtensionListComponent,
        AlertNotifucationComponent,
        PreviewDetailsComponent,
        PreviewComponent
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        MatTabsModule,
        FormsModule,
        MatMenuModule,
        NgxSpinnerModule,
        NotifierModule.withConfig(notifierDefaultOptions),
        MatRadioModule,
        MatSelectModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        }),
        OnboardingModule,
        NgxPaginationModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        IvyCarouselModule
    ],
    entryComponents: [
        DeleteConfirmationModalComponent
    ]
})
export class PagesModule {
}

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
