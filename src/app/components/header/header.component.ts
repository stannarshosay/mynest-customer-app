import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LocationPage } from 'src/app/modals/location/location.page';
import { SearchPage } from 'src/app/modals/search/search.page';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input('title') title:string;  
  hasLocation:boolean = false;
  getLocationSetStatus:Subscription; 
  isSearched:boolean = false;
  constructor(
    private locationService : LocationService,
    public modalController: ModalController,
    private toastController:ToastController,
    private navController:NavController
    ) {    
  }
  
  ngOnInit(): void {
    this.getLocationSetStatus = this.locationService.getLocationSetStatus().subscribe(res =>{
      this.hasLocation = res;
      if(!this.hasLocation){
        this.locationSelector();
      }
    }); 
  }
   ngOnDestroy():void{
     this.getLocationSetStatus.unsubscribe();
   }
  
  async locationSelector(){
    const modal = await this.modalController.create({
      component: LocationPage
    });
    modal.onDidDismiss().then((data) => {
        if(data['data']['dismissed']&&this.isSearched){
          this.isSearched = false;
          this.goToSearch();
        }
    });
    return await modal.present();
  }
  async openSearchModal(){
    const modal = await this.modalController.create({
      component: SearchPage,
    });
    modal.onDidDismiss().then((data) => {
      this.isSearched = false;
      if(data['data']['dismissed']){
        this.goToCategories(data['data']['category']);
      }
  });
    return await modal.present();    
  }
  goToCategories(category:any){
    if(category.isCategory){
      this.navController.navigateForward(['providers/'+encodeURIComponent(category.categoryName)+"/"+category.categoryId]);
    }else{
      this.navController.navigateForward(['providers/'+encodeURIComponent(category.categoryName)+"/"+category.categoryId+"/"+encodeURIComponent(category.name)]);
    }
  }
  goToSearch(){
    if(this.hasLocation){
      this.openSearchModal();
    }else{
      this.isSearched = true;
      this.locationSelector();
    }
  }
  async showSnackbar(text:string,closingText:string){
    
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration:2000,
      buttons: [
       {
          text: closingText,
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
