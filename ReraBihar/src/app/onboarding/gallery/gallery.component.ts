import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  mainFolder = true;
  eventImg = false;
  workshop = false;
  bhagalpurEvent = false;
  constructor() { }

  ngOnInit(): void {
  }

  showImg(type: number) {
    this.eventImg = false;
    this.workshop = false;
    this.bhagalpurEvent = false;
    if (type === 1) {
      this.mainFolder = false;
      this.eventImg = true;
    } else if (type === 2) {
      this.mainFolder = false;
      this.workshop = true;
    } else if (type === 3) {
      this.mainFolder = false;
      this.bhagalpurEvent = true;
    }
  }

  backToAlbum() {
    this.eventImg = false;
    this.workshop = false;
    this.bhagalpurEvent = false;
    this.mainFolder = true;
  }

}
