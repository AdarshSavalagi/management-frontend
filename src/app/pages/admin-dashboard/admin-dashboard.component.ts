import { Component } from '@angular/core';
import {apiEndPoint, isAdminName, tokenName} from "../../constants/constants";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import axios from "axios";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  departments:any = [];
  selectedDepartment: any = null;
  selectedRequest: any = null;
  isLoading:boolean=false;
  isOpened:boolean=false;
  newDepartment:any={
    name:'',
    username:'',
    password:'',
  }

  constructor( private _router: Router, private toastr: ToastrService) {
    if (localStorage) {
      const token = localStorage.getItem(tokenName);
      const isAdmin = !!localStorage.getItem(isAdminName);
      if (!isAdmin && token){
        _router.navigate(['/department-dashboard']);
      }
      if (!token){
        _router.navigate(['/admin-login']);
      }
      this.getData();
    }
  }


  async getData() {
    try {
      const [departmentResponse, requestResponse] = await Promise.all([
        axios.get(apiEndPoint + "/department", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem(tokenName)}`
          }
        }),
        axios.get(apiEndPoint + "/requests", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem(tokenName)}`
          }
        })
      ]);

      const departments = departmentResponse.data;
      const requests = requestResponse.data;

      this.departments = [];

      departments.forEach((ele: any) => {
        this.departments.push({
          name: ele.name,
          id:ele.id,
          requests: requests.filter((req: any) => req.departmentId === ele.id),
          unRead: requests.filter((req: any) => req.departmentId === ele.id && req.status==1).length,
        });
      });
      console.log(this.departments);
    } catch (error: any) {
      this.toastr.error(error?.message ?? "An error occurred while fetching data.");
    }
  }

  selectDepartment(department: any): void {
    this.selectedDepartment = department;
    this.selectedRequest = null; // Reset selected request when changing departments
  }

  selectRequest(request: any): void {
    this.selectedRequest = request;
  }

  getStatusText(status: number): string {
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

  async addDepartment() {
    this.isLoading = true;
      try {
        const response = await axios.post(apiEndPoint + "/department/create", this.newDepartment,{headers:{Authorization: `Bearer ${localStorage.getItem(tokenName)}`}});
        if (response.status === 201) {
          this.toastr.success(response.data.message,response.data.status);
        }else{
          this.toastr.error(response.data.message,response.data.status);
        }
        await this.getData();
      }catch (e: any) {
          this.toastr.error(e.message,"Error");
      }finally {
        this.isLoading=false;
      }
  }



  async deleteDepartment(departmentId: string, event: Event) {
    // Prevent the click event from selecting the department
    event.stopPropagation();
  
    console.log(departmentId); // Log the department ID for debugging
  
    if (confirm(`Are you sure you want to delete the department with ID: ${departmentId}?`)) {
      try {
        // Make the DELETE request to the backend API
        const response = await axios.delete(`${apiEndPoint}/department/${departmentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenName)}` // Include the token in the header
          }
        });
  
        if (response.status === 200) {
          this.toastr.success('Department deleted successfully.');
          await this.getData(); // Refresh the data to reflect changes
        } else {
          this.toastr.error('Failed to delete the department.');
        }
      } catch (error: any) {
        this.toastr.error(error.message ?? 'An error occurred during deletion.');
      }
    }
}

  
  
  

 async updateStatus(selectedRequest: any) {
    try {
      const response = await axios.patch(apiEndPoint + "/requests/" + selectedRequest.id, {status:parseInt(selectedRequest.status)}, {headers:{Authorization: `Bearer ${localStorage.getItem(tokenName)}`}});
      if (response.status==200){
        this.toastr.success(response.data.message,response.data.status);
      }else{
        this.toastr.error(response.data.message,response.data.status);
      }
    }catch (e:any) {
      console.error(e);
      this.toastr.error(e.message,"Error");
    }
  }

  closeModal() {
    this.isOpened=false;
  }

  openModel() {
    this.isOpened=true;
  }


  getCsv() {
    if (this.departments.length === 0) {
      alert("No data available to download!");
      return;
    }

    const flatData = this.departments.flatMap((department: { requests: any[]; name: any; unRead: any; }) => {
      return department.requests.map((request: any) => ({
        departmentName: department.name,
        requestId: request.id,
        departmentId: request.departmentId,
        title: request.title,
        subject: request.subject,
        description: request.description,
        status: request.status,
        issued: request.issued,
        unRead: department.unRead
      }));
    });

    // Create CSV manually
    const headers = ['departmentName', 'requestId', 'departmentId', 'title', 'subject', 'description', 'status', 'issued', 'unRead'];
    const csvRows = flatData.map((row: any) =>
      headers.map(header => JSON.stringify(row[header], null, 2)).join(',')
    );

    // Add headers row at the top
    const csvData = [headers.join(','), ...csvRows].join('\r\n');

    // Create a Blob and download the file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'departments_requests.csv');
  }

}

