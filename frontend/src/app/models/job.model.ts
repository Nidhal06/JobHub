import { UserProfile } from './user.model';

export type JobStatus = 'pending' | 'approved' | 'denied' | 'draft';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';

export interface JobOffer {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: JobType;
    industry: string;
    experienceLevel: ExperienceLevel;
    status: JobStatus;
    description: string;
    requirements: string[];
    responsibilities: string[];
    createdAt: string;
    createdBy: string;
    applications: number;
    lastUpdatedBy?: string;
    tags?: string[];
}

export interface JobFilter {
    searchTerm?: string;
    type?: JobType | 'all';
    industry?: string | 'all';
    experienceLevel?: ExperienceLevel | 'all';
    status?: JobStatus | 'all';
}

export interface RecruiterProfile extends UserProfile {
    company: string;
    website?: string;
    hiringSince?: string;
}
