import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatroomPageRoutingModule } from './chatroom-routing.module';

import { ChatroomPage } from './chatroom.page';
import { SharedModule } from 'src/app/components/shared.module';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    ChatroomPageRoutingModule,
    MaterialModule
  ],
  declarations: [ChatroomPage]
})
export class ChatroomPageModule {}
