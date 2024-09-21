import { Routes } from '@angular/router';
import {DepartmentDashboardComponent} from "./pages/department-dashboard/department-dashboard.component";
import {AdminDashboardComponent} from "./pages/admin-dashboard/admin-dashboard.component";
import {AdminLoginComponent} from "./pages/admin-login/admin-login.component";
import {DepartmentLoginComponent} from "./pages/department-login/department-login.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";

export const routes: Routes = [
  {
    path:'',
    redirectTo:'department-login',
    pathMatch:'full'
  },
  {
    path : 'department-login',component:DepartmentLoginComponent,
  },
  {
    path:'admin-login', component : AdminLoginComponent
  },
  {
    path:'admin-dashboard', component : AdminDashboardComponent
  },
  {
    path:'department-dashboard', component : DepartmentDashboardComponent
  },
  {
    path:'**',
    pathMatch:'full',
    component:PageNotFoundComponent
  }
];
