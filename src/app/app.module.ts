import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { JobCardComponent } from './components/job/job-card/job-card.component';
import { JobDetailsModalComponent } from './components/job/job-details-modal/job-details-modal.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { JobBoardComponent } from './pages/job-board/job-board.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/dashboard/admin/admin-dashboard.component';
import { RecruiterDashboardComponent } from './pages/dashboard/recruiter/recruiter-dashboard.component';
import { SeekerDashboardComponent } from './pages/dashboard/seeker/seeker-dashboard.component';
import { NotificationsComponent } from './pages/dashboard/notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    JobCardComponent,
    JobDetailsModalComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    JobBoardComponent,
    DashboardComponent,
    AdminDashboardComponent,
    RecruiterDashboardComponent,
    SeekerDashboardComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
