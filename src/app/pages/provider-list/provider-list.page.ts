import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ForgotPasswordPage } from 'src/app/modals/forgot-password/forgot-password.page';
import { LoginPage } from 'src/app/modals/login/login.page';
import { SignupPage } from 'src/app/modals/signup/signup.page';
import { CategoryService } from 'src/app/services/category.service';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { ProvidersService } from 'src/app/services/providers.service';
declare var jQuery: any;

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.page.html',
  styleUrls: ['./provider-list.page.scss'],
})
export class ProviderListPage implements OnInit {
  title:string="Providers";
  @ViewChildren("filterCheckboxes") filterCheckboxes: QueryList<ElementRef>;

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  categoryId:string = "";
  categoryName:string = "";
  serviceAd:string = encodeURIComponent("default.jpg");
  providers:any = "";
  subCategories:any = [];
  config:any = {};
  pageNo:number = 0;
  pageSize:number = 8;
  adLink:any = null;
  hasLoggedIn:boolean = false;
  isProvidersLoaded:boolean = false;
  isSubcategoryLoaded:boolean = false;
  isProvidersDataSuccess:boolean = true;
  isSubcategoryDataSuccess:boolean = true;
  canDefineSubArray:boolean = false;
  getHasWishlistedOrRemovedSetStatus:Subscription;
  getLoginSetStatus:Subscription;
  constructor(
    private route : ActivatedRoute,
    private providersService:ProvidersService,
    private categoryService:CategoryService,
    private loginService:LoginService,
    private chatService:ChatService,
    private snackBar:MatSnackBar,
    private menuController:MenuController,
    private modalController:ModalController,
    private navController:NavController
    ) { }

  ngOnInit(): void { 
    
  }
  ionViewWillEnter(){
    this.menuController.enable(true, 'filter-menu');
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res=>{  
        this.hasLoggedIn = res;    
        this.getAllDetails(); 
    });
    this.getHasWishlistedOrRemovedSetStatus = this.providersService.getHasWishlistedOrRemovedSetStatus().subscribe(res=>{
      if(res !== "data"){
        this.setWishlistRemovalFromNav(res);        
      }
    });
  }
  getAllDetails(){
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId'),
      this.categoryName = decodeURIComponent(params.get('categoryName')),
      this.title = this.categoryName,
      this.getSubcategories(this.categoryId),
      this.getProviders(this.pageNo,this.pageSize);
      this.setServiceAd();
    });
  }
  ionViewWillLeave():void{
    this.getHasWishlistedOrRemovedSetStatus.unsubscribe();
    this.getLoginSetStatus.unsubscribe();
  }
  openFilterSidebar(){
    this.menuController.open("filter-menu");
  }
  closeMenu(){
    this.menuController.close("filter-menu");
  }
  applyFilter(){
    this.closeMenu();
    this.pageNo = 0;
    this.pageSize = 8;
    this.getProviders(this.pageNo,this.pageSize);
  }
  setServiceAd(){
    let paramData={};
    if(localStorage.getItem("loc")){
      paramData["categoryId"] = this.categoryId;
      paramData["district"] = localStorage.getItem("loc");
      this.providersService.getServiceAds(paramData).subscribe(res=>{
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
  setWishlistRemovalFromNav(vendorId:string){
     if(this.providers.find(obj => obj.vendorId === vendorId)){
      this.providers.find(obj => obj.vendorId === vendorId).wishListed = false;
    }
  } 
  getSubcategories(id:any){
    this.isSubcategoryLoaded = false;
    this.isSubcategoryDataSuccess = true;
      this.categoryService.getSubcategoriesByCategoryId(id).subscribe(res=>{
        this.isSubcategoryLoaded = true,
        this.canDefineSubArray = true,
        this.checkSubcategoriesRecieved(res)        
      });
  }
  checkSubcategoriesRecieved(response:any){
      if(response){
        if(response["success"]){
          this.subCategories = response["data"];
        }else{
          this.isSubcategoryDataSuccess =false;
          this.canDefineSubArray = false;
        }
      }else{
        this.isSubcategoryDataSuccess =false;
        this.canDefineSubArray = false;
      }
  }
  getProviders(pageNo:number,pageSize:number){
    this.providers = [];
    this.config["totalItems"] = 0;
    this.isProvidersDataSuccess = true;
    this.isProvidersLoaded = false;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;
    let data = {};
    data["categoryId"] = this.categoryId;
    data["district"] = localStorage.getItem("loc");
    if(this.canDefineSubArray){
      let subArray:string[] = [];
      this.filterCheckboxes.forEach((element) => {
        if(element.nativeElement.checked){
          subArray.push(element.nativeElement.name);
        }
      });
      data["subCategories"]  = subArray;
    }
    if(localStorage.getItem("uid")){
      data["customerId"] = localStorage.getItem("uid");
    }
    this.providersService.getProviders(data,pageNo,pageSize).subscribe(res =>{
      this.isProvidersLoaded = true,
      this.checkProvidersRecieved(res)      
    });
  }
  checkProvidersRecieved(serverData:any){
     if(serverData["success"]){
      this.providers = serverData["data"]["content"];
      this.config["totalItems"] = serverData["data"]["totalElements"];
     }else{
       this.isProvidersDataSuccess = false;
     }
  }
  uncheckAllFilters(){
    this.closeMenu();
    this.filterCheckboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.pageNo = 0;
    this.pageSize = 9;
    this.getProviders(this.pageNo,this.pageSize);
  }
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getProviders(this.pageNo,this.pageSize);
  } 
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  toggleWishlist(provider:any,event:any){
    event.stopPropagation();
    if(this.hasLoggedIn){
      this.showSnackbar("Please wait...",false,"");
      if(this.providers.find(obj => obj.vendorId === provider.vendorId).wishListed){
        this.providersService.removeFromWishlist(provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
          if(res["success"]){
            this.providers.find(obj => obj.vendorId === provider.vendorId).wishListed = false;
            this.showSnackbar(provider.companyName +" removed !",true,"close");
            this.providersService.hasWishlistedOrRemoved.next("data");
          }else{
            this.showSnackbar("Server error !",true,"close");
          }
        },
        error=>{
          this.showSnackbar("Connection error !",true,"close");
        });        
      }else{
        this.providersService.addToWishlist(provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
          if(res["success"]){
             this.providers.find(obj => obj.vendorId === provider.vendorId).wishListed = true;
             this.showSnackbar(provider.companyName +" wishlisted !",true,"close");
             this.providersService.hasWishlistedOrRemoved.next("data");
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
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  getShareLink(id:any){    
    return encodeURIComponent("https://mynestonline.com/customer/provider/"+id);
  }
  getEncoded(data:any){
    return encodeURIComponent(data);
  }
  goToChatroom(provider:any,event:any){
    event.stopPropagation();
    if(this.hasLoggedIn){
      let contactData = {
        lastMessage: "No messages yet",
        lastMessageSentBy: null,
        lastMessageTime: null,
        vendorId: provider.vendorId,
        vendorName: provider.companyName,
        profilePic: provider.logo    
      }; 
      this.chatService.setContactData(contactData);
      this.navController.navigateForward(["/chat"]);
    }else{
      this.openLoginDialog();
    }    
  }  
  doRefresh(event:any) {
    this.uncheckAllFilters();        
    this.pageNo = 0;
    this.pageSize = 8;
    this.config = {};     
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize; 
    this.canDefineSubArray = false;    
    this.getAllDetails();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
   } 

}
