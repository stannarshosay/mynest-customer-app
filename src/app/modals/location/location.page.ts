import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  locationList = [];
  isLoaded:boolean = false;
  constructor(
    public modalCtrl:ModalController,
    private locationService:LocationService
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.getAllLocations(); 
  }
  dismiss(shouldRedirect:boolean){
    this.modalCtrl.dismiss({
      'dismissed': shouldRedirect
    });
  }
  getAllLocations(){
    this.locationService.getLocations().subscribe(res => {
      this.locationList = res,
      this.isLoaded = true;
    });
  }
  saveLocation(location:any){
    localStorage.setItem("locId",location.locationId);
    localStorage.setItem("loc",location.district);
    this.locationService.hasLocation.next(true);
    this.dismiss(true);
  }
  doRefresh(event:any) {
    this.isLoaded =false;
    this.getAllLocations();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
