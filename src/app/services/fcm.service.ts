import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
const {PushNotifications,Modals,Device} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private http:HttpClient
  ) { }

  public initPush(){
    this.registerPushNotification();
    // if(Capacitor.platform !== "web"){
    //   this.registerPushNotification();
    // }   
  }
  async getDeviceId(){
    const info = await Device.getInfo();
    return info;
  }
  private registerPushNotification(){
    PushNotifications.requestPermission().then((permission)=>{
      if(permission.granted){
        PushNotifications.register();
      }else{
        this.showAlert("No push notification permisson granted");
      }
    });  
    PushNotifications.addListener("registration",(token:PushNotificationToken)=>{
      // this.showAlert("token => "+JSON.stringify(token));
      //add to table;
      if(localStorage.getItem("mnFcmToken")){
        if(localStorage.getItem("mnFcmToken")!=JSON.stringify(token)){
          this.addTokenForUser(JSON.stringify(token));
        }
      }else{
        this.addTokenForUser(JSON.stringify(token));
      }
    });
    PushNotifications.addListener("registrationError",(error:any)=>{
      // this.showAlert("register error => "+JSON.stringify(error));
    });
    PushNotifications.addListener("pushNotificationReceived",async (notification:PushNotification)=>{
      // this.showAlert("recieved => "+JSON.stringify(notification));
    });
    PushNotifications.addListener("pushNotificationActionPerformed",async (notification:PushNotificationActionPerformed)=>{
      // this.showAlert("action performed => "+JSON.stringify(notification.notification.data));
    });
  }
  async showAlert(data:any) {
    let alertRet = await Modals.alert({
      title: 'Mynest',
      message: data
    });
  }
  removeTokenOnLogout(){
    this.getDeviceId().then(result=>{
      this.removeMobileToken(localStorage.getItem("uid"),result["uuid"]).subscribe(res=>{
        if(res["success"]){
          localStorage.setItem("mnFcmToken","");
        }
      },error=>{
        console.log(error);
      });
    });    
  }
  addTokenForUser(token:string){
    this.getDeviceId().then(result=>{
      this.addMobileToken(localStorage.getItem("uid"),result["uuid"],token).subscribe(res=>{
        if(res["success"]){
          localStorage.setItem("mnFcmToken",token);
        }
      },error=>{
        console.log(error);
      });
    });
  }
  removeMobileToken(customerId:string,deviceId:string){
    return this.http.post("https://mynestonline.com/collection/api/mobile/token/delete?userId="+customerId+"&deviceId="+deviceId,null);
  }
  addMobileToken(customerId:string,deviceId:string,token:string){
    return this.http.post("https://mynestonline.com/collection/api/mobile/token/new?userId="+customerId+"&deviceId="+deviceId+"&token="+token,null);
  }
}
