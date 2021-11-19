import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController, NavController } from '@ionic/angular';
import { CloseRequirementPage } from 'src/app/modals/close-requirement/close-requirement.page';
import { ViewQoutesPage } from 'src/app/modals/view-qoutes/view-qoutes.page';
import { CategoryService } from 'src/app/services/category.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.page.html',
  styleUrls: ['./requirements.page.scss'],
})
export class RequirementsPage implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  selectedTab:number = 0;
  pageNo:number = 0;
  pageSize:number = 9;
  config:any = {};
  segment:string = "active";
  isGettingActiveRequirements:boolean = true;
  isGettingClosedrequirements:boolean = true;

  isGettingActiveRequirementsSuccess:boolean = true;
  isGettingClosedrequirementsSuccess:boolean = true;

  activeRequirements:any[] = [];
  closedRequirements:any[] = [];
  categories:any[] = [];

  constructor(
    private snackBar:MatSnackBar,
    private customerService:CustomerService,
    private categoryService:CategoryService,
    private modalController:ModalController,
    private navController:NavController
  ) { }

  ngOnInit(): void {  
  }
  ionViewWillEnter(){
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getCategories(); 
  }
  ngOnDestroy():void{
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getCategories(){
    this.categoryService.getAllCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.getActiveRequirements();
        this.getClosedRequirements(0,this.pageSize);
      }
    },error=>{
      this.showSnackbar("Server error",true,"close");
    });
  }
  getActiveRequirements(){
    this.isGettingActiveRequirements = true;
    this.customerService.getActiveRequirement(localStorage.getItem("uid")).subscribe(res=>{
      this.isGettingActiveRequirements = false;
      if(res["success"]){
        this.activeRequirements = res["data"];
        this.activeRequirements.map(obj=>{
          let categoryName = this.categories.filter(category=>{
            return category.categoryId == obj.categoryId;
          })[0]["categoryName"];
          return obj.categoryId = categoryName;
        });
      }else{
        this.isGettingActiveRequirementsSuccess = false;
      }
    },error=>{
      this.isGettingActiveRequirements = false;
      this.isGettingActiveRequirementsSuccess = false;
    });
  }
  getClosedRequirements(pageNo:number,pageSize:number){
    this.isGettingClosedrequirements = true;
    this.config["totalItems"] = 0;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;
    this.customerService.getClosedRequirements(localStorage.getItem("uid"),this.pageNo,this.pageSize).subscribe(res=>{
      this.isGettingClosedrequirements = false;
      if(res["success"]){
        this.closedRequirements = res["data"]["content"];
        this.closedRequirements.map(obj=>{
          let categoryName = this.categories.filter(category=>{
            return category.categoryId == obj.categoryId;
          })[0]["categoryName"];
          return obj.categoryId = categoryName;
        });   
        this.config["totalItems"] = res["data"]["totalElements"];     
      }else{
        this.isGettingClosedrequirementsSuccess = false;
      }
    },error=>{
      this.isGettingClosedrequirements = false;
      this.isGettingActiveRequirementsSuccess = false;
    });
  }
  
  async viewAllQoutes(requirementId:string,event:any){
    event.stopPropagation();
    event.preventDefault();
    const modal = await this.modalController.create({
      component: ViewQoutesPage,
      componentProps:{
        "requirementId":requirementId
      }
    });   
    modal.onDidDismiss().then((data) => {
      if(data['data']['shouldShowChat']){
        this.navController.navigateForward(["/chat"]);
      }
    });      
    return await modal.present();      
    
  }
  async closeRequirement(requirementId:string){
    const modal = await this.modalController.create({
      component: CloseRequirementPage,
      componentProps:{
        "requirementId":requirementId
      }
    });       
    modal.onDidDismiss().then((data) => {
      if(data['data']['isSuccess']){
        this.getActiveRequirements();
        this.getClosedRequirements(this.pageNo,this.pageSize);
        this.showSnackbar("Requirement closed successfully!",true,"close");
      }
    }); 
    return await modal.present();
  } 
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getClosedRequirements(this.pageNo,this.pageSize);
  }
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  doRefresh(event:any) {
    this.config = {}

    this.pageNo = 0;
    this.pageSize = 9;
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.selectedTab = 0;
    this.isGettingActiveRequirements = true;
    this.isGettingClosedrequirements = true;

    this.isGettingActiveRequirementsSuccess = true;
    this.isGettingClosedrequirementsSuccess = true;

    this.activeRequirements = [];
    this.closedRequirements = [];
    this.categories = [];
    this.segment = "active";
    this.getCategories();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
