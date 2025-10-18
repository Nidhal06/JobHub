import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserProfile, UserRole } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

interface DashboardNavItem {
    label: string;
    route: string[];
    roles: UserRole[];
    description: string;
}

@Component({
    selector: 'app-dashboard-shell',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    user: UserProfile | null = null;
    readonly navItems: DashboardNavItem[] = [
        {
            label: 'Admin Console',
            route: ['admin'],
            roles: ['admin'],
            description: 'Approve or decline job offers and supervise platform health.'
        },
        {
            label: 'Recruiter Hub',
            route: ['recruiter'],
            roles: ['recruiter'],
            description: 'Create job postings and monitor candidate pipelines.'
        },
        {
            label: 'Seeker Space',
            route: ['seeker'],
            roles: ['seeker'],
            description: 'Track applications and manage saved job searches.'
        },
        {
            label: 'Notifications',
            route: ['notifications'],
            roles: ['admin', 'recruiter', 'seeker'],
            description: 'Review alerts about approvals, applications, and status changes.'
        }
    ];

    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                this.user = user;
                if (user && !this.route.firstChild) {
                    const target = this.authService.mapRolesToRoutes()[user.role];
                    if (target) {
                        this.router.navigateByUrl(target);
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    canView(item: DashboardNavItem): boolean {
        if (!this.user) {
            return false;
        }
        return item.roles.includes(this.user.role);
    }
}
