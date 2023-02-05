import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

import {Router} from "@angular/router";
import {CommonService} from "../services/common.service";

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {

  constructor(private router: Router, private common: CommonService) {
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userid');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.isLoggedIn();
    if (!isAuthenticated) {
      this.router.navigate(['/']);
    }
    this.common.isLoggedIn();
    return isAuthenticated;
  }

}
