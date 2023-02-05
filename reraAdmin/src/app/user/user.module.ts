import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {ProjectListComponent} from './project-list/project-list.component';
import {WorkflowChecklistComponent} from './workflow-checklist/workflow-checklist.component';
import {ProjectDetailsComponent} from './project-details/project-details.component';
import {ProfileViewComponent} from "./profile-view/profile-view.component";
import {CalenderComponent} from "./calender/calender.component";

import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {NgxSpinnerModule} from "ngx-spinner";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { WorkflowComponent } from './workflow/workflow.component';
import {DeleteConfirmationModalComponent} from "./delete-confirmation-modal/delete-confirmation-modal.component";
// import { CKEditorModule } from 'ngx-ckeditor';
import {ProjectEntesionDtlComponent} from "./project-entesion-dtl/project-entesion-dtl.component";
import {AgentDetailsComponent} from "./agent-details/agent-details.component";
import {ProjectListDashboardComponent} from "./project-list-dashboard/project-list-dashboard.component";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxPaginationModule } from 'ngx-pagination';

const notifierDefaultOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
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
    ProjectListDashboardComponent,
    UserComponent,
    ProjectListComponent,
    WorkflowChecklistComponent,
    ProjectDetailsComponent,
    ProfileViewComponent,
    CalenderComponent,
    WorkflowComponent,
    DeleteConfirmationModalComponent,
    ProjectEntesionDtlComponent,
    AgentDetailsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatTabsModule,
    FormsModule,
    MatRadioModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    NgxSpinnerModule,
    MatCheckboxModule,
    AngularEditorModule,
    NgxPaginationModule
  ]
})
export class UserModule {
}
