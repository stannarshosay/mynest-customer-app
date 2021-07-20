import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-close-requirement',
  templateUrl: './close-requirement.page.html',
  styleUrls: ['./close-requirement.page.scss'],
})
export class CloseRequirementPage implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  @Input('requirementId') requirementId:any;
  reason = new FormControl("",Validators.required);
  isClosing:boolean = false;

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
  closeRequirement(){
    if(this.reason.valid){
       this.isClosing = true;
       let paramData = {};
       paramData["requirementId"] = this.requirementId;
       paramData["closingNote"] = this.reason.value;
       this.customerService.closeRequirement(paramData).subscribe(res=>{
          this.isClosing = false;
          if(res["success"]){
            this.dismiss(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
       },error=>{  
        this.isClosing = false;       
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
