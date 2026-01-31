export interface JobApplication {
    id: string;
    jobId: string;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    linkedinUrl?: string;
    githubUrl?: string;
    coverLetter: string;
    submittedAt: string;
    status: 'received' | 'reviewed' | 'shortlisted' | 'rejected';
    attachments: UploadedDocument[];
}

export interface UploadedDocument {
    id: string;
    name: string;
    size: number;
    type: string;
    content?: string; // Base64 encoded file content
}
