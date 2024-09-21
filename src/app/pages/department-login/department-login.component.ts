import { Component } from '@angular/core';
import {apiEndPoint, isAdminName, tokenName} from "../../constants/constants";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormsModule} from "@angular/forms";
import axios from "axios";

@Component({
  selector: 'app-department-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './department-login.component.html',
  styleUrl: './department-login.component.css'
})
export class DepartmentLoginComponent {
  constructor(private _router: Router, private  toastr: ToastrService) {
    const userToken = localStorage.getItem(tokenName);
    if (userToken){
      const isAdmin = localStorage.getItem(isAdminName);
      if (isAdmin){
        _router.navigate(['/admin-dashboard']);
      }else{
        localStorage.clear();
        _router.navigate(['/department-login']);
      }
    }
  }

  isLoading:boolean = false;

  departmentObj:any={
    username:'',
    password:''
  }

  async login(): Promise<void> {
    try {
      if (!this.departmentObj.username || !this.departmentObj.password) {
        this.toastr.error("Username or password cannot be empty", "Error");
        return;
      }
      const response = await axios.post(apiEndPoint + '/department/login', this.departmentObj);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem(tokenName, token);
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
