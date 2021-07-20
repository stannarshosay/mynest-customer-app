import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ForgotPasswordPage } from 'src/app/modals/forgot-password/forgot-password.page';
import { ImageViewerPage } from 'src/app/modals/image-viewer/image-viewer.page';
import { LoginPage } from 'src/app/modals/login/login.page';
import { ReportVendorPage } from 'src/app/modals/report-vendor/report-vendor.page';
import { SignupPage } from 'src/app/modals/signup/signup.page';
import { CategoryService } from 'src/app/services/category.service';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { ProvidersService } from 'src/app/services/providers.service';
declare var jQuery: any;

@Component({
  selector: 'app-provider',
  templateUrl: './provider.page.html',
  styleUrls: ['./provider.page.scss'],
})
export class ProviderPage implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isGettingGalleryImages:boolean = false;
  isGettingProfileDetails:boolean = true;
  vendorId:string;
  adLink:any = null;
  serviceAd:string = encodeURIComponent("default.jpg");
  hasLoggedIn:boolean = false;
  getLoginSetStatus:Subscription;
  provider:any = {};
  services:any = [];
  imageGallery = [];
  slideOpts = {
    speed: 400,
    autoplay:true
  };
  constructor(
    private modalController:ModalController,
    private route:ActivatedRoute,
    private providerService:ProvidersService,
    private categoryService:CategoryService,
    private snackBar:MatSnackBar,
    private metaService:Meta,
    private loginService:LoginService,
    private chatService:ChatService,
    private navController:NavController
  ) {

   }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.getAllDetails();   
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res=>{  
      this.hasLoggedIn = res;    
    });    
  }
  ionViewWillLeave(){
    this.getLoginSetStatus.unsubscribe();
  }
  getAllDetails(){
    this.route.paramMap.subscribe(params => {
      this.vendorId = params.get('vendorId');  
    });
    this.getProvider();
    this.getOfferedServices();
    this.getGalleryImages();
  }
  async openLoginDialog(){
    if(!this.hasLoggedIn){
      const modal = await this.modalController.create({
        component: LoginPage
      });
      modal.onDidDismiss().then((data) => {
          if(data['data']['dismissed']){
            if(data['data']['shouldOpen']=="signup"){
              this.openSignup();
            }else if(data['data']['shouldOpen']=="forgot"){
              this.openForgotPassword();
            }
          }
      });
      return await modal.present();
    }
  }  
  async openSignup(){
    if(!this.hasLoggedIn){
      const modal = await this.modalController.create({
        component: SignupPage
      });
      modal.onDidDismiss().then((data) => {
          if(data['data']['dismissed']){
            if(data['data']['shouldOpen']=="login"){
              this.openLoginDialog();
            }
          }
      });
      return await modal.present();
    }
  }  
  async openForgotPassword(){
    if(!this.hasLoggedIn){

    const modal = await this.modalController.create({
      component: ForgotPasswordPage
    });
    modal.onDidDismiss().then((data) => {
        if(data['data']['dismissed']){
          console.log("password changed");
        }
    });
    return await modal.present();
   }
  }
  setServiceAd(){
    if(localStorage.getItem("loc")){
      let paramData={};
      paramData["categoryId"] = this.services[0].categoryId;
      paramData["district"] = localStorage.getItem("loc");
      this.providerService.getServiceAds(paramData).subscribe(res=>{
        if(res["success"]){
          this.serviceAd = encodeURIComponent(res["data"]["adPicturePath"]);
          this.adLink = encodeURIComponent(res["data"]["website"]);
        }else{
          this.serviceAd = encodeURIComponent("default.jpg");
        }
      },error=>{
        this.serviceAd = encodeURIComponent("default.jpg");
      });
    }else{
      this.serviceAd = encodeURIComponent("default.jpg");
    }    
  }
  getGalleryImages(){
    this.isGettingGalleryImages = true;
    this.providerService.getGalleryImages(this.vendorId).subscribe(res=>{
      this.isGettingGalleryImages = false;
      if(res["success"]){
        this.imageGallery = res["data"].map(image=>{
          let imageObject = {};
          imageObject["src"] = "https://mynestonline.com/collection/images/gallery/"+image;
          imageObject["thumb"] = "https://mynestonline.com/collection/images/gallery/"+image;
          return imageObject;
        });
        if(this.imageGallery.length<3){
          this.pushDefaultGalleryImages(3-this.imageGallery.length);
        }
      }else{
        this.pushDefaultGalleryImages(3);
      }
    },error=>{
      this.isGettingGalleryImages = false;
      this.showSnackbar("Error fetching gallery images",true,"close");
    })
  }
  pushDefaultGalleryImages(index:number){
    for(var i = 0;i<index;i++){
      const image = {          
        src: "https://mynestonline.com/collection/images/gallery/default.jpg",
        thumb: "https://mynestonline.com/collection/images/gallery/default.jpg"         
      };
      this.imageGallery.push(image);
    }
  }
  getProvider(){
    this.isGettingProfileDetails = true;
     this.providerService.getProviderById(this.vendorId).subscribe(res=>{
          if(res["success"]){
             this.provider = res["data"];
             this.getWishlistStatus();
             this.updateMetaInformation();
          }else{
            this.showSnackbar("No vendor details found for this ID",true,"close");
          }
     },
     error=>{
       this.showSnackbar("No vendor details found for this ID",true,"close");
     });     
  }
  getWishlistStatus(){
      if(localStorage.getItem("uid")){
      this.providerService.getWishlistStatus(localStorage.getItem("uid"),this.vendorId).subscribe(res=>{
        this.isGettingProfileDetails = false;
          if(res["success"]){           
            this.provider["wishListed"] = true;              
          }else{
            this.provider["wishListed"] = false;  
          }
      },
      error=>{
        this.showSnackbar("No vendor details found for this ID",true,"close");
      });    
    }else{
      this.isGettingProfileDetails = false;
      this.provider["wishListed"] = false;
    } 
  }
  getOfferedServices(){
    this.categoryService.getSubcategoryByVendorId(this.vendorId).subscribe(res=>{
      if(res["success"]){
         this.services = res["data"];
         this.setServiceAd();
      }else{
        this.showSnackbar("No services found for this vendor",true,"close");
      }
    },
    error=>{
      this.showSnackbar("No services found for this vendor",true,"close");
    });
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }

  updateMetaInformation(){
    this.metaService.updateTag({ name: 'title', content: "Mynest | "+this.provider.companyName });
    this.metaService.updateTag({ name: 'description', content: this.provider.about });
    this.metaService.updateTag({ property: 'og:url', content: "https://mynestonline.com/provider/"+this.provider.vendorId });
    this.metaService.updateTag({ property: 'og:title', content: "Mynest | "+this.provider.companyName });
    this.metaService.updateTag({ property: 'og:image', content: "https://mynestonline.com/collection/images/company-profile/"+this.getImagePath(this.provider.profilePic)});
    this.metaService.updateTag({ property: 'og:description', content: this.provider.about });

  }  
  getShareLink(id:any){    
    return encodeURIComponent("https://mynestonline.com/customer/provider/"+id);
  }
  getEncoded(data:any){
    return encodeURIComponent(data);
  }
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  checkBrochure(path:any){
    if((path)&&(path!="")){
      window.open(
        'https://mynestonline.com/collection/images/brochure/'+encodeURIComponent(path),
        '_blank'
      );
    }else{
      this.showSnackbar("No brochure uploaded by vendor",true,"close");
    }    
  }
  getDetailLink(url:any){
    if((url)&&(url!="")){
      if (!/^http[s]?:\/\//.test(url)) {
          url = 'https://'+url;
      }
      window.open(
        url,
        '_blank'
      );
    }else{
      this.showSnackbar("No details provided by vendor",true,"close");
    } 
  }
  getAdLink(){
    if((this.adLink)&&(this.adLink!="")){
      if (!/^http[s]?:\/\//.test(this.adLink)) {
          this.adLink = 'https://'+this.adLink;
      }
      window.open(
        this.adLink,
        '_blank'
      );
    }
  }
  toggleWishlist(event:any){
    event.stopPropagation();
    if(this.hasLoggedIn){
      this.showSnackbar("Please wait...",false,"");
      if(this.provider.wishListed){
        this.providerService.removeFromWishlist(this.provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
          if(res["success"]){
            this.provider.wishListed = false;
            this.showSnackbar(this.provider.companyName +" removed !",true,"close");
            this.providerService.hasWishlistedOrRemoved.next("data");
          }else{
            this.showSnackbar("Server error !",true,"close");
          }
        },
        error=>{
          this.showSnackbar("Connection error !",true,"close");
        });        
      }else{
        this.providerService.addToWishlist(this.provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
          if(res["success"]){
             this.provider.wishListed = true;
             this.showSnackbar(this.provider.companyName +" wishlisted !",true,"close");
             this.providerService.hasWishlistedOrRemoved.next("data");
          }else{
            this.showSnackbar("Server error !",true,"close");
          }
        },
        error=>{
          this.showSnackbar("Connection error !",true,"close");
        });        
      }
    }else{
       this.openLoginDialog();
    }
  }
  async reportVendor(){
    if(this.hasLoggedIn){
      const modal = await this.modalController.create({
        component: ReportVendorPage,
        componentProps:{
          "vendor":this.provider
        }
      });
      modal.onDidDismiss().then((data) => {
          if(data['data']['isSuccess']){
           this.showSnackbar("Reported successfully!",true,"close");
          }
      });
      return await modal.present();
    }else{
      this.openLoginDialog();
    }
  }

  goToChatroom(event:any){
    event.stopPropagation();
    if(this.hasLoggedIn){
      let contactData = {
        lastMessage: "No messages yet",
        lastMessageSentBy: null,
        lastMessageTime: null,
        vendorId: this.provider.vendorId,
        vendorName: this.provider.companyName,
        profilePic: this.provider.logo    
      }; 
      this.chatService.setContactData(contactData);
      this.navController.navigateForward(["/chat"]);
    }else{
      this.openLoginDialog();
    }
    
  }
  goToMaps(lat:any,lng:any){
    window.open(
      'https://www.google.com/maps/search/?api=1&query='+lat+','+lng,
      '_blank'
    );
  }
  doRefresh(event:any) {
  this.serviceAd = encodeURIComponent("default.jpg");
  this.provider = {};
  this.services = [];
  this.imageGallery = [];
  this.isGettingGalleryImages = true;
  this.isGettingProfileDetails = true;
  this.getAllDetails();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
   } 
  async openGallery(i:number){
    const modal = await this.modalController.create({
      component: ImageViewerPage,
      componentProps:{
         'choosedImage':i,
         'gallery':this.imageGallery
      }
    });    
    return await modal.present();
  } 
}
