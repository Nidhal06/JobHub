import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JobApplication } from '../models/application.model';
import { ExperienceLevel, JobFilter, JobOffer, JobStatus, JobType } from '../models/job.model';
import { HttpClient } from '@angular/common/http';

interface CreateJobRequest {
    title: string;
    company: string;
    location: string;
    salary: string;
    type: JobType;
    industry: string;
    experienceLevel: ExperienceLevel;
    description: string;
    requirements: string[];
    responsibilities: string[];
    tags?: string[];
}

interface CreateApplicationRequest {
    jobId: string;
    linkedinUrl?: string;
    githubUrl?: string;
    coverLetter?: string;
    attachments?: any[];
}

@Injectable({ providedIn: 'root' })
export class JobService {
    private readonly apiUrl = 'http://localhost:8081/api';
    private readonly jobsSubject = new BehaviorSubject<JobOffer[]>([]);
    private readonly jobApplications = new Map<string, JobApplication[]>();

    constructor(private http: HttpClient) {
        this.loadJobs();
    }

    private loadJobs(): void {
        this.http.get<JobOffer[]>(`${this.apiUrl}/jobs/all`).subscribe({
            next: (jobs) => this.jobsSubject.next(jobs),
            error: (err) => console.error('Failed to load jobs:', err)
        });
    }

    get jobs$(): Observable<JobOffer[]> {
        return this.jobsSubject.asObservable();
    }

    getJobsSnapshot(): JobOffer[] {
        return [...this.jobsSubject.value];
    }

    refreshJobs(): void {
        this.loadJobs();
    }

