import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  email = new FormControl("",Validators.compose([Validators.required,Validators.email]));
  isProcessing:boolean = false;

  constructor(
    private snackBar:MatSnackBar,
    private loginService:LoginService,
    private modalCtrl:ModalController
  ) { }

  ngOnInit(): void {
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }  
  forgot(){
    if(this.email.valid){
       this.isProcessing = true;
       this.loginService.forgotPasswordOfCustomer(this.email.value,"ROLE_CUSTOMER").subscribe(res=>{
          this.isProcessing = false;
          if(res["success"]){
            this.email.setValue("");
            this.dismiss(true);
          }
          this.showSnackbar(res["message"],true,"close");
       },error=>{  
        this.isProcessing = false;       
        this.showSnackbar("Connection error!",true,"close");
       });
    }else{
      this.showSnackbar("Please enter a valid email",true,"close");
    }
  }
  dismiss(shouldRedirect:boolean){
    this.modalCtrl.dismiss({
      'dismissed': shouldRedirect
    });
  } 


}
