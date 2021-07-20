import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-report-vendor',
  templateUrl: './report-vendor.page.html',
  styleUrls: ['./report-vendor.page.scss'],
})
export class ReportVendorPage implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  reason = new FormControl("",Validators.required);
  isReporting:boolean = false;
  @Input('vendor') vendor:any;
  constructor(
    private snackBar:MatSnackBar,
    private customerService:CustomerService,
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
  reportVendor(){
    if(this.reason.valid){
       this.isReporting = true;
       let paramData = {};
       paramData["reportedVendorId"] = this.vendor.vendorId;
       paramData["reportingCustomerId"] = localStorage.getItem("uid");
       paramData["reason"] = this.reason.value;
       this.customerService.reportVendor(paramData).subscribe(res=>{
          this.isReporting = false;
          if(res["success"]){
            this.dismiss(true);            
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
       },error=>{  
        this.isReporting = false;       
        this.showSnackbar("Connection error!",true,"close");
       });
    }else{
      this.showSnackbar("Please specify a reason",true,"close");
    }
  }
  dismiss(isSuccess:boolean){
    this.modalCtrl.dismiss({
      'isSuccess': isSuccess
    });
  } 
}
