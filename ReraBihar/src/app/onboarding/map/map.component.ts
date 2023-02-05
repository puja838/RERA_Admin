import {Component, AfterViewInit} from '@angular/core';
// import * as L from 'leaflet';
import {HttpClient} from '@angular/common/http';
import 'leaflet';
import {RestApiService} from "../../services/rest-api.service";
import {Router} from "@angular/router";
import {CommonService} from "../../services/common.service";

declare let L: any;


const iconRetinaUrl = 'assets/images/marker-icon-2x.png';
const iconUrl = 'assets/images/marker-icon.png';
const shadowUrl = 'assets/images/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

    // private map: any;
    markers: any = {};
    focusDistrict = '';
    setMarkerList: any = [];
    constructor(private http: HttpClient, private rest: RestApiService, private router: Router,
                private common: CommonService) {
    }

    ngAfterViewInit(): void {
        this.initMap();
        this.getProjectLatLong();
    }

    private initMap(): void {
        var map: any;
        var divStyle = 'padding: 6px 8px; font: 14px/16px Arial, Helvetica, sans-serif; background: white; background: rgba(255,255,255,0.8); box-shadow: 0 0 15px rgb(0 0 0 / 20%); border-radius: 5px;';
        map = L.map('map').setView([25.9, 85.88], 7);

        var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: ''
        }).addTo(map);

        tiles.addTo(map);

        // control that shows state info on hover
        var info = new L.Control();

        info.onAdd = function (map: any) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };

        info.update = function (props: any) {
            this._div.innerHTML = '<span style="color: #777; font-weight:600;">Registered Projects in Bihar</span><br/>' + (props ?
                '<span style="font-weight: 600;" id="distname"><i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;' + props.NAME_2 +
                '</span> <br/> &nbsp;&nbsp;&nbsp;&nbsp;' + props.ID_2 + '' : 'Hover over a district');
            this._div.style = divStyle;
        };

        info.addTo(map);


        // get color depending on population density value
        function getColor(d: any) {
            return d > 1000 ? '#800026' :
                d > 500 ? '#BD0026' :
                    d > 200 ? '#E31A1C' :
                        d > 100 ? '#FC4E2A' :
                            d > 50 ? '#FD8D3C' :
                                d > 20 ? '#FEB24C' :
                                    d > 10 ? '#FED976' : '#FFEDA0';
        }

        function style(feature: any) {
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: getColor(feature.properties.ID_2)
            };
        }

        function highlightFeature(e: any) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            info.update(layer.feature.properties);
        }

        var geojson: any;

        function resetHighlight(e: any) {
            geojson.resetStyle(e.target);
            info.update();
        }

        function zoomToFeature(e: any) {
            map.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature: any, layer: any) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }


        this.http.get('../../../assets/json/record_of_population_density.json').subscribe((storeData: any) => {
            this.rest.getAllRegisteredProjectCountDistrictwise().subscribe((res: any) => {
                if (res.success) {
                    for(const obj of storeData.features) {
                        res.response.map((item: any) => {
                            if (item.projectfieldvalue === obj.properties.NAME_2) {
                                obj.properties.ID_2 = item.totalCount;
                            }
                        })
                    }
                }
                /* global statesData */
                geojson = L.geoJson(storeData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
            });
        });

        map.attributionControl.addAttribution('');


        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map: any) {

            var div = L.DomUtil.create('div', 'info legend');
            var grades = [0, 10, 20, 50, 100, 200, 500, 1000];
            var labels = [];
            var from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + getColor(from + 1) + '">&nbsp;&nbsp;&nbsp;&nbsp;</i> ' +
                    from + (to ? '&ndash;' + to : '+'));
            }

            div.innerHTML = labels.join('<br>');
            div.style = divStyle;
            return div;
        };

        legend.addTo(map);
        map.on('click', (event: any) => {
            for (const obj of this.setMarkerList) {
                map.removeLayer(obj);
            }
            const distElem = <HTMLElement>document.getElementById('distname');
            if (distElem) {
                const districtName = distElem.innerText.trim();
                this.setMarkerList = [];
                if (this.markers[districtName]) {
                    for (const obj of this.markers[districtName]) {
                        let marker = new L.marker([obj.latitude, obj.longitude])
                            .bindPopup(obj.projectfieldvalue)
                            .addTo(map);
                        this.setMarkerList.push(marker);
                    }
                }
            }
        });
    }

    goToMap() {
        window.open(window.location.href+"/all-project-location", '_blank');
    }

    getProjectLatLong() {
        this.rest.getProjectLatLong().subscribe((res: any) => {
            if (res.success) {
                this.markers = this.common.groupBy(res.response, 'district');
            }
        });
    }

}
