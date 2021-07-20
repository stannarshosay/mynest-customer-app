import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LocationPage } from 'src/app/modals/location/location.page';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import { CategoryService } from 'src/app/services/category.service';
import { LocationService } from 'src/app/services/location.service';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import moment from 'moment';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  isGettingHomeTopImages:boolean = true;
  isGettingHomeBottomImages:boolean = true;
  showTopImages:boolean = true;
  showBottomImages:boolean = true;
  topAds:any[] = [];
  bottomAds:any[] = [];
  homeCategories=[];
  homeNewsfeeds = [];
  isNewsfeedLoaded:boolean = false;
  isNewsfeedAvailable:boolean = true;
  isCategoryLoaded:boolean = false;
  hasLocation:boolean = false;
  getLocationSetStatus:Subscription;
  selectedCategory:any = null;
  constructor(
    private categoryService:CategoryService,
    private locationService:LocationService,
    private newsfeedService:NewsfeedService,
    private adService:AdvertisementService,
    public modalController:ModalController,
    private navController:NavController
    ) {
   
  }

  ngOnInit(): void {  
    
  }
  ionViewWillEnter(){
    this.getLocationSetStatus = this.locationService.getLocationSetStatus().subscribe(res =>{
      this.hasLocation = res
    }); 
    this.getCategories();
    this.getNewsfeeds();
    this.getHomeAds("HOME_BANNER",true);
    this.getHomeAds("HOME_BANNER_BOTTOM",false);
  }
  ionViewWillLeave(){
    this.topAds = [];
    this.bottomAds = [];
    this.showBottomImages = true;
    this.showTopImages = true;
    this.isGettingHomeTopImages = true;
    this.isGettingHomeBottomImages = true;
    this.getLocationSetStatus.unsubscribe();
  }
  slideOpts = {
    speed: 400,
    loop:true,
    autoplay:true
  };
  slideNewsOpts = {
    slidesPerView:1.5,
    freeMode:true
  }
 getCategories(){
   this.homeCategories = [];
   this.isCategoryLoaded = false;
  this.categoryService.getHomeCategories().subscribe(res => {this.isCategoryLoaded = true,this.homeCategories = res.slice(0,10)});  
 }
  getNewsfeeds(){
    this.homeNewsfeeds = [];
    this.isNewsfeedLoaded =false;
    this.newsfeedService.getNewsfeeds(0,9).subscribe(res=>{
      this.isNewsfeedLoaded = true;
      if(res["success"]){
        this.homeNewsfeeds = res["data"]["content"];
      }else{
        this.isNewsfeedAvailable = false;
      }
    },
    error =>{
      this.isNewsfeedLoaded = true;
      this.isNewsfeedAvailable = false;
    });
  }
  getHomeAds(adType:string,isTop:boolean){ 
    this.adService.getHomeGalleryImagesByType(adType).subscribe(res=>{
      if(isTop){
        this.isGettingHomeTopImages = false;
      }else{
        this.isGettingHomeBottomImages = false;
      }
      if(res["success"]){
        if(isTop){
          this.topAds = res["data"];
          this.showTopImages = true;          
        }else{
          this.bottomAds = res["data"];
          this.showBottomImages = true;
        }
      }else{
        if(isTop){
          this.showTopImages = false;
        }else{
          this.showBottomImages =false;
        }
      }
    },error=>{
      if(isTop){
        this.isGettingHomeTopImages = false;
      }else{
        this.isGettingHomeBottomImages = false;
      }
    })
  }
  async locationSelector(){
    const modal = await this.modalController.create({
      component: LocationPage,
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
  checkLength(description:string){    
     if(description.length>80){
       return description.substring(0,80) +" ...";
     }
     return description;
  }
  getImagePath(image:any){
    if((image)&&(image!="")){
      return "https://mynestonline.com/collection/images/admin-advertisement/"+encodeURIComponent(image);
    }
    return "https://mynestonline.com/collection/images/admin-advertisement/"+encodeURIComponent("default.jpg");
  }
  getNewsfeedPath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  getShareLink(id:any){    
    return encodeURIComponent("https://mynestonline.com/customer/newsfeed/"+id);
  }
  getEncoded(data:any){
    return encodeURIComponent(data);
  }
  getAdLink(adLink:any){
    if((adLink)&&(adLink!="")){
      if (!/^http[s]?:\/\//.test(adLink)) {
          adLink = 'https://'+adLink;
      }
      window.open(
        adLink,
        '_blank'
      );
    }
  }
  getBeautifiedDate(dateString:string){
    let date = moment(dateString, "DD/MM/YYYY");
    if(date.isSame(moment(),'day')){
      return "Today";
    }
    if(date.isSame(moment().subtract(1,"days"),'day')){      
      return "Yesterday";
    }
    return date.format('Do MMM YYYY');
  }
  doRefresh(event:any) {
   this.getCategories();
   this.getNewsfeeds();
   this.topAds = [];
   this.bottomAds = [];
   this.showBottomImages = true;
   this.showTopImages = true;
   this.isGettingHomeTopImages = true;
   this.isGettingHomeBottomImages = true;
   this.getHomeAds("HOME_BANNER",true);
    this.getHomeAds("HOME_BANNER_BOTTOM",false);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  
}
