import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-google-map-view',
  templateUrl: './google-map-view.component.html',
  styleUrls: ['./google-map-view.component.css']
})
export class GoogleMapViewComponent implements OnInit {
  apiLoaded: Observable<boolean>;
  markers: any = [];
  mapOptions: google.maps.MapOptions = {
    center: { lat: 25.612677, lng: 85.158875 },
    zoom: 13
  };
  constructor(private rest: RestApiService, httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyCv265f5fyTXXsvfJPC17oDlKsgcLkM88c', 'callback')
        .pipe(
            map(() => true),
            catchError(() => of(false)),
        );
  }

  ngOnInit(): void {
    this.rest.getProjectLatLong().subscribe((res: any) => {
      if (res.success) {
        this.markers = [];
        for (const obj of res.response) {
          this.markers.push({
            position: { lat: obj.latitude, lng: obj.longitude },
            title: obj.projectfieldvalue
          });
        }
      }
    })
  }

}
