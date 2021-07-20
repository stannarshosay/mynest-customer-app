import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('searchbar', {static: false}) searchbar: IonSearchbar;

  locationList = [];
  isLoaded:boolean = false;
  searchCategories=[];
  filteredSearchCategories:any[]=[];
  constructor(
    public modalCtrl:ModalController,
    private categoryService:CategoryService
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.getAllCategories(); 
  }
  dismiss(shouldRedirect:boolean,category:any){
    this.modalCtrl.dismiss({
      'dismissed': shouldRedirect,
      'category': category
    });
  }
  getAllCategories(){
    this.filteredSearchCategories = [];
    this.searchCategories = [];
    this.categoryService.getCategoriesWithSubcategories().subscribe(res => {
      if(res["success"]){
        this.isLoaded = true;
        let that = this;
        res["data"].forEach(function(value:any) {
            let categoryObject = {};
            categoryObject["isCategory"] = true;
            categoryObject["name"] = value.categoryName;
            categoryObject["categoryName"] = value.categoryName;
            categoryObject["categoryId"] = value.categoryId;
            that.searchCategories.push(categoryObject);
            that.filteredSearchCategories.push(categoryObject);
            value.subCategories.forEach(function(subValue:any){
              let categoryObject = {};
              categoryObject["isCategory"] = false;
              categoryObject["name"] = subValue;
              categoryObject["categoryId"] = value.categoryId;
              categoryObject["categoryName"] = value.categoryName;
              that.searchCategories.push(categoryObject);
              that.filteredSearchCategories.push(categoryObject);
            });
        });   
      }
    });
  }
  search(category:any){
    this.dismiss(true,category);
  }  
  searching(event:any){
    this.filteredSearchCategories = this._filter(event.target.value);
  }
  private _filter(value: string): string[] {
    return this.searchCategories.filter(option => option.name.toLowerCase().includes(value.toLowerCase()));
  }  
  doRefresh(event:any) {
    this.isLoaded =false;
    this.getAllCategories();
    this.searchbar.value = null;
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
