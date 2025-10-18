import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { JobApplication } from '../../models/application.model';
import { ExperienceLevel, JobOffer, JobType } from '../../models/job.model';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { NotificationService } from '../../services/notification.service';
import { ApplicationPayload } from '../../components/job/job-details-modal/job-details-modal.component';

@Component({
    selector: 'app-job-board',
    templateUrl: './job-board.component.html',
    styleUrls: ['./job-board.component.scss']
})
export class JobBoardComponent implements OnInit, OnDestroy {
    filtersForm: FormGroup = this.fb.group({
        searchTerm: [''],
        type: ['all'],
        industry: ['all'],
        experienceLevel: ['all']
    });

    jobs: JobOffer[] = [];
    filteredJobs: JobOffer[] = [];
    industries: string[] = [];
    readonly jobTypes: Array<{ label: string; value: JobType | 'all' }> = [
        { label: 'All types', value: 'all' },
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Freelance', value: 'freelance' },
        { label: 'Contract', value: 'contract' },
        { label: 'Internship', value: 'internship' }
    ];
    readonly experienceLevels: Array<{ label: string; value: ExperienceLevel | 'all' }> = [
        { label: 'All levels', value: 'all' },
        { label: 'Entry level', value: 'entry' },
        { label: 'Mid level', value: 'mid' },
        { label: 'Senior level', value: 'senior' },
        { label: 'Executive', value: 'executive' }
    ];

    selectedJob: JobOffer | null = null;
    detailsVisible = false;
    applicationSuccess = '';
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly jobService: JobService,
        private readonly authService: AuthService,
        private readonly notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.jobService.jobs$.pipe(takeUntil(this.destroy$)).subscribe(jobs => {
            this.jobs = jobs.filter(job => job.status === 'approved');
            this.filteredJobs = [...this.jobs];
            this.industries = Array.from(new Set(jobs.map(job => job.industry))).sort((a, b) =>
                a.localeCompare(b)
            );
        });

        this.filtersForm.valueChanges
            .pipe(debounceTime(200), takeUntil(this.destroy$))
            .subscribe(() => this.applyFilters());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    openDetails(job: JobOffer): void {
        this.selectedJob = job;
        this.detailsVisible = true;
        this.applicationSuccess = '';
    }

    closeDetails(): void {
        this.detailsVisible = false;
        this.selectedJob = null;
    }

    handleApplication(payload: ApplicationPayload): void {
        if (!this.selectedJob) {
            return;
        }

        const user = this.authService.currentUser;
        const application: JobApplication = {
            id: `app-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            jobId: this.selectedJob.id,
            candidateId: user?.id ?? 'guest',
            candidateName: payload.candidateName,
            candidateEmail: payload.candidateEmail,
            linkedinUrl: payload.linkedinUrl,
            githubUrl: payload.githubUrl,
            coverLetter: payload.coverLetter,
            submittedAt: new Date().toISOString(),
            status: 'received',
            attachments: payload.attachments
        };

        this.jobService.applyToJob(application);

        if (this.selectedJob.createdBy) {
            this.notificationService.push(this.selectedJob.createdBy, {
                message: `${payload.candidateName} applied for ${this.selectedJob.title}.`,
                type: 'info'
            });
        }

        if (user) {
            this.notificationService.push(user.id, {
                message: `Application sent to ${this.selectedJob.company} for ${this.selectedJob.title}.`,
                type: 'success'
            });
        }

        this.applicationSuccess = 'Application submitted successfully. We will keep you posted!';
        this.closeDetails();
    }

    private applyFilters(): void {
        const { searchTerm, type, industry, experienceLevel } = this.filtersForm.value;
        const term = (searchTerm ?? '').toLowerCase().trim();

        this.filteredJobs = this.jobs.filter(job => {
            const matchesTerm = term
                ? [job.title, job.company, job.location, job.industry, ...(job.tags ?? [])]
                    .join(' ')
                    .toLowerCase()
                    .includes(term)
                : true;

            const matchesType = type === 'all' || job.type === type;
            const matchesIndustry =
                !industry || industry === 'all' || industry === 'All industries'
                    ? true
                    : job.industry.toLowerCase() === industry.toLowerCase();
            const matchesExperience = experienceLevel === 'all' || job.experienceLevel === experienceLevel;

            return matchesTerm && matchesType && matchesIndustry && matchesExperience;
        });
    }
}
