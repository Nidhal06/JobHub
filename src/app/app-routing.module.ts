import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { JobBoardComponent } from './pages/job-board/job-board.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/dashboard/admin/admin-dashboard.component';
import { RecruiterDashboardComponent } from './pages/dashboard/recruiter/recruiter-dashboard.component';
import { SeekerDashboardComponent } from './pages/dashboard/seeker/seeker-dashboard.component';
import { NotificationsComponent } from './pages/dashboard/notifications/notifications.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'jobs', component: JobBoardComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'recruiter',
        component: RecruiterDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['recruiter'] }
      },
      {
        path: 'seeker',
        component: SeekerDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['seeker'] }
      },
      {
        path: 'notifications',
        component: NotificationsComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
