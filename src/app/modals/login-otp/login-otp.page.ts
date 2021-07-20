import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.page.html',
  styleUrls: ['./login-otp.page.scss'],
})
export class LoginOtpPage implements OnInit {
  title:string = "Enter mobile number";
  infoText:string = "An otp will be send to your registered mobile number";
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isProcessing:boolean = false;
  isSubmitted = false;
  isSendOtp:boolean = false;
  mobile:string = null;
  otp:string = "";
  mobileForm = this.fb.group({    
    mobile:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]]
  });
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px',
      'background-color':'#f5f5f5'
    }
  };
  constructor(
    public modalController:ModalController,
    private fb:FormBuilder,
    private snackBar: MatSnackBar,
    private loginService:LoginService
  ) { }

  ngOnInit() {
  }
  dismiss(isVerified:boolean,data:any){
    this.modalController.dismiss({
      'isVerified': isVerified,
      'data':data
    });
  }   
  onOtpChange(otp:string) {
    this.otp = otp;
  }
  sendOtp(){
    this.isSendOtp = false;
    this.isSubmitted = true;
      if(this.mobileForm.valid){
        this.isProcessing = true;
        this.loginService.sendOtpForLogin(this.mobileForm.get("mobile").value,"ROLE_CUSTOMER").subscribe(res=>{
          this.isProcessing = false;
          this.isSendOtp = false;
          if(res["success"]){
            this.infoText = "Enter the otp send to your registered mobile number for verification";
            this.title = "Verify login";
            this.isSendOtp = true;
            this.isSubmitted = false;
            this.mobile = this.mobileForm.get("mobile").value;
          }else{
            this.showSnackbar(res["message"],true,"close");
          }
        },error=>{
          this.isSendOtp = false;
          this.isProcessing = false;
        });
      }else{
        this.showSnackbar("Please check all required fields",true,"okay");
      }
  }
  verifyLogin(){
     if(this.otp.length == 4){      
       let paramData={};
       paramData["mobile"] = this.mobile;
       paramData["otp"] = this.otp;
       paramData["role"] = "ROLE_CUSTOMER";
       this.isProcessing = true;
        this.loginService.verifyOtpForLogin(paramData).subscribe(res=>{
          this.isProcessing = false;
          if(res["success"]){
            this.mobile = null;
            this.dismiss(true,res["data"]);
          }else{
            this.showSnackbar(res["message"],true,"close");
          }
        },error=>{         
          this.isProcessing = false;
        });
     }else{
      this.showSnackbar("Enter a 4 digit otp!",true,"okay");
     }
  }
 
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
}
