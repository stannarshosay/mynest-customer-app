import { Component, OnInit } from '@angular/core';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import moment from 'moment';
@Component({
  selector: 'app-newsfeeds',
  templateUrl: './newsfeeds.page.html',
  styleUrls: ['./newsfeeds.page.scss'],
})
export class NewsfeedsPage implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  config:any = {};
  newsfeeds:any[] = [];
  isNewsfeedsDataSuccess = true;
  isNewsfeedsLoaded = false;
  pageNo:number = 0;
  pageSize:number = 8;
  constructor(
    private newsfeedService:NewsfeedService
  ) { }

  ngOnInit(): void {       
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize; 
  }
  ionViewWillEnter(){ 
    this.getNewsfeeds(this.pageNo,this.pageSize);
  }
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getNewsfeeds(this.pageNo,this.pageSize);
  } 
  getNewsfeeds(pageNo:any,pageSize:any){
    this.newsfeeds = [];
    this.config["totalItems"] = 0;
    this.isNewsfeedsDataSuccess = true;
    this.isNewsfeedsLoaded = false;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;    
    this.newsfeedService.getNewsfeeds(pageNo,pageSize).subscribe(res=>{
      this.isNewsfeedsLoaded = true;
      if(res["success"]){
        this.newsfeeds =res["data"]["content"];
        this.config["totalItems"] = res["data"]["totalElements"];
      }else{
        this.isNewsfeedsDataSuccess = false;
      }
    },
    error =>{
      this.isNewsfeedsLoaded = true;
      this.isNewsfeedsDataSuccess = false;
    });
  }
  checkLength(description:string){    
    if(description.length>50){
      return description.substring(0,50) +" ...";
    }
    return description;
 }
 getImagePath(image:any){
  if((image)&&(image!="")){
    return encodeURIComponent(image);
  }
  return encodeURIComponent("default.jpg");
 }
 getShareLink(id:any){    
  return encodeURIComponent("https://mynestonline.com/customer/newsfeed/"+id);
}
getEncoded(data:any){
  return encodeURIComponent(data);
}
getBeautifiedDate(dateString:string){
  let date = moment(dateString, "DD/MM/YYYY");
  if(date.isSame(moment(),'day')){
    return "Today";
  }
  if(date.isSame(moment().subtract(1,"days"),'day')){      
    return "Yesterday";
  }
  return date.format('Do MMM YYYY');
}
 doRefresh(event:any) {
  this.config = {};     
  this.config["totalItems"] = 0;
  this.config["currentPage"] = this.pageNo+1;
  this.config["itemsPerPage"] = this.pageSize; 
  this.newsfeeds = [];
  this.isNewsfeedsDataSuccess = true;
  this.isNewsfeedsLoaded = false;
  this.pageNo = 0;
  this.pageSize = 6;
  this.getNewsfeeds(this.pageNo,this.pageSize);
  setTimeout(() => {
    event.target.complete();
  }, 2000);
 } 
}
