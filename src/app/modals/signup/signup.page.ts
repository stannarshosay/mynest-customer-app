import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { ProvidersService } from 'src/app/services/providers.service';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
const { FacebookLogin,Toast } = Plugins;
import { HttpClient } from '@angular/common/http';
import { FcmService } from 'src/app/services/fcm.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  @ViewChild('terms') terms:ElementRef;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  showSpinner:boolean = false;
  isSubmitted:boolean = false;
  signupForm = this.fb.group({
    username:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    mobile:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]],
    password:['',Validators.required],
    rePassword:['',Validators.required]
  });

  constructor(
    private loginService:LoginService,
    private chatService:ChatService,
    private providerService:ProvidersService,
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    private modalCtrl:ModalController,
    private http:HttpClient,
    private fcmService:FcmService
  ) {

   }

  onSubmit(termsStatus:any){
    this.isSubmitted = true;
      if(this.signupForm.valid){
        if(this.signupForm.get("password").value==this.signupForm.get("rePassword").value){
          if(termsStatus){
              let requestData = this.signupForm.value;
              delete requestData["rePassword"];
              this.register(requestData);
          }else{
            this.showSnackbar("Please agree to terms and conditions",true,"okay");
          }        
        }else{
          this.showSnackbar("Passwords don't match",true,"okay");
        }      
      }else{
        this.showSnackbar("Please check all required fields",true,"okay");
      }
  }
  register(data:any){
    this.showSpinner = true;
    this.loginService.registerAsCustomer(data).subscribe(res=>{
      this.showSpinner = false;
       if(res["success"]){
         localStorage.setItem("uid",res["data"]["id"]);
         localStorage.setItem("username",res["data"]["username"]);
         localStorage.setItem("email",this.signupForm.get("email").value);
         this.loginService.hasLoggedIn.next(true);
         this.fcmService.initPush();
         this.providerService.hasWishlistedOrRemoved.next("data");
         this.chatService.hasRecievedMessage.next("no");
         this.chatService.hasRecievedNotification.next("no");
         this.showSnackbar("Successfully registered",true,"close");
         this.dismiss(false,null);
       }else{
         this.showSnackbar(res["message"],true,"close");
       }
    },error=>{
      this.showSpinner = false;
      this.showSnackbar("Internal Server error",true,"close");
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
    
  
  ngOnInit(): void {
  }
  dismiss(shouldRedirect:boolean,modal:any){
    this.modalCtrl.dismiss({
      'dismissed': shouldRedirect,
      'shouldOpen':modal
    });
  } 
  login(){
    this.dismiss(true,"login");
  }
  async fbLogin(){
    const FACEBOOK_PERMISSIONS = ['email'];
    const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    this.showToast("Fb login token" + result.accessToken);
    if (result.accessToken) {
       this.loadUserData(result.accessToken);
    } else {
      // Cancelled by user.
      // this.showToast("fb login cancelled");
    }
  } 
  async googleSignup() {
    const googleUser = await Plugins.GoogleAuth.signIn() as any;
    console.log(googleUser.email+" : "+googleUser.authentication.idToken);
    // this.showToast(googleUser.email+" : "+googleUser.authentication.idToken);
    this.socialLogin(googleUser.authentication.idToken,googleUser.email,"GOOGLE");
  }
  async loadUserData(accessToken:any) {
    const url = `https://graph.facebook.com/${accessToken.userId}?fields=id,name,email&access_token=${accessToken.token}`;
    this.http.get(url).subscribe(res => {
      this.showToast("Fb login successfull :"+res['email']);
      this.socialLogin(accessToken.token,res['email'],"FACEBOOK");
    },error=>{
      console.log(error.message);
      this.showToast("Something went wrong!");
    });
  }
  socialLogin(token:string,email:string,provider:string){
    this.showSpinner = true;
    let paramData={};
    paramData["email"] = email;
    paramData["provider"] = provider;
    paramData["role"] = "ROLE_CUSTOMER";
    paramData["token"] = token;
    this.loginService.socialSignIn(paramData).subscribe(res=>{
      this.showSpinner = false;
       if(res["success"]){
          localStorage.setItem("uid",res["data"]["id"]);
          localStorage.setItem("username",res["data"]["username"]);
          localStorage.setItem("email",this.signupForm.get("email").value);
          this.loginService.hasLoggedIn.next(true);
          this.fcmService.initPush();
          this.providerService.hasWishlistedOrRemoved.next("data");
          this.chatService.hasRecievedMessage.next("no");
          this.chatService.hasRecievedNotification.next("no");
          this.dismiss(false,null);
          this.showSnackbar(res["message"],true,"close");
       }else{
         this.showSnackbar(res["message"],true,"close");
       }
     },error=>{         
      this.showSpinner = false;
     });
  }
  async showToast(text:string) {
      await Toast.show({
        text: text
      });
    }
}
