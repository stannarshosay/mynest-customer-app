import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import moment from 'moment';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('chatbox') private chatbox: IonContent;
  customerId:any; 
  getLoginSetStatus:Subscription;
  getRecievedMessagesSubscription:Subscription; 
  isGettingMessages:boolean = false;
  showNoMessages:boolean = false;
  messages:any[] = [];
  contactData:any = null;
  hasLoggedIn:boolean = false;
  contactTempForReload:boolean = null;
  messageControl:FormControl;
   constructor(
     private loginService:LoginService,
     private router:Router,
     private chatService:ChatService,
     private snackBar:MatSnackBar,
     private navController:NavController
   ) { }
   
   ngOnInit(): void {   
    this.messageControl = new FormControl('',Validators.required);
   }
   ionViewWillEnter(){
    this.customerId = localStorage.getItem("uid");
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{   
      this.hasLoggedIn = res;   
      if(!res){
        this.router.navigate(["home"]);
      }else{
        this.checkRecievedContactData();  
      }
    });
    this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res=>{
       if(res!="no"){
         this.onRecieveMessage(res);
       }
    });
   }
   ngOnDestroy():void{     
   }
   ionViewWillLeave(){
    this.getLoginSetStatus.unsubscribe();
    this.getRecievedMessagesSubscription.unsubscribe();
   }
   showSnackbar(content:string,hasDuration:boolean,action:string){
     const config = new MatSnackBarConfig();
     if(hasDuration){
       config.duration = 3000;
     }
     config.panelClass = ['snackbar-styler'];
     return this.snackBar.open(content, action, config);
   }
   checkRecievedContactData(){
     if(this.chatService.hasContactData()){
       this.contactData =  this.chatService.getContactData();
       this.contactTempForReload = this.contactData;
       this.chatService.clearContactData();        
       this.getMessages(this.contactData.vendorId);
     }else{
       this.isGettingMessages = false;
       this.showNoMessages = true;
       this.navController.navigateBack(['/home/tabs/chatroom']);
     }
   }
   getMessages(vendorId:any){
     this.messages = [];
     this.showNoMessages = false;
     this.isGettingMessages = true;
     this.chatService.getMessagesByCustomerAndVendorId(this.customerId,vendorId).subscribe(res=>{
        this.isGettingMessages = false;
        if(res["success"]){
           this.messages = res["data"].reverse();
           this.scrollToBottom();
           this.chatService.hasRecievedMessage.next("no");
        }else{
          this.showNoMessages = true;
        }
     },error=>{
       this.isGettingMessages = false;
       this.showNoMessages = true;
       this.showSnackbar("Connection error!",true,"close");      
     });
   }
   getMessagesToUpdateUnreadCount(vendorId:any){
     this.chatService.getMessagesByCustomerAndVendorId(this.customerId,vendorId).subscribe(res=>{
       if(res["success"]){
         this.chatService.hasRecievedMessage.next("no");
       }
     });
   }   
   sendMessage(){
     if(this.messageControl.valid){
       let message = {
         customerId: Number(this.customerId),
         vendorId: Number(this.contactData.vendorId),
         senderId: this.customerId,
         recipientId: this.contactData.vendorId,
         content: this.messageControl.value,
         messageType:"TEXT"
       }; 
       if(this.chatService.sendMessage(message)){
         this.showNoMessages = false;
         let date = this.getFormattedDate();        
         message["sentTime"] = date;
         this.messages.push(message);  
         this.messageControl.setValue(""); 
         this.scrollToBottom();
         setTimeout(()=>{
          this.chatService.hasRecievedMessage.next("no");
         },5000);
       }  
     }else{
       this.showSnackbar("No message to send!",true,"okay");
     }
   }
   onRecieveMessage(message:any){   
     if(message.senderId == this.contactData.vendorId){
       this.messages.push(message);
       this.getMessagesToUpdateUnreadCount(this.contactData.vendorId);
     }else{
       this.chatService.hasRecievedMessage.next("no");
     }      
   }
   getImagePath(path:string){
     if((path)&&(path!="")){
       return encodeURIComponent(path);
     }
     return encodeURIComponent("default.jpg");
   }
   downloadChatQuote(filePath:string){
     if((filePath)&&(filePath!="")){
       window.open(
         'https://mynestonline.com/collection/images/chat-quotes/'+encodeURIComponent(filePath),
         '_blank'
       );
     }else{
       this.showSnackbar("No qoute found!",true,"close");
     }
   }
   checkLength(message:string){    
     if(message.length>15){
       return message.substring(0,15) +" ...";
     }
     return message;
  }
   getFormattedDate() {
      return moment().format("DD/MM/YYYY HH:mm:ss");
   } 
   scrollToBottom(): void {
     try {
       setTimeout(()=>{
        this.chatbox.scrollToBottom(300);
       },500);
     } catch(err) { 
       console.log("error on scroll to bottom : "+err);
     }                 
   }
   getBeautifiedDate(dateString:string){
    let date = moment(dateString, "DD/MM/YYYY HH:mm:ss");
    if(date.isSame(moment(),'day')){
      return "Today " + date.format('h:mm a');
    }
    if(date.isSame(moment().subtract(1,"days"),'day')){      
      return "Yesterday " + date.format('h:mm a');
    }
    return date.format('Do MMM YYYY h:mm a');
  }
  doRefresh(event:any) {
    this.contactData = null;
    this.chatService.setContactData(this.contactTempForReload);
    this.contactTempForReload = null;
    if(this.hasLoggedIn){
      this.checkRecievedContactData();  
    }else{      
      this.router.navigate(["home"]);
    }
     setTimeout(() => {
       event.target.complete();
     }, 2000);
   }
}
