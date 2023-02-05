import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToContact() {
    this.router.navigate(
        ['/'],
        {queryParams: {u: 'contact-us'}}
    );
    window.scrollTo(0, 0)
  }

}
