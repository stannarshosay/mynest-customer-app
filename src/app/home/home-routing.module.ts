import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path: 'chatroom',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/chatroom/chatroom.module').then( m => m.ChatroomPageModule),
            canActivate:[AuthGuard]
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/notifications/notifications.module').then( m => m.NotificationsPageModule),
            canActivate:[AuthGuard]    
          }
        ]
      },
      {
        path: 'wishlist',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/wishlist/wishlist.module').then( m => m.WishlistPageModule),
            canActivate:[AuthGuard]    
          }
        ]
      },
      {
        path: 'post-requirement',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/post-requirement/post-requirement.module').then( m => m.PostRequirementPageModule),
            canActivate:[AuthGuard]
          }
        ]
      },
      {
        path: 'landing',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/landing/landing.module').then( m => m.LandingPageModule)
          }
        ]
      },
    ]
  },
  {
    path: '',
    redirectTo: '/home/tabs/landing',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
