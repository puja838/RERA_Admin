import { Injectable } from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommonService} from "./services/common.service";
import {Router} from "@angular/router";
import {ConfigService} from "./services/config.service";

@Injectable({
  providedIn: 'root'
})
export class IntercepterService implements HttpInterceptor{

  constructor(private common: CommonService, private router: Router, private config: ConfigService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.common.getToken() !== null) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.common.getToken()}`,
        },
      });
    }
    let foo = {};
    if (request.method === 'POST') {
      if (request.body instanceof FormData) {
      } else {
        if(this.common.getUserId()) {
          foo = {userid: this.common.getUserId()};
        }
        let req = {};
        try{
          req = JSON.parse(request.body)
        } catch (e) {
          req = request.body;
        }
        request =  request.clone({
          body: {payload: this.common.encryptPayload({...req, ...foo})}
        })
      }
    }
    return next.handle(request).pipe(map((event1: HttpEvent<any>): any => {
      let event: any = event1;
      if (event1 instanceof HttpResponse) {
        if(event.url?.indexOf(this.config.CMS_URL) === -1
            && event.url?.indexOf(this.config.IFIX_URL) === -1) {
          try{
            const obj = this.common.decryptPayload(event.body);
            event.body = {};
            for (const key of Object.keys(obj)) {
              event.body[key] = obj[key]
            }
            // console.log('event.body >>>> ', event.url, event.body)
          } catch (e) {
            console.log(e)
          }
          if(event.body.status && event.body.status === 498) {
            this.common.clearUserData();
            this.router.navigate(['/']);
          } else {
            if(event.body.response) {
              event.body.response = this.common.decryptPayload(event.body.response)
            }
            
          }
        }
      }
      return event
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        // console.log(err);
        if (err.status === 400) {
          // redirect to the login route
          // or show a modal
          console.log('ERROR');
          // window.location.href = this.messageService.API_ROOT;
        }
      }
    }));
  }
}
