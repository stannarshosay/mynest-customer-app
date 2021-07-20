import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },   {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'newsfeeds',
    loadChildren: () => import('./pages/newsfeeds/newsfeeds.module').then( m => m.NewsfeedsPageModule)
  },
  {
    path: 'newsfeed/:newsId',
    loadChildren: () => import('./pages/newsfeed/newsfeed.module').then( m => m.NewsfeedPageModule)
  },
  {
    path: 'providers/:categoryName/:categoryId',
    loadChildren: () => import('./pages/provider-list/provider-list.module').then( m => m.ProviderListPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./modals/location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./modals/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modals/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./modals/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./modals/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'provider/:vendorId',
    loadChildren: () => import('./pages/provider/provider.module').then( m => m.ProviderPageModule)
  },
  {
    path: 'report-vendor',
    loadChildren: () => import('./modals/report-vendor/report-vendor.module').then( m => m.ReportVendorPageModule)
  },
  {
    path: 'image-viewer',
    loadChildren: () => import('./modals/image-viewer/image-viewer.module').then( m => m.ImageViewerPageModule)
  },
  {
    path: 'requirements',
    loadChildren: () => import('./pages/requirements/requirements.module').then( m => m.RequirementsPageModule)
  },
  {
    path: 'view-qoutes',
    loadChildren: () => import('./modals/view-qoutes/view-qoutes.module').then( m => m.ViewQoutesPageModule)
  },
  {
    path: 'close-requirement',
    loadChildren: () => import('./modals/close-requirement/close-requirement.module').then( m => m.CloseRequirementPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'profile-settings',
    loadChildren: () => import('./pages/profile-settings/profile-settings.module').then( m => m.ProfileSettingsPageModule)
  },
  {
    path: 'login-otp',
    loadChildren: () => import('./modals/login-otp/login-otp.module').then( m => m.LoginOtpPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'providers/:categoryName/:categoryId/:subCategory',
    loadChildren: () => import('./pages/providers-list-sub/providers-list-sub.module').then( m => m.ProvidersListSubPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
