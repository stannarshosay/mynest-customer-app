import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LocationPage } from 'src/app/modals/location/location.page';
import { CategoryService } from 'src/app/services/category.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  homeCategories=[];
  isCategoryLoaded:boolean = false;
  hasLocation:boolean = false;
  selectedCategory:any = null;
  constructor(
    private categoryService:CategoryService,
    private locationService:LocationService,
    private navController:NavController,
    private modalController:ModalController
  ) { }

  ngOnInit() {
  }
  doRefresh(event:any) {
    this.getCategories();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter(): void {
    this.locationService.getLocationSetStatus().subscribe(res =>{
      this.hasLocation = res
    }); 
    this.getCategories();
  }
  getCategories(){
    this.isCategoryLoaded = false;
    this.homeCategories = [];
    this.selectedCategory = null;
    this.categoryService.getAllCategories().subscribe(res => {this.isCategoryLoaded = true,this.homeCategories = res["data"]});
  }
  async locationSelector(){
    const modal = await this.modalController.create({
      component: LocationPage
    });
    modal.onDidDismiss().then((data) => {
      if(data['data']['dismissed']&&this.selectedCategory){
        this.navController.navigateForward(['providers/'+encodeURIComponent(this.selectedCategory.categoryName)+"/"+this.selectedCategory.categoryId]); 
      }
      this.selectedCategory = null;
    });
    return await modal.present();
  }
  goToVendorListing(category:any){
    if(this.hasLocation){
      this.navController.navigateForward(['providers/'+encodeURIComponent(category.categoryName)+"/"+category.categoryId]);
    }else{
      this.selectedCategory = category;
      this.locationSelector();
    }
}
}
