import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { JobApplication } from '../../../models/application.model';
import { JobOffer } from '../../../models/job.model';
import { AuthService } from '../../../services/auth.service';
import { JobService } from '../../../services/job.service';

@Component({
    selector: 'app-seeker-dashboard',
    templateUrl: './seeker-dashboard.component.html',
    styleUrls: ['./seeker-dashboard.component.scss']
})
export class SeekerDashboardComponent implements OnInit, OnDestroy {
    applications: JobApplication[] = [];
    recommendedJobs: JobOffer[] = [];
    private readonly savedJobIds = new Set<string>();
    private readonly destroy$ = new Subject<void>();
    private currentUserId: string | null = null;

    constructor(private readonly jobService: JobService, private readonly authService: AuthService) { }

    ngOnInit(): void {
        const user = this.authService.currentUser;
        this.currentUserId = user?.id ?? null;
        if (this.currentUserId) {
            this.applications = this.jobService.getApplicationsForCandidate(this.currentUserId);
        }

        this.jobService.jobs$.pipe(takeUntil(this.destroy$)).subscribe(jobs => {
            this.recommendedJobs = jobs
                .filter(job => job.status === 'approved')
                .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                .slice(0, 5);

            if (this.currentUserId) {
                this.applications = this.jobService.getApplicationsForCandidate(this.currentUserId);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleSaved(job: JobOffer): void {
        if (this.savedJobIds.has(job.id)) {
            this.savedJobIds.delete(job.id);
        } else {
            this.savedJobIds.add(job.id);
        }
    }

    isSaved(job: JobOffer): boolean {
        return this.savedJobIds.has(job.id);
    }

    get savedJobs(): JobOffer[] {
        return this.recommendedJobs.filter(job => this.savedJobIds.has(job.id));
    }
}
