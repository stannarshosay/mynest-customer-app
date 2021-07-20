import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController, NavController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-view-qoutes',
  templateUrl: './view-qoutes.page.html',
  styleUrls: ['./view-qoutes.page.scss'],
})
export class ViewQoutesPage implements OnInit {

  isGetting:boolean = false;
  isGettingSuccess:boolean = true;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  quotes:any[] = [];
  @Input('requirementId') requirementId:any;
  constructor(
    private snackBar:MatSnackBar,
    private chatService:ChatService,
    private customerService:CustomerService,
    private modalCtrl:ModalController
  ) { }

  ngOnInit(): void {
  }
  ionViewWillEnter(){
    this.viewQuotes();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  viewQuotes(){
    this.isGetting = true;
    this.customerService.getQuotesByRequirementId(this.requirementId).subscribe(res=>{
      this.isGetting = false;
      if(res["success"]){
        this.quotes = res["data"];
      }else{
        this.isGettingSuccess = false;
      }
    },error=>{  
    this.isGetting = false;  
    this.isGettingSuccess = false;     
    this.showSnackbar("Connection error!",true,"close");
    });   
  }
  goToChatroom(event:any,qoute:any){
    event.stopPropagation();    
    let contactData = {
      lastMessage: "No messages yet",
      lastMessageSentBy: null,
      lastMessageTime: null,
      vendorId: qoute.vendorId,
      vendorName: qoute.companyName,
      profilePic: qoute.companyLogo    
    }; 
    this.chatService.setContactData(contactData);
    this.dismiss(true);
  }

  downloadQuote(quoteFileName:string){
    if((quoteFileName)&&(quoteFileName!="")){
      window.open(
        'https://mynestonline.com/collection/images/quotes/'+encodeURIComponent(quoteFileName),
        '_blank'
      );
    }else{
      this.showSnackbar("Oops! File is missing",true,"close");
    }
  }
  dismiss(shouldShowChat:boolean){
    this.modalCtrl.dismiss({
      'shouldShowChat':shouldShowChat
    });
  } 
  doRefresh(event:any) {
    this.isGetting = false;
    this.isGettingSuccess = true; 
    this.quotes = [];
    this.viewQuotes();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}
