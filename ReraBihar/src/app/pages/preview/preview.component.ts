import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  stepListShow: any = []
  formDetails: any = []
  FILE_ROOT: any
  fullscreenImage: any = ''

  isAccept: boolean = true
  signatureImg = '';
  totalAmount = 1;
  isPreventRegistration: boolean = false
  isDataBlank: boolean = false
  totalLandArea:any=0
  constructor(private common: CommonService, private rest: RestApiService, public print: NgxPrintElementService, private router: Router) {
    this.FILE_ROOT = this.rest.FILE_ROOT;
  }

  ngOnInit(): void {
    this.stepListShow = this.common.stepListShow;
    this.formDetails = this.common.formDetails;
    this.signatureImg = this.common.signatureImg
    this.isAccept = this.common.isAccept

    if (this.common.totalAmount != '') {
      this.totalAmount = this.common.totalAmount
    } else {
      this.totalAmount = this.totalAmount
    }

    this.isPreventRegistration = this.common.isPreventRegistration
    this.isDataBlank = this.common.isDataBlank
    this.totalLandArea = this.common.totalLandArea
    if (this.stepListShow.length == 0 && this.formDetails.length == 0) {
      history.back()
    }
    // })
  }

  numberInWords(number: number) {
    return this.common.numberInWords(number + '');
  }

  openLink(file: any) {
    window.open(this.FILE_ROOT + file, '_blank');
  }

  showFullScreenView() {
    const element = <HTMLElement>document.getElementById('fullscrn');
    if (element) {
      element.classList.remove('hide-elem');
    }
  }

  showImageFullScreen(imageName: string) {
    this.fullscreenImage = this.FILE_ROOT + imageName;
    this.showFullScreenView()
  }

  openGoogleMaps(pos = -1) {
    let long: any = '';
    let lat: any = '';
    if (pos === -1) {
      try {
        long = (<HTMLInputElement>document.getElementById('Geo_Location_Lon')).value;
      } catch {
        if (long === undefined || long === null || long === '') {
          try {
            long = (<HTMLInputElement>document.getElementById('Geographic_Other_Location')).value;
          } catch (e) {
            long = null
          }
        }
      }
      lat = (<HTMLInputElement>document.getElementById('Geographic_Location')).value;
    } else {
      lat = (<HTMLInputElement>document.getElementById('sLatitude_table_fiels_' + pos)).value;
      long = (<HTMLInputElement>document.getElementById('sLongitude_' + pos)).value;
    }
    if (long && lat) {
      window.open('https://www.google.com/maps/search/?api=1&query=' + lat + ',' + long, '_blank');
    }
  }

  closeFullScreenView() {
    const element = <HTMLElement>document.getElementById('fullscrn');
    if (element) {
      element.classList.add('hide-elem');
      this.fullscreenImage = '';
    }
  }

  back(){
    history.back()
  }

}
