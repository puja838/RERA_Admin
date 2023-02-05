import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';

const routes: Routes = [{
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
}, {
    path: 'login',
    component: LoginComponent
}, {
    path: 'mst',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
}, {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
}];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
