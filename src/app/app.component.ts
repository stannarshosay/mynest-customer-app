import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from './services/chat.service';
import { LoginService } from './services/login.service';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent { 
  getLoginStatusSubscription:Subscription;
  shouldExit:boolean = false;
  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  constructor(
    private loginService:LoginService,
    private chatService:ChatService,
    public platform:Platform,
    private router:Router
  ) {}
  ngOnInit():void{
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.checkColorModes();
      setTimeout(()=>{
        this.loginService.getLoginSetStatus().subscribe(res=>{
          if(res){
            this.chatService.connectAndSubscribeToWebsocket();
          }else{
            this.chatService.disconnectFromWebsocket();
          }
        });
        SplashScreen.hide();        
        this.setBackButton();
      }, 2000);     
    });
   
  }
  setBackButton(){
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) { 
        if(this.router.url == "/home/tabs/landing"){
          if(this.shouldExit){
            App.exitApp();
          }else{
            this.shouldExit = true;
            this.showToast();
            setTimeout(()=>{
              this.shouldExit = false;
            },3000);
          }
        }else{
          this.router.navigate(["/home/tabs/landing"]);
        }
      }
    });
  }
  checkColorModes(){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.toggleDarkTheme(prefersDark.matches);
    prefersDark.addEventListener('change',(mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
  }
  toggleDarkTheme(shouldAdd:boolean){
    document.body.classList.toggle('dark', shouldAdd);
  }
  async showToast() {
    await Toast.show({
      text: 'Press back again to exit!'
    });
  }
  ngOnDestroy():void{
    this.getLoginStatusSubscription.unsubscribe();
  }

}
