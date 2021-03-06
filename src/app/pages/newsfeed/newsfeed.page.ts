import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import moment from 'moment';
@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss'],
})
export class NewsfeedPage implements OnInit {
  newsId:string = "";
  news:any = "";
  isNewsfeedDataSuccess:boolean = true;
  isNewsfeedLoaded:boolean = false;
  constructor(
    private route:ActivatedRoute,
    private newsfeedService:NewsfeedService
  ) { }

  ngOnInit(): void {
  }
  ionViewWillEnter(){
    this.getNewsfeedById();
  }
  getNewsfeedById(){
    this.isNewsfeedDataSuccess = true;
    this.isNewsfeedLoaded = false;
    this.newsId = "";
    this.news = "";
    this.route.paramMap.subscribe(params => {
      this.newsId = params.get('newsId')
    });
    this.newsfeedService.getNewsfeedById(this.newsId).subscribe(res=>{
      this.isNewsfeedLoaded = true;
      if(res["success"]){
        this.news =res["data"];
      }else{
        this.isNewsfeedDataSuccess = false;
      }
    },
    error =>{
      this.isNewsfeedLoaded = true;
      this.isNewsfeedDataSuccess = false;
    });
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
  this.getNewsfeedById();
  setTimeout(() => {
    event.target.complete();
  }, 2000);
 } 
}
