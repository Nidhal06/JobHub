import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { JobApplication } from '../../../models/application.model';
import { ExperienceLevel, JobOffer, JobType } from '../../../models/job.model';
import { AuthService } from '../../../services/auth.service';
import { JobService } from '../../../services/job.service';

@Component({
    selector: 'app-recruiter-dashboard',
    templateUrl: './recruiter-dashboard.component.html',
    styleUrls: ['./recruiter-dashboard.component.scss']
})
export class RecruiterDashboardComponent implements OnInit, OnDestroy {
    jobForm: FormGroup = this.fb.group({
        title: ['', [Validators.required]],
        location: ['', [Validators.required]],
        salary: ['', [Validators.required]],
        type: ['full-time' as JobType, Validators.required],
        industry: ['', [Validators.required]],
        experienceLevel: ['mid' as ExperienceLevel, Validators.required],
        description: ['', [Validators.required, Validators.minLength(50)]],
        requirements: ['', [Validators.required]],
        responsibilities: ['', [Validators.required]],
        tags: ['']
    });

    jobs: JobOffer[] = [];
    applications: JobApplication[] = [];
    successMessage = '';
    private readonly destroy$ = new Subject<void>();

    readonly jobTypes: JobType[] = ['full-time', 'part-time', 'freelance', 'contract', 'internship'];
    readonly experienceLevels: ExperienceLevel[] = ['entry', 'mid', 'senior', 'executive'];

    constructor(
        private readonly fb: FormBuilder,
        private readonly jobService: JobService,
        private readonly authService: AuthService
    ) { }

    ngOnInit(): void {
        this.jobService.jobs$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.refreshRecruiterData();
        });
        this.refreshRecruiterData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    submitJob(): void {
        if (this.jobForm.invalid) {
            this.jobForm.markAllAsTouched();
            return;
        }

        const recruiter = this.authService.currentUser;
        if (!recruiter) {
            return;
        }

        const value = this.jobForm.value;
        const parseList = (input: string): string[] =>
            input
                .split(/[\n,]/)
                .map(item => item.trim())
                .filter(Boolean);

        this.jobService.createJob(
            {
                title: value.title,
                company: recruiter.company ?? 'Your Company',
                location: value.location,
                salary: value.salary,
                type: value.type,
                industry: value.industry,
                experienceLevel: value.experienceLevel,
                description: value.description,
                requirements: parseList(value.requirements),
                responsibilities: parseList(value.responsibilities),
                tags: parseList(value.tags)
            },
            recruiter.id
        );

        this.successMessage = 'Your job offer was submitted for admin review. You will be notified after moderation.';
        this.jobForm.reset({
            type: 'full-time',
            experienceLevel: 'mid'
        });
    }

    get controls() {
        return this.jobForm.controls;
    }

    private refreshRecruiterData(): void {
        const recruiter = this.authService.currentUser;
        if (!recruiter) {
            return;
        }
        this.jobs = this.jobService.getRecruiterJobs(recruiter.id);
        this.applications = this.jobService.getApplicationsForRecruiter(recruiter.id);
    }
}
