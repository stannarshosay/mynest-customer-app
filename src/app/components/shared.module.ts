import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GoogleMapComponent } from './google-map/google-map.component';


@NgModule({
  imports:[CommonModule,FlexLayoutModule],
  exports: [HeaderComponent,GoogleMapComponent],
  declarations: [HeaderComponent,GoogleMapComponent]
})
export class SharedModule{}