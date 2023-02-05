import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NgxSpinnerModule } from "ngx-spinner";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { NgMaterialMultilevelMenuModule, MultilevelMenuService } from 'ng-material-multilevel-menu';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { MstEntityComponent } from './mst-entity/mst-entity.component';
import { MstEntityTypeComponent } from './mst-entity-type/mst-entity-type.component';
import { MstEntityMapComponent } from './mst-entity-map/mst-entity-map.component';
import { MstStageComponent } from './mst-stage/mst-stage.component';
import { MstFieldsComponent } from './mst-fields/mst-fields.component';
import { FieldsGroupComponent } from './fields-group/fields-group.component';
import { EntityTypeStepFieldsComponent } from './entity-type-step-fields/entity-type-step-fields.component';
import { MstProfileFieldsComponent } from './mst-profile-fields/mst-profile-fields.component';
import { MstProfileFieldsGroupComponent } from './mst-profile-fields-group/mst-profile-fields-group.component';
import { MstProfileStepFieldsComponent } from './mst-profile-step-fields/mst-profile-step-fields.component';
import {MstBusinessUnitTypeComponent} from "./mst-business-unit-type/mst-business-unit-type.component";
import {MstWorkflowComponent} from "./mst-workflow/mst-workflow.component";
import {MstBusinessUnitComponent} from "./mst-business-unit/mst-business-unit.component";
import {MstStepsWorksComponent} from './mst-steps-works/mst-steps-works.component';
import {MstWorkflowStepsComponent} from './mst-workflow-steps/mst-workflow-steps.component';
import {MstWorkflowStepsWorksComponent} from './mst-workflow-steps-works/mst-workflow-steps-works.component';
import {MstWorkflowStepsRoleComponent} from "./mst-workflow-steps-role/mst-workflow-steps-role.component";
import {MstWorkflowStepsRoleUserChecklistComponent} from "./mst-workflow-steps-role-user-checklist/mst-workflow-steps-role-user-checklist.component";
import {MstWorkflowStepsRoleUserComponent} from "./mst-workflow-steps-role-user/mst-workflow-steps-role-user.component";
import { MstRoleComponent } from './mst-role/mst-role.component';
import { MstUsersComponent } from './mst-users/mst-users.component';
import { MstChecklistTabMapComponent } from './mst-checklist-tab-map/mst-checklist-tab-map.component';
import { MstChecklistTabMasterComponent } from './mst-checklist-tab-master/mst-checklist-tab-master.component';
import { MstChecklistGroupComponent } from './mst-checklist-group/mst-checklist-group.component';
import {MstFileVerifyComponent} from "./mst-file-verify/mst-file-verify.component";
import { MstChecklistFieldMapComponent } from './mst-checklist-field-map/mst-checklist-field-map.component';
import { MstNoticeboardComponent } from './mst-noticeboard/mst-noticeboard.component';

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
    MstFileVerifyComponent,
    MstChecklistTabMapComponent,
    MstChecklistTabMasterComponent,
    MstChecklistGroupComponent,
    PagesComponent,
    MstEntityComponent,
    MstEntityTypeComponent,
    MstEntityMapComponent,
    MstStageComponent,
    MstFieldsComponent,
    FieldsGroupComponent,
    EntityTypeStepFieldsComponent,
    MstProfileFieldsComponent,
    MstProfileFieldsGroupComponent,
    MstProfileStepFieldsComponent,
    MstBusinessUnitTypeComponent,
    MstWorkflowComponent,
    MstBusinessUnitComponent,
    MstStepsWorksComponent,
    MstWorkflowStepsComponent,
    MstWorkflowStepsWorksComponent,
    MstWorkflowStepsRoleComponent,
    MstWorkflowStepsRoleUserChecklistComponent,
    MstWorkflowStepsRoleUserComponent,
    MstRoleComponent,
    MstUsersComponent,
    MstChecklistFieldMapComponent,
    MstNoticeboardComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    FormsModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    NgxSpinnerModule,
    DragDropModule,
    MatSelectModule,
    MatExpansionModule,
    ScrollingModule,
    NgMaterialMultilevelMenuModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [MultilevelMenuService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
