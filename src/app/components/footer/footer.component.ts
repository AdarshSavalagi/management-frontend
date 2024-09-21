import { Component } from '@angular/core';
import {appName, tokenName} from '../../constants/constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
    appName=appName;

    isLoggedIn(){
      const token = localStorage.getItem(tokenName);
      return !!token;
    }

  logout() {
    localStorage.clear();
    window.location.reload();
  }
}
