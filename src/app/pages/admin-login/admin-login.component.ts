import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {apiEndPoint, isAdminName, tokenName} from "../../constants/constants";
import {ToastrService} from "ngx-toastr";
import {FormsModule} from "@angular/forms";
import axios from "axios";

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  isLoading:boolean=false;

  constructor(private _router:Router,private toastr: ToastrService) {
    const token = localStorage.getItem(tokenName);
    const isAdmin = !!localStorage.getItem(isAdminName);
    if (token){
      if (isAdmin){
        _router.navigate(['/admin-dashboard']);
      }else{
        localStorage.clear();
        _router.navigate(['/admin-login']);
      }
    }
  }

  adminObj:any={
    username:'',
    password:''
  }

  async login(): Promise<void> {
    try {
      if (!this.adminObj.username || !this.adminObj.password) {
        this.toastr.error("Username or password cannot be empty", "Error");
        return;
      }
      const response = await axios.post(apiEndPoint + '/admin/login', this.adminObj);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem(tokenName, token);
        localStorage.setItem(isAdminName,'true');
        this.toastr.success(response.data.message, response.data.status);
        await this._router.navigate(['/admin-dashboard']);
      } else {
        this.toastr.error(response.data.message ?? 'An error occurred', 'Error');
      }
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        this.toastr.error(e.response.data.message, "Error");
      } else if (e.message) {
        this.toastr.error(e.message, "Error");
      } else {
        this.toastr.error("Something went wrong", "Error");
      }
      return;
    }finally {
      this.isLoading=false
    }
  }


}
