import { Component } from '@angular/core';
import {appName, isAdminName, tokenName} from "../../constants/constants";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  appName = appName;


  isLoggedIn():boolean{
    const token = localStorage.getItem(tokenName);
    return !!token;
  }

  isAdmin():boolean{
    const token = localStorage.getItem(tokenName);
    const isAdmin = !!localStorage.getItem(isAdminName);
    if (token){
      return isAdmin;
    }
    return false;
  }
  logout():void{
    localStorage.clear();
    window.location.reload();
  }
}
