import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";

const routes: Routes = [{
  path: '',
  loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingModule)
},   {
  path: 'login',
  component: LoginComponent
}, { path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
