import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminGuard implements CanActivate {
  constructor(private router: Router) { }

  isLoggedIn():boolean{
    if (localStorage.getItem('user'))
    {
      //console.log('Token=  ',localStorage.getItem('userdtl'))
      return true
    }
    return false;
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("is ac.............")
      var isAuthenticated = this.isLoggedIn();
      //console.log("au....",isAuthenticated);
      
      if (!isAuthenticated) {
          this.router.navigate(['/']);
      }
      const uType=localStorage.getItem('user')
      if(uType){
        if(JSON.parse(uType).roleid != 1)
        {
          this.router.navigate(['/user']);

        }
      }
  
    
      return isAuthenticated;
  }
  
}
