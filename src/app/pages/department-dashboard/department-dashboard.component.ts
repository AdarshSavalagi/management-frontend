import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {apiEndPoint, isAdminName, tokenName} from "../../constants/constants";
import {FormsModule} from "@angular/forms";
import axios from "axios";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-department-dashboard',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './department-dashboard.component.html',
  styleUrl: './department-dashboard.component.css'
})
export class DepartmentDashboardComponent {
  requests = [
    { title: 'Request 1', subject: 'Subject 1', message: 'Message 1', status: 'sent' },
    { title: 'Request 2', subject: 'Subject 2', message: 'Message 2', status: 'read' },
    { title: 'Request 3', subject: 'Subject 3', message: 'Message 3', status: 'processing' },
    { title: 'Request 4', subject: 'Subject 4', message: 'Message 4', status: 'closed' }
  ];

  constructor(private _router: Router, private toastr:ToastrService) {
    const token = localStorage.getItem(tokenName);
    const isAdmin = !!localStorage.getItem(isAdminName);
    if (isAdmin && token){
      _router.navigate(['/admin-dashboard']);
    }
    if (!token){
      _router.navigate(['/department-login']);
    }
    this.getRequests();
  }

  async  getRequests() {
    try{
      const response = await axios.get(apiEndPoint+'/requests/get-department-requests',{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem(tokenName)}`
        }
      });
      console.log(response);
      this.requests = response.data;
    }catch (e:any){
      this.toastr.error(e.message,"error");
    }
  }

  selectedRequest: any = null;
  newRequest:any={
    title:'',
    subject:'',
    description:''
  }
  isModelOpened: boolean=false;
  isLoading:boolean=false;
  openModal(){
    this.isModelOpened = true;
  }

  closeModal() {
    this.isModelOpened=false;
  }

  async submitNewRequest() {
    this.isLoading=true;
    try {
      const response = await axios.post(apiEndPoint+'/requests/create', this.newRequest,{
        headers:{
          "Authorization": `Bearer ${localStorage.getItem(tokenName)}`
        }
      });
     await this.getRequests();
      if (response.status === 201) {
        this.toastr.success(response.data.message,response.data.status);
      }else{
        this.toastr.error(response.data.message,"error");
      }
    }catch (e:any){
      console.error(e);
      this.toastr.error(e.message,"Error")
    }finally {
        this.isLoading=false;
    }
  }

  selectRequest(request: any): void {
    this.selectedRequest = request;
  }


  getStatusClass(status: number): string {
    switch (status) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-blue-500';
      case 3:
        return 'text-purple-500';
      case 4:
        return 'text-green-500';
      default:
        return '';
    }
  }


  getStatusText(status:number):string {
    switch (status) {
      case 1:
        return 'sent';
      case 2:
        return 'read';
      case 3:
        return 'processing';
      case 4:
        return 'closed';
      default:
        return '';
    }
  }
}
