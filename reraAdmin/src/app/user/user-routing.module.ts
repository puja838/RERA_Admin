import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {AuthguardGuard} from '../Authorization/authguard.guard'
import {MstEntityComponent} from "../pages/mst-entity/mst-entity.component";
import {ProjectListComponent} from "./project-list/project-list.component";
import {WorkflowChecklistComponent} from "./workflow-checklist/workflow-checklist.component";
import {WorkflowComponent} from "./workflow/workflow.component";
import {ProjectListDashboardComponent} from "./project-list-dashboard/project-list-dashboard.component";


let RegisterListComponent;
const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashborad',
    pathMatch: 'full'
  }, {
    path: '', component: UserComponent, children: [{
      path: 'dashborad',
      component: ProjectListDashboardComponent
    },{
      path: 'projectList',
      component: ProjectListComponent
    },{
      path: 'projectDetails',
      component: WorkflowComponent
    },{
      path:'registerProjectList',
      component:RegisterListComponent
    }
    ]
  }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
