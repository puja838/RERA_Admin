import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {Observable} from 'rxjs';
import {CommonService} from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGurdService implements CanActivate, CanActivateChild {

  constructor(private router: Router, private common: CommonService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userId = this.common.getUserId();
    if (userId !== null && userId !== undefined) {
      // console.log('------Authenticate Parent-----------');
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // console.log('------Authenticate Child-----------');
    return this.canActivate(route, state);
  }
}
