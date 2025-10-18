import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.seedNotifications();
  }

  private seedNotifications(): void {
    this.notificationService.seed('admin-1', [
      {
        id: 'notif-admin-1',
        message: 'New job offers await your approval.',
        createdAt: new Date().toISOString(),
        read: false,
        type: 'info'
      }
    ]);

    this.notificationService.seed('recruiter-1', [
      {
        id: 'notif-recruiter-1',
        message: 'Admin approved Senior Frontend Engineer posting.',
        createdAt: new Date().toISOString(),
        read: false,
        type: 'success'
      }
    ]);

    this.notificationService.seed('seeker-1', [
      {
        id: 'notif-seeker-1',
        message: 'Applications are open for Product Designer at Orbit Commerce.',
        createdAt: new Date().toISOString(),
        read: false,
        type: 'info'
      }
    ]);
  }
}
