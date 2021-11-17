import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { ProvidersService } from 'src/app/services/providers.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { HttpClient } from '@angular/common/http';
import { LoginOtpPage } from '../login-otp/login-otp.page';
import { FcmService } from 'src/app/services/fcm.service';
import { Toast } from '@capacitor/toast';
import { FacebookLogin } from '@capacitor-community/facebook-login';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isLogging:boolean = true;
  username = new FormControl("",Validators.required);
  password = new FormControl("",Validators.required);
  constructor(
    public modalCtrl:ModalController,
    private snackBar: MatSnackBar,
    private loginService:LoginService,
    private providerService:ProvidersService,
    private chatService:ChatService,
    private http:HttpClient,
    private fcmService:FcmService
  ) { 
  }

  ngOnInit() {
  }
  dismiss(shouldRedirect:boolean,modal:any){
    this.modalCtrl.dismiss({
      'dismissed': shouldRedirect,
      'shouldOpen':modal
    });
  } 

  login(){
    this.isLogging = false;
    if(this.username.valid&&this.password.valid){
      this.loginService.login(this.username.value,this.password.value).subscribe(res =>{
        this.isLogging = true;
        if(res["success"]){
          localStorage.setItem("uid",res["data"]["id"]);
          localStorage.setItem("username",res["data"]["username"]);
          localStorage.setItem("email",res["data"]["email"]);
          this.loginService.hasLoggedIn.next(true);
          this.fcmService.initPush();
          this.providerService.hasWishlistedOrRemoved.next("data");
          this.chatService.hasRecievedMessage.next("no");
          this.chatService.hasRecievedNotification.next("no");
          this.dismiss(false,null);
          this.showSnackbar(res["message"]);
        }else{
          this.showSnackbar("Oops! "+res["message"]);
        }
      },
      error=>{
        this.isLogging = true;
        this.showSnackbar("Oops! "+error["error"]["message"]);
      });
    }else{
      this.isLogging = true;
      this.showSnackbar("Oops! no credentials entered");
    }
  }
  signup(){
    this.dismiss(true,"signup");
  }
  forgotPassword(){
    this.dismiss(true,"forgot");
  }
  showSnackbar(content:string){
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = ['snackbar-styler'];
    this.snackBar.open(content, "close", config);
  }
  async loginWithOtp(){    
      const modal = await this.modalCtrl.create({
        component: LoginOtpPage,     
        showBackdrop: true,
        cssClass: 'login-otp-modal'
      });
      modal.onDidDismiss().then((data) => {
          if(data['data']['isVerified']){
            let loginData = data['data']['data'];
            localStorage.setItem("uid",loginData["id"]);
            localStorage.setItem("username",loginData["username"]);
            localStorage.setItem("email",loginData["email"]);
            this.loginService.hasLoggedIn.next(true);
            this.fcmService.initPush();
            this.providerService.hasWishlistedOrRemoved.next("data");
            this.chatService.hasRecievedMessage.next("no");
            this.chatService.hasRecievedNotification.next("no");
            setTimeout(()=>{
              this.dismiss(false,null);
            });
            this.showSnackbar("Otp Login Successfull!"); 
          }
      });
      return await modal.present();
    
  }  
  async fbLogin(){
    const FACEBOOK_PERMISSIONS = ['email'];
    const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result.accessToken) {
       this.loadUserData(result.accessToken);
    } else {
      // Cancelled by user.
      // this.showToast("fb login cancelled");
    }
  } 
  async googleSignup() {
    const googleUser = await GoogleAuth.signIn();
    console.log(googleUser.email+" : "+googleUser.authentication.idToken);
    // this.showToast(googleUser.email+" : "+googleUser.authentication.idToken);
    this.socialLogin(googleUser.authentication.idToken,googleUser.email,"GOOGLE");
  }
  async loadUserData(accessToken:any) {
    const url = `https://graph.facebook.com/${accessToken.userId}?fields=id,name,email&access_token=${accessToken.token}`;
    this.http.get(url).subscribe(res => {
      this.socialLogin(accessToken.token,res['email'],"FACEBOOK");
    },error=>{
      console.log(error.message);
      this.showToast("Something went wrong!");
    });
  }
  socialLogin(token:string,email:string,provider:string){
    this.isLogging = false;
    let paramData={};
    paramData["email"] = email;
    paramData["provider"] = provider;
    paramData["role"] = "ROLE_CUSTOMER";
    paramData["token"] = token;
    this.loginService.socialSignIn(paramData).subscribe(res=>{
       this.isLogging = true;
       if(res["success"]){
          localStorage.setItem("uid",res["data"]["id"]);
          localStorage.setItem("username",res["data"]["username"]);
          localStorage.setItem("email",res["data"]["email"]);
          this.loginService.hasLoggedIn.next(true);
          this.fcmService.initPush();
          this.providerService.hasWishlistedOrRemoved.next("data");
          this.chatService.hasRecievedMessage.next("no");
          this.chatService.hasRecievedNotification.next("no");
          this.dismiss(false,null);
          this.showSnackbar(res["message"]);
       }else{
         this.showSnackbar(res["message"]);
       }
     },error=>{         
       this.isLogging = true;
     });
  }
  async showToast(text:string) {
      await Toast.show({
        text: text
      });
    }
}
