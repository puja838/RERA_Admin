import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from './pages.component';
import {MstEntityComponent} from './mst-entity/mst-entity.component';
import {MstEntityTypeComponent} from './mst-entity-type/mst-entity-type.component';
import {MstEntityMapComponent} from './mst-entity-map/mst-entity-map.component';
import {MstStageComponent} from './mst-stage/mst-stage.component';
import {MstFieldsComponent} from './mst-fields/mst-fields.component';
import {FieldsGroupComponent} from './fields-group/fields-group.component';
import {EntityTypeStepFieldsComponent} from './entity-type-step-fields/entity-type-step-fields.component';
import {MstProfileFieldsComponent} from './mst-profile-fields/mst-profile-fields.component';
import {MstProfileFieldsGroupComponent} from './mst-profile-fields-group/mst-profile-fields-group.component';
import {MstProfileStepFieldsComponent} from './mst-profile-step-fields/mst-profile-step-fields.component';
import {MstBusinessUnitTypeComponent} from "./mst-business-unit-type/mst-business-unit-type.component";
import {MstWorkflowComponent} from "./mst-workflow/mst-workflow.component";
import {MstBusinessUnitComponent} from "./mst-business-unit/mst-business-unit.component";
import {MstWorkflowStepsComponent} from "./mst-workflow-steps/mst-workflow-steps.component";
import {MstWorkflowStepsWorksComponent} from "./mst-workflow-steps-works/mst-workflow-steps-works.component";
import {MstStepsWorksComponent} from "./mst-steps-works/mst-steps-works.component";
import {MstWorkflowStepsRoleComponent} from "./mst-workflow-steps-role/mst-workflow-steps-role.component";
import {MstWorkflowStepsRoleUserChecklistComponent} from "./mst-workflow-steps-role-user-checklist/mst-workflow-steps-role-user-checklist.component";
import {MstWorkflowStepsRoleUserComponent} from "./mst-workflow-steps-role-user/mst-workflow-steps-role-user.component";
import {MstRoleComponent} from './mst-role/mst-role.component';
import {MstUsersComponent} from './mst-users/mst-users.component';
import {MstChecklistTabMapComponent} from "./mst-checklist-tab-map/mst-checklist-tab-map.component";
import {MstChecklistGroupComponent} from "./mst-checklist-group/mst-checklist-group.component";
import {MstChecklistTabMasterComponent} from "./mst-checklist-tab-master/mst-checklist-tab-master.component";
import {MstFileVerifyComponent} from "./mst-file-verify/mst-file-verify.component";
import {MstChecklistFieldMapComponent} from './mst-checklist-field-map/mst-checklist-field-map.component';
import {MstNoticeboardComponent} from './mst-noticeboard/mst-noticeboard.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [{
        path: 'entity',
        component: MstEntityComponent
    }, {
        path: 'entity-type',
        component: MstEntityTypeComponent
    }, {
        path: 'entity-type-map',
        component: MstEntityMapComponent
    }, {
        path: 'stage',
        component: MstStageComponent
    }, {
        path: 'project-fields',
        component: MstFieldsComponent
    }, {
        path: 'fields-group',
        component: FieldsGroupComponent
    }, {
        path: 'entitytype-step-fields',
        component: EntityTypeStepFieldsComponent
    }, {
        path: 'profile-fields',
        component: MstProfileFieldsComponent
    }, {
        path: 'profile-fields-group',
        component: MstProfileFieldsGroupComponent
    }, {
        path: 'profile-step-fields',
        component: MstProfileStepFieldsComponent
    }, {
        path: 'business-unit-type',
        component: MstBusinessUnitTypeComponent
    }, {
        path: 'business-unit',
        component: MstBusinessUnitComponent
    }, {
        path: 'workflow',
        component: MstWorkflowComponent
    }, {
        path: 'workflow-step',
        component: MstWorkflowStepsComponent
    }, {
        path: 'step-works',
        component: MstStepsWorksComponent
    }, {
        path: 'workflow-step-works',
        component: MstWorkflowStepsWorksComponent
    }, {
        path: 'workflow-step-role',
        component: MstWorkflowStepsRoleComponent
    }, {
        path: 'workflow-steps-role-user-checklist',
        component: MstWorkflowStepsRoleUserChecklistComponent
    }, {
        path: 'workflow-steps-role-user',
        component: MstWorkflowStepsRoleUserComponent
    }, {
        path: 'user-role',
        component: MstRoleComponent
    }, {
        path: 'users',
        component: MstUsersComponent
    }, {
        path: 'checklistTabMap',
        component: MstChecklistTabMapComponent
    }, {
        path: 'checklistTabMaster',
        component: MstChecklistTabMasterComponent
    }, {
        path: 'checklistGroup',
        component: MstChecklistGroupComponent
    }, {
        path: 'file-verify',
        component: MstFileVerifyComponent
    }, {
        path: 'checklist-field-map',
        component: MstChecklistFieldMapComponent
    }, {
        path: 'noticeboard',
        component: MstNoticeboardComponent
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
