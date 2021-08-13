import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ForgotPasswordPage } from '../modals/forgot-password/forgot-password.page';
import { LoginPage } from '../modals/login/login.page';
import { SignupPage } from '../modals/signup/signup.page';
import { ChatService } from '../services/chat.service';
import { CustomerService } from '../services/customer.service';
import { LoginService } from '../services/login.service';
import { ProvidersService } from '../services/providers.service';
import { Plugins } from '@capacitor/core';
import { FcmService } from '../services/fcm.service';
const { FacebookLogin } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  username = "Guest";
  customerProfile:string = encodeURIComponent("default.jpg");  
  isLoggedIn:boolean = false;
  getLoginSetStatus:Subscription;  
  getProfileChangeStatus:Subscription; 

  wishlistCount:string = "";
  messageCount:string = "";
  notificationCount:string = "";
  getRecievedMessagesSubscription:Subscription;
  getHasWishlistedOrRemovedSetStatus:Subscription;
  getRecievedNotificationsSubscription:Subscription;
  getShowLOginStatusSubscription:Subscription;
  constructor(
    private loginService:LoginService,
    private customerService:CustomerService,
    private chatService:ChatService,
    private snackBar:MatSnackBar,
    private modalController:ModalController,
    private providerService:ProvidersService,
    private menu:MenuController,
    private fcmService:FcmService
  ) {}
  
  ngOnInit():void{
    
  }
  ionViewWillEnter(){   
    this.menu.enable(true, 'sidebar-menu');
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{
      this.isLoggedIn = res;
      if(this.isLoggedIn){
        this.username = localStorage.getItem("username");
        this.setCustomerProfilePic();
      }else{
        this.customerProfile = encodeURIComponent("default.jpg");
        this.username = "Guest";
      }
    });
    this.getProfileChangeStatus = this.customerService.getLogoChangeStatus().subscribe(res =>{      
      if(res){
        this.setCustomerProfilePic();
      }
    });
    this.getShowLOginStatusSubscription = this.loginService.getShowLoginStatus().subscribe(res=>{
      if(res){
        this.openLoginDialog();
      }
    });    
    this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res =>{
      if(this.isLoggedIn){
        this.setMessageUnreadCount();
      }else{
        this.messageCount="";
      }
    });
    this.getHasWishlistedOrRemovedSetStatus = this.providerService.getHasWishlistedOrRemovedSetStatus().subscribe(res =>{  
      if(this.isLoggedIn){
        this.setWishlistNav();     
      }else{
        this.wishlistCount = "";
      }
    });
    this.getRecievedNotificationsSubscription = this.chatService.getRecievedNotification().subscribe(res =>{
      if(this.isLoggedIn){
        this.setNotificationUnreadCount();
      }else{
        this.notificationCount = "";
      }
    });
    if(this.isLoggedIn){
      this.setNotificationUnreadCount();
      this.setMessageUnreadCount();
    }else{
      this.notificationCount = "";
      this.messageCount="";
    }  
  }
  ionViewWillLeave(){
    this.getLoginSetStatus.unsubscribe();
    this.getProfileChangeStatus.unsubscribe();
    this.getHasWishlistedOrRemovedSetStatus.unsubscribe();
    this.getRecievedMessagesSubscription.unsubscribe();
    this.getShowLOginStatusSubscription.unsubscribe();
    this.getRecievedNotificationsSubscription.unsubscribe();
  }
  setCustomerProfilePic(){
    this.customerService.getDetailsByCustomerId(localStorage.getItem("uid")).subscribe(res=>{
      if(res["success"]){
        if((res["data"]["profilePic"])&&(res["data"]["profilePic"]!="")){
          this.customerProfile = encodeURIComponent(res["data"]["profilePic"]);
        }
      }else{
        this.showSnackbar("Customer detail error!",true,"close");
      }
    },error=>{
      this.showSnackbar("Connection error!",true,"close");
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
  setWishlistNav(){
    this.providerService.getWishlistedProviders(localStorage.getItem("uid"),0,5).subscribe(res=>{
      if(res["success"]){
        this.wishlistCount = res["data"]["totalElements"]>50?"50+":res["data"]["totalElements"];
      }else{
        this.wishlistCount = "";
      }
    });    
  }
  setMessageUnreadCount(){
    this.chatService.getMessagesUnreadCount(localStorage.getItem("uid")).subscribe(res=>{
      if(res["success"]){
        this.messageCount = res["data"] == 0?"":res["data"]>50?"50+":res["data"];
      }else{
        this.messageCount = "";
      }
    }); 
  }
  setNotificationUnreadCount(){
    this.chatService.getNotificationsUnreadCount(localStorage.getItem("uid")).subscribe(res=>{
      if(res["success"]){
        this.notificationCount = res["data"] == 0?"":res["data"]>50?"50+":res["data"];
      }else{
        this.notificationCount="";
      }
    }); 
  }
  async openLoginDialog(){
    this.closeMenu();
    if(!this.isLoggedIn){
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
    this.closeMenu();
    if(!this.isLoggedIn){
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
    if(!this.isLoggedIn){

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
  closeMenu(){
    this.menu.close("sidebar-menu");
  }
  async logout(){  
    try{ 
      await Plugins.GoogleAuth.signOut();
      await FacebookLogin.logout();   
    }catch(err){
      console.log("not a social login");
    } 
    this.fcmService.removeTokenOnLogout(localStorage.getItem("uid"));
    localStorage.setItem("uid","");
    localStorage.setItem("username","");
    localStorage.setItem("email","");
    this.loginService.hasLoggedIn.next(false);
    this.providerService.hasWishlistedOrRemoved.next("data");
    this.chatService.hasRecievedMessage.next("no");
    this.chatService.hasRecievedNotification.next("no");
    this.closeMenu();
    this.showSnackbar("Logout Successful!",true,"close");
  }
}
