import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserProfile } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    readonly user$: Observable<UserProfile | null> = this.authService.currentUser$;
    readonly unreadCount$: Observable<number> = this.user$.pipe(
        switchMap(user => (user ? this.notificationService.getUnreadCount(user.id) : of(0)))
    );

    constructor(
        private readonly authService: AuthService,
        private readonly notificationService: NotificationService,
        private readonly router: Router
    ) { }

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}
