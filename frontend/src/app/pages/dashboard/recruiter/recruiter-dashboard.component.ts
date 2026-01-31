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
    selectedApplication: JobApplication | null = null;
    successMessage = '';
    statusUpdateMessage = '';
    private readonly destroy$ = new Subject<void>();

    readonly jobTypes: JobType[] = ['full-time', 'part-time', 'freelance', 'contract', 'internship'];
    readonly experienceLevels: ExperienceLevel[] = ['entry', 'mid', 'senior', 'executive'];
    readonly applicationStatuses = ['received', 'reviewed', 'shortlisted', 'rejected'];

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

    viewApplication(application: JobApplication): void {
        this.selectedApplication = application;
    }

    closeApplicationModal(): void {
        this.selectedApplication = null;
        this.statusUpdateMessage = '';
    }

    updateApplicationStatus(applicationId: string, status: string): void {
        this.jobService.updateApplicationStatus(applicationId, status).subscribe({
            next: (updatedApplication) => {
                const index = this.applications.findIndex(a => a.id === applicationId);
                if (index !== -1) {
                    this.applications[index] = updatedApplication;
                }
                if (this.selectedApplication?.id === applicationId) {
                    this.selectedApplication = updatedApplication;
                }
                this.statusUpdateMessage = `Application status updated to "${status}"`;
                setTimeout(() => this.statusUpdateMessage = '', 3000);
            },
            error: (err) => {
                console.error('Failed to update status:', err);
                this.statusUpdateMessage = 'Failed to update application status';
            }
        });
    }

    getJobTitle(jobId: string): string {
        const job = this.jobs.find(j => j.id === jobId);
        return job?.title ?? 'Unknown Job';
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'received': return 'bg-secondary';
            case 'reviewed': return 'bg-info';
            case 'shortlisted': return 'bg-success';
            case 'rejected': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    downloadDocument(applicationId: string, documentId: string, fileName: string): void {
        console.log('Downloading document:', applicationId, documentId, fileName);
        this.jobService.downloadDocument(applicationId, documentId).subscribe({
            next: (doc) => {
                console.log('Document response:', doc);
                if (doc.content) {
                    try {
                        // Convert Base64 to Blob and trigger download
                        const byteCharacters = atob(doc.content);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: doc.type || 'application/octet-stream' });
                        
                        // Create download link
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                    } catch (e) {
                        console.error('Error processing download:', e);
                        alert('Error downloading file. The file may be corrupted.');
                    }
                } else {
                    alert('This file was uploaded before the download feature was added. No content available.');
                }
            },
            error: (err) => {
                console.error('Failed to download document:', err);
                alert('Failed to download document. Please try again.');
            }
        });
    }

    downloadAllDocuments(): void {
        if (!this.selectedApplication?.attachments?.length) {
            return;
        }
        
        // Download each document
        this.selectedApplication.attachments.forEach((doc, index) => {
            setTimeout(() => {
                this.downloadDocument(this.selectedApplication!.id, doc.id, doc.name);
            }, index * 500); // Stagger downloads to prevent browser blocking
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
        
        // Load applications from API
        this.jobService.getRecruiterApplicationsFromApi().subscribe({
            next: (apps) => this.applications = apps,
            error: (err) => {
                console.error('Failed to load applications:', err);
                // Fallback to local data
                this.applications = this.jobService.getApplicationsForRecruiter(recruiter.id);
            }
        });
    }
}
