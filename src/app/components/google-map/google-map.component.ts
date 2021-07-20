import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit {

  @Input('apiKey') apiKey: string;
  @Input('markerLat') markerLat: any;
  @Input('markerLng') markerLng: any;

    public map: any;

    constructor(private element: ElementRef){
    }

    ngOnInit(){

      let latLng = new google.maps.LatLng(this.markerLat,this.markerLng);

      let mapOptions = {
          center: latLng,
          zoom: 15,
          gestureHandling: "none",
          keyboardShortcuts: false,
          zoomControl: false,
          disableDefaultUI:true,
          clickableIcons: false
      };

      this.map = new google.maps.Map(this.element.nativeElement, mapOptions);
      this.addMarker(this.markerLat,this.markerLng);
      


    }    
    public addMarker(lat: number, lng: number): void {

        let latLng = new google.maps.LatLng(lat, lng);

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });

    }
    ngOnDestroy():void{      
    }

}
