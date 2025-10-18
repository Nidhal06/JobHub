import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobApplication } from '../models/application.model';
import { ExperienceLevel, JobFilter, JobOffer, JobStatus, JobType } from '../models/job.model';

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

const randomId = (prefix: string): string => {
    const fallback = Math.random().toString(16).slice(2, 10);
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${fallback}`;
};

@Injectable({ providedIn: 'root' })
export class JobService {
    private readonly initialJobs: JobOffer[] = [
        {
            id: 'job-1',
            title: 'Senior Frontend Engineer',
            company: 'FutureTech Labs',
            location: 'Tunis, Tunisia',
            salary: '35,000 - 45,000 TND/year',
            type: 'full-time',
            industry: 'Technology',
            experienceLevel: 'senior',
            status: 'approved',
            description:
                'Work closely with product and design teams to deliver high-quality web experiences for our SaaS platform.',
            requirements: [
                '7+ years of professional frontend experience',
                'Expert knowledge of Angular and TypeScript',
                'Experience with design systems and component libraries',
                'Strong understanding of accessibility and performance'
            ],
            responsibilities: [
                'Own complex frontend initiatives end-to-end',
                'Mentor engineers and enforce coding standards',
                'Collaborate with cross-functional partners',
                'Drive experimentation and data-informed UI improvements'
            ],
            createdAt: new Date().toISOString(),
            createdBy: 'recruiter-1',
            applications: 12,
            tags: ['Angular', 'Leadership']
        },
        {
            id: 'job-2',
            title: 'Product Designer',
            company: 'Orbit Commerce',
            location: 'Sfax, Tunisia',
            salary: '25,000 - 32,000 TND/year',
            type: 'full-time',
            industry: 'E-commerce',
            experienceLevel: 'mid',
            status: 'pending',
            description:
                'Design end-to-end experiences that help millions of merchants manage their digital storefronts.',
            requirements: [
                'Portfolio demonstrating shipped product work',
                'Comfortable with Figma and prototyping tools',
                'Experience collaborating with research and engineering',
                'Understanding of design systems'
            ],
            responsibilities: [
                'Translate insights into intuitive flows',
                'Maintain and evolve design system',
                'Run workshops with stakeholders',
                'Partner with engineers on implementation details'
            ],
            createdAt: new Date().toISOString(),
            createdBy: 'recruiter-2',
            applications: 7,
            tags: ['UX', 'UI']
        },
        {
            id: 'job-3',
            title: 'Data Analyst (Contract)',
            company: 'Insight Analytics',
            location: 'Sousse, Tunisia',
            salary: '30 - 35 TND/hour',
            type: 'contract',
            industry: 'Analytics',
            experienceLevel: 'mid',
            status: 'approved',
            description:
                'Enable data-informed decisions by building visualizations and uncovering actionable insights.',
            requirements: [
                'Strong SQL and dashboarding experience',
                'Comfort with Python or R',
                'Background in experimentation and A/B testing',
                'Excellent communication skills'
            ],
            responsibilities: [
                'Partner with product teams to define metrics',
                'Develop dashboards that support business objectives',
                'Maintain data quality through monitoring',
                'Support go-to-market reporting needs'
            ],
            createdAt: new Date().toISOString(),
            createdBy: 'recruiter-1',
            applications: 4,
            tags: ['SQL', 'Analytics']
        },
        {
            id: 'job-4',
            title: 'DevOps Engineer',
            company: 'CloudOps Solutions',
            location: 'Tunis, Tunisia',
            salary: '30,000 - 40,000 TND/year',
            type: 'full-time',
            industry: 'Cloud & Infrastructure',
            experienceLevel: 'senior',
            status: 'approved',
            description:
                'Build and maintain scalable cloud infrastructure while ensuring high availability and security.',
            requirements: [
                '3+ years of experience with AWS, Azure, or GCP',
                'Proficiency in CI/CD pipelines and automation tools',
                'Strong scripting skills (Python, Bash, etc.)',
                'Experience with monitoring and logging systems'
            ],
            responsibilities: [
                'Design and manage cloud architecture',
                'Automate deployments and infrastructure tasks',
                'Ensure system security and compliance',
                'Collaborate with development teams to optimize performance'
            ],
            createdAt: new Date().toISOString(),
            createdBy: 'recruiter-3',
            applications: 5,
            tags: ['DevOps', 'Cloud', 'Automation']
        }
    ];


    private readonly jobsSubject = new BehaviorSubject<JobOffer[]>([...this.initialJobs]);
    private readonly jobApplications = new Map<string, JobApplication[]>();

    get jobs$(): Observable<JobOffer[]> {
        return this.jobsSubject.asObservable();
    }

    getJobsSnapshot(): JobOffer[] {
        return [...this.jobsSubject.value];
    }

    createJob(payload: CreateJobRequest, recruiterId: string): JobOffer {
        const newJob: JobOffer = {
            ...payload,
            id: randomId('job'),
            status: 'pending',
            createdAt: new Date().toISOString(),
            createdBy: recruiterId,
            applications: 0
        };

        const updated = [newJob, ...this.jobsSubject.value];
        this.jobsSubject.next(updated);
        return newJob;
    }

    updateJobStatus(jobId: string, status: JobStatus, adminId: string): void {
        const updated = this.jobsSubject.value.map(job =>
            job.id === jobId ? { ...job, status, lastUpdatedBy: adminId } : job
        );
        this.jobsSubject.next(updated);
    }

    applyToJob(application: JobApplication): void {
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

    getApplicationsForRecruiter(recruiterId: string): JobApplication[] {
        const recruiterJobs = this.jobsSubject.value.filter(job => job.createdBy === recruiterId);
        return recruiterJobs.flatMap(job => this.getApplications(job.id));
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

    getRecruiterJobs(recruiterId: string): JobOffer[] {
        return this.jobsSubject.value.filter(job => job.createdBy === recruiterId);
    }

    getIndustries(): string[] {
        return Array.from(new Set(this.jobsSubject.value.map(job => job.industry))).sort((a, b) =>
            a.localeCompare(b)
        );
    }

    getTags(): string[] {
        return Array.from(new Set(this.jobsSubject.value.flatMap(job => job.tags ?? []))).sort((a, b) =>
            a.localeCompare(b)
        );
    }
}
