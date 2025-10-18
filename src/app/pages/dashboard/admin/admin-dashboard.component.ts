import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { JobOffer } from '../../../models/job.model';
import { AuthService } from '../../../services/auth.service';
import { JobService } from '../../../services/job.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    pendingJobs: JobOffer[] = [];
    approvedJobs: JobOffer[] = [];
    deniedJobs: JobOffer[] = [];
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly jobService: JobService,
        private readonly authService: AuthService,
        private readonly notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.jobService.jobs$.pipe(takeUntil(this.destroy$)).subscribe(jobs => {
            this.pendingJobs = jobs.filter(job => job.status === 'pending');
            this.approvedJobs = jobs.filter(job => job.status === 'approved');
            this.deniedJobs = jobs.filter(job => job.status === 'denied');
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    approve(job: JobOffer): void {
        const admin = this.authService.currentUser;
        if (!admin) {
            return;
        }
        this.jobService.updateJobStatus(job.id, 'approved', admin.id);
        if (job.createdBy) {
            this.notificationService.push(job.createdBy, {
                message: `${job.title} was approved by admin ${admin.name}.`,
                type: 'success'
            });
        }
    }

    deny(job: JobOffer): void {
        const admin = this.authService.currentUser;
        if (!admin) {
            return;
        }
        this.jobService.updateJobStatus(job.id, 'denied', admin.id);
        if (job.createdBy) {
            this.notificationService.push(job.createdBy, {
                message: `${job.title} was denied. Please review and resubmit.`,
                type: 'alert'
            });
        }
    }
}
