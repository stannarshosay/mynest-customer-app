import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocationService } from 'src/app/services/location.service';
import { LoginService } from 'src/app/services/login.service';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
const { Toast } = Plugins;
@Component({
  selector: 'app-post-requirement',
  templateUrl: './post-requirement.page.html',
  styleUrls: ['./post-requirement.page.scss'],
})
export class PostRequirementPage implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChild('contactCheckbox') private contactCheckbox:ElementRef;
  @ViewChild('categorySelect') private categorySelect:MatSelect;
  @ViewChild('subCategorySelect') private subCategorySelect:MatSelect;
  @ViewChild('locationSelect') private locationSelect:MatSelect;

  maxDescriptionChars:string = "600";
  getLoginSetStatus:Subscription;
  isPosting:boolean = false;
  isGettingCategoryAndLocations:boolean = true;
  isGettingSubcategories:boolean = true;
  showContact:boolean = false;
  backButtonSubscription:Subscription;

  imagePreview = [];
  imageFile:File=null;

  categories:any = [];
  subCategories:any = [];
  locations:any = [];

  postRequirementForm: FormGroup;
  
  constructor(
    private snackBar:MatSnackBar,
    private loginService:LoginService,
    private router:Router,
    private fb:FormBuilder,
    public platform:Platform,
    private categoryService:CategoryService,
    private locationService:LocationService,
    private customerService:CustomerService
  ) { }

  ngOnInit(): void {
    this.postRequirementForm = this.fb.group({
      categoryId:['',Validators.required],
      locations:['',Validators.required],
      subCategoryId:[''],
      description:['',Validators.required],
      contact:[null]
    });    
  }
  ngOnDestroy():void{
  }
  ionViewDidEnter(){
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if(this.categorySelect.panelOpen||this.subCategorySelect.panelOpen||this.locationSelect.panelOpen){
        this.categorySelect.close();
        this.subCategorySelect.close();
        this.locationSelect.close();
      }else{
        processNextHandler();
      }
    });
  }
  ionViewWillEnter(){
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{      
      if(!res){
        this.router.navigate(["home"]);
      }
    });
    this.getAllCategories();
    this.postRequirementForm.get("subCategoryId").disable();
    this.postRequirementForm.get("categoryId").valueChanges.subscribe(res=>{
      if(res){
        this.getSubcategories(res);
      }
    });
  }
  ionViewWillLeave(){
    this.backButtonSubscription.unsubscribe();
    this.getLoginSetStatus.unsubscribe();
  }  
  async showToast(text:string) {
    await Toast.show({
      text: text
    });
  }
  getSubcategories(categoryId:any){
    this.subCategories = [];
    this.isGettingSubcategories = true;
    this.postRequirementForm.get("subCategoryId").disable();
    this.showSnackbar("Fetching subcategories!",true,"close");
    this.categoryService.getSubcategoriesByCategoryId(categoryId).subscribe(res=>{
       if(res["success"]){
          this.showSnackbar("Subcategories loaded!",true,"close");
          this.postRequirementForm.get("subCategoryId").enable();
          this.isGettingSubcategories = false;
          this.subCategories = res["data"];
       }else{
        this.showSnackbar("Unable to fetch subcategories!",true,"close");
       }
    },error=>{
      this.showSnackbar("Connection error!",true,"close");
      console.log(error);
    });
  }
  getAllCategories(){
    this.categoryService.getAllCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.getAllLocations();
      }else{
        this.isGettingCategoryAndLocations = false;
        this.showSnackbar("Error fetching categories!",true,"close");
      }
    },error=>{
      this.isGettingCategoryAndLocations = false;
      this.showSnackbar("Error fetching categories!",true,"close");
    });    
  }
  getAllLocations(){
    this.locationService.getAllLocations().subscribe(res=>{
      this.isGettingCategoryAndLocations =false;
      if(res["success"]){
        this.locations = res["data"];
      }else{
        this.showSnackbar("Error fetching locations!",true,"close");
      }
    },error=>{
      this.isGettingCategoryAndLocations = false;
      this.showSnackbar("Error fetching locations!",true,"close");
    });
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  onImageSelect(event:any,fileInput:any){
    this.imagePreview = [];
    var _size = event.target.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>2)&&(i==2))||(i==3)){
      this.showSnackbar("File size is larger than 2 MB",true,"okay");
    }else{
      this.imageFile = event.target.files[0];    
      var reader = new FileReader();   
      reader.onload = (event:any) => {
        this.imagePreview.push(event.target.result);  
      } 
      reader.readAsDataURL(event.target.files[0]);
    }    
  }
  postRequirement(){     
    if(!this.isGettingSubcategories){  
     if(this.postRequirementForm.valid){
         this.isPosting = true;
        this.showSnackbar("Posting requirement...",false,"");
        let formData = {};
        formData = this.postRequirementForm.value;
        formData["customerId"] = localStorage.getItem("uid");
        if(formData["subCategoryId"]){
          formData["subCategoryName"] = this.subCategories.find(obj=>obj.subCategoryId == formData["subCategoryId"])["subCategoryName"];
        }else{
          delete formData["subCategoryId"];
        }
        const uploadData = new FormData();
        uploadData.append('requirementDTO',new Blob([JSON.stringify(formData)], { type: "application/json"}));
        if(this.imageFile){
          uploadData.append('file', this.imageFile);
        }
        this.customerService.postRequirement(uploadData,).subscribe(res=>{
          this.isPosting = false;
          if(res["success"]){
            this.showSnackbar("Requirement posted successfully!",true,"close");
            this.imagePreview = [];
            this.imageFile = null;
            this.postRequirementForm.get("subCategoryId").disable();            
            this.showContact = false;
            this.contactCheckbox.nativeElement.checked = false;
            this.formDirective.resetForm();     
          }else{ 
            this.showSnackbar("Server error!",true,"close");
          }
        },error=>{
          this.isPosting = false;
          this.showSnackbar("Connection Error!",true,"close");
        }); 
     }else{
      this.showSnackbar("Please fill all required fields!",true,"close");
     }
    }else{
      this.showSnackbar("Please wait for subcategories to load!",true,"close");
    }
  }
  toggleShowContact(event:any){
    this.postRequirementForm.get("contact").setValue(null);
    this.showContact = event.target.checked;
  }
}
