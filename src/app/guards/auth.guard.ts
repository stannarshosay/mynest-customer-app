import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService:LoginService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let hasLoggedIn:boolean = false; 
      this.loginService.getLoginSetStatus().subscribe(status => hasLoggedIn = status);
      if(!hasLoggedIn){
        this.loginService.shouldShowLogin.next(true);
      }else{
        this.loginService.shouldShowLogin.next(false);
      }
      return hasLoggedIn;
  }
  
}