    createJob(payload: CreateJobRequest, recruiterId: string): JobOffer {
        const tempJob: JobOffer = {
            ...payload,
            id: 'temp-' + Date.now(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            createdBy: recruiterId,
            applications: 0
        };

        this.http.post<JobOffer>(`${this.apiUrl}/jobs`, payload).subscribe({
            next: (job) => {
                const updated = [job, ...this.jobsSubject.value.filter(j => j.id !== tempJob.id)];
                this.jobsSubject.next(updated);
            },
            error: (err) => console.error('Failed to create job:', err)
        });

        const updated = [tempJob, ...this.jobsSubject.value];
        this.jobsSubject.next(updated);
        return tempJob;
    }

    updateJobStatus(jobId: string, status: JobStatus, adminId: string): void {
        this.http.patch<JobOffer>(`${this.apiUrl}/jobs/${jobId}/status`, { status }).subscribe({
            next: (updatedJob) => {
                const updated = this.jobsSubject.value.map(job =>
                    job.id === jobId ? updatedJob : job
                );
                this.jobsSubject.next(updated);
            },
            error: (err) => console.error('Failed to update job status:', err)
        });

        // Optimistic update
        const updated = this.jobsSubject.value.map(job =>
            job.id === jobId ? { ...job, status, lastUpdatedBy: adminId } : job
        );
        this.jobsSubject.next(updated);
    }

    applyToJob(application: JobApplication): void {
        const request: CreateApplicationRequest = {
            jobId: application.jobId,
            linkedinUrl: application.linkedinUrl,
            githubUrl: application.githubUrl,
            coverLetter: application.coverLetter,
            attachments: application.attachments
        };

        this.http.post<JobApplication>(`${this.apiUrl}/applications`, request).subscribe({
            next: (savedApplication) => {
                const existing = this.jobApplications.get(application.jobId) ?? [];
                this.jobApplications.set(application.jobId, [savedApplication, ...existing]);
                this.loadJobs();
            },
            error: (err) => console.error('Failed to apply to job:', err)
        });

        // Optimistic update
        const existing = this.jobApplications.get(application.jobId) ?? [];
        this.jobApplications.set(application.jobId, [application, ...existing]);

        const updated = this.jobsSubject.value.map(job =>
            job.id === application.jobId
                ? { ...job, applications: job.applications + 1 }
                : job
        );
        this.jobsSubject.next(updated);
    }

    getApplications(jobId: string): JobApplication[] {
        return [...(this.jobApplications.get(jobId) ?? [])];
    }

    getApplicationsFromApi(jobId: string): Observable<JobApplication[]> {
        return this.http.get<JobApplication[]>(`${this.apiUrl}/applications/job/${jobId}`);
    }

    getMyApplications(): Observable<JobApplication[]> {
        return this.http.get<JobApplication[]>(`${this.apiUrl}/applications/my`);
    }

    getApplicationsForRecruiter(recruiterId: string): JobApplication[] {
        const recruiterJobs = this.jobsSubject.value.filter(job => job.createdBy === recruiterId);
        return recruiterJobs.flatMap(job => this.getApplications(job.id));
    }

    getRecruiterApplicationsFromApi(): Observable<JobApplication[]> {
        return this.http.get<JobApplication[]>(`${this.apiUrl}/applications/recruiter`);
    }

    updateApplicationStatus(applicationId: string, status: string): Observable<JobApplication> {
        return this.http.patch<JobApplication>(
            `${this.apiUrl}/applications/${applicationId}/status`,
            { status }
        );
    }

    downloadDocument(applicationId: string, documentId: string): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/applications/${applicationId}/documents/${documentId}`
        );
    }

    getRecruiterJobsFromApi(): Observable<JobOffer[]> {
        return this.http.get<JobOffer[]>(`${this.apiUrl}/recruiter/jobs`);
    }

    getApplicationsForCandidate(candidateId: string): JobApplication[] {
        const result: JobApplication[] = [];
        for (const applications of this.jobApplications.values()) {
            for (const application of applications) {
                if (application.candidateId === candidateId) {
                    result.push({ ...application });
                }
            }
        }
        return result.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
    }

    filterJobs(filter: JobFilter): Observable<JobOffer[]> {
        return this.jobs$.pipe(
            map(jobs =>
                jobs.filter(job => {
                    if (job.status !== 'approved') {
                        return false;
                    }

                    const matchesSearch = filter.searchTerm
                        ? [
                            job.title,
                            job.company,
                            job.location,
                            job.description,
                            ...(job.tags ?? [])
                        ]
                            .join(' ')
                            .toLowerCase()
                            .includes(filter.searchTerm.toLowerCase())
                        : true;

                    const matchesType = !filter.type || filter.type === 'all' ? true : job.type === filter.type;
                    const matchesIndustry =
                        !filter.industry || filter.industry === 'all'
                            ? true
                            : job.industry.toLowerCase() === filter.industry.toLowerCase();
                    const matchesExperience =
                        !filter.experienceLevel || filter.experienceLevel === 'all'
                            ? true
                            : job.experienceLevel === filter.experienceLevel;

                    return matchesSearch && matchesType && matchesIndustry && matchesExperience;
                })
            )
        );
    }

    getPendingJobs(): JobOffer[] {
        return this.jobsSubject.value.filter(job => job.status === 'pending');
    }

    getPendingJobsFromApi(): Observable<JobOffer[]> {
        return this.http.get<JobOffer[]>(`${this.apiUrl}/jobs/pending`);
    }

    getRecruiterJobs(recruiterId: string): JobOffer[] {
        return this.jobsSubject.value.filter(job => job.createdBy === recruiterId);
    }

    getIndustries(): string[] {
        return Array.from(new Set(this.jobsSubject.value.map(job => job.industry))).sort((a, b) =>
            a.localeCompare(b)
        );
    }

    getIndustriesFromApi(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/industries`);
    }

    getTags(): string[] {
        return Array.from(new Set(this.jobsSubject.value.flatMap(job => job.tags ?? []))).sort((a, b) =>
            a.localeCompare(b)
        );
    }

    getTagsFromApi(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/tags`);
    }
}
