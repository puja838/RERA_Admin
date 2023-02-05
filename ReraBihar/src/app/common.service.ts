import {Injectable} from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  loadJsScript(src: string): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.body.appendChild(script);
  }
}
