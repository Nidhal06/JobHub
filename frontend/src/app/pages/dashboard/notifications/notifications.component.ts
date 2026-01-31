import { Component, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { UserNotification } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-notifications-center',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    notifications$: Observable<UserNotification[]> = of([]);

    constructor(
        private readonly authService: AuthService,
        private readonly notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.notifications$ = this.authService.currentUser$.pipe(
            switchMap(user => (user ? this.notificationService.getNotifications(user.id) : of([])))
        );
    }

    markAll(): void {
        const user = this.authService.currentUser;
        if (user) {
            this.notificationService.markAllAsRead(user.id);
        }
    }

    mark(notification: UserNotification): void {
        const user = this.authService.currentUser;
        if (user) {
            this.notificationService.markAsRead(user.id, notification.id);
        }
    }
}
