import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.page.html',
  styleUrls: ['./image-viewer.page.scss'],
})
export class ImageViewerPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @Input('choosedImage') choosedImage:number;
  @Input('gallery') gallery:any;
  imageGallery:any;
  showSlides:boolean = false;
  sliderOpts={};
  constructor(private modalController:ModalController) {     
  }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.sliderOpts={
      zoom:{
        maxRatio:5
      }      
    }
    this.imageGallery = this.gallery;
    this.showSlides = true;
    setTimeout(() => {
      this.slides.slideTo(this.choosedImage);    
    }, 0);
  }
  dismiss(){
    this.modalController.dismiss();
  }
}
