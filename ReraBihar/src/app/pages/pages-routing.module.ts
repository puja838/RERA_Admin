import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ProjectComponent } from './project/project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { RegistrationComponent } from './profile/registration/registration.component';
import { ProfileDetailsComponent } from './profile/profile-details/profile-details.component';
import {AuthGurdService} from "../services/auth-gurd.service";
import { WorkflowChecklistComponent } from './workflow-checklist/workflow-checklist.component';
import { PostApproveUpdateProjectComponent } from './post-approve-update-project/post-approve-update-project.component';
import { AnnualReportComponent } from './annual-report/annual-report.component';
import { ProjectExecutionComponent } from './project-execution/project-execution.component';
import { ProjectExecutionEditComponent } from './project-execution-edit/project-execution-edit.component';
import {AgentRegistrationComponent} from './agents/registration/registration.component';
import {AgentRegisterComponent} from './agents/agent-register/agent-register.component';
import { RegistrationApplicationComponent } from './agents/registration-application/registration-application.component';
import { DashboardComponent } from './agents/dashboard/dashboard.component';
import { ProjectExtensionDtlComponent } from './project-extension-dtl/project-extension-dtl.component';
import { PromoterResponseComponent } from './promoter-response/promoter-response.component';
import { ViewQueryComponent } from './view-query/view-query.component';
import { PromoterQueryDashboardComponent } from './promoter-query-dashboard/promoter-query-dashboard.component';
import { ProjectExtensionListComponent } from './project-extension-list/project-extension-list.component';
import { AlertNotifucationComponent } from './alert-notifucation/alert-notifucation.component';
import { PreviewDetailsComponent } from './preview-details/preview-details.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children:[{
    path: 'project/:id/:isComplete/:projectuid',
    canActivate: [AuthGurdService],
    canActivateChild: [AuthGurdService],
    component: ProjectComponent
  },{
    path: 'project-details/:id/:isComplete/:projectuid',
    canActivate: [AuthGurdService],
    canActivateChild: [AuthGurdService],
    component: ProjectDetailsComponent
  }, {
    path: 'project-dashboard',
    canActivate: [AuthGurdService],
    canActivateChild: [AuthGurdService],
    component: ProjectDashboardComponent
  }, {
    path: 'registration',
    component: RegistrationComponent
  }, {
    path: 'profile-details',
    canActivate: [AuthGurdService],
    canActivateChild: [AuthGurdService],
    component: ProfileDetailsComponent
  }, {
    path: 'checklist',
    component: WorkflowChecklistComponent
  }, {
    path: 'update-project/:id/:isComplete/:projectuid',
    component: PostApproveUpdateProjectComponent
  }, {
    path: 'annual-report',
    component: AnnualReportComponent
  }, {
    path: 'project-execution/:id/:isComplete/:projectuid',
    component: ProjectExecutionComponent
  }, {
    path: 'project-execution-details/:id/:projectuid/:quoterid/:quoterName',
    component: ProjectExecutionEditComponent
  }, {
    path: 'agent-registration',
    component: AgentRegistrationComponent
  }, {
    path: 'agent-register',
    component: AgentRegisterComponent
  }, {
    path: 'agent-registration-application',
    component: RegistrationApplicationComponent
  }, {
    path: 'agent-dashboard',
    component: DashboardComponent
  }, {
    path: 'project-extension-dtl/:projectId/:projectuid/:extensionid',
    component: ProjectExtensionDtlComponent
  }, {
    path: 'queryDashboard',
    component: PromoterQueryDashboardComponent
  }, {
    path: 'viewQuery/:projectid',
    component: ViewQueryComponent
  }, {
    path: 'queryResponse/:projectid/:queryid',
    component: PromoterResponseComponent
  }, {
    path: 'project-extension',
    component: ProjectExtensionListComponent
  },{
    path: 'alert-notification-view',
    component: AlertNotifucationComponent
  },{
    path: 'preview-details',
    component: PreviewDetailsComponent
  },{
    path: 'preview-project',
    component: PreviewComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
