import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from './services/chat.service';
import { LoginService } from './services/login.service';
import { LocalNotificationSchedule, Plugins } from '@capacitor/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { FcmService } from './services/fcm.service';
const { App,SplashScreen,Toast,BackgroundTask,LocalNotifications } = Plugins;

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
    private fcmService:FcmService,
    private router:Router
  ) {}
  ngOnInit():void{
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(()=>{
        this.loginService.getLoginSetStatus().subscribe(res=>{
          if(res){
            this.chatService.connectAndSubscribeToWebsocket();
            this.fcmService.initPush();
          }else{
            this.chatService.disconnectFromWebsocket();
          }
        });
        SplashScreen.hide(); 
        // this.setBackgroundTask();
        // let schedule:LocalNotificationSchedule = {
        //   repeats:true,every:"minute"
        // }
        // this.setNotifications(schedule,"Mynest demo notifcation","Runs every minute");
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
  async showToast() {
    await Toast.show({
      text: 'Press back again to exit!'
    });
  }
  async setNotifications(schedule:LocalNotificationSchedule,title:string,body:string){
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: 1,
          schedule: schedule,
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
    console.log('scheduled notifications', notifs);
  }
  setBackgroundTask(){
    App.addListener('appStateChange', (state) => {

      if (!state.isActive) {       
        let taskId = BackgroundTask.beforeExit(async () => {
        
          var start = new Date().getTime();
          for (var i = 0; i < 1e18; i++) {
            if ((new Date().getTime() - start) > 20000){
              break;
            }
          }          
          let schedule:LocalNotificationSchedule = {
            at: new Date(Date.now() + 1000 * 5) 
          }          
          this.setNotifications(schedule,"Background task demo","completed background tasks");
          BackgroundTask.finish({
            taskId
          })
        });
      }
    });
  }
  ngOnDestroy():void{
    this.getLoginStatusSubscription.unsubscribe();
  }

}
