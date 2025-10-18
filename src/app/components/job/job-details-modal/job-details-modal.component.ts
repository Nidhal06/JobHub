import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobOffer } from '../../../models/job.model';
import { UploadedDocument } from '../../../models/application.model';

export interface ApplicationPayload {
    candidateName: string;
    candidateEmail: string;
    coverLetter: string;
    attachments: UploadedDocument[];
    linkedinUrl?: string;
    githubUrl?: string;
}

@Component({
    selector: 'app-job-details-modal',
    templateUrl: './job-details-modal.component.html',
    styleUrls: ['./job-details-modal.component.scss']
})
export class JobDetailsModalComponent implements OnChanges {
    @Input() job: JobOffer | null = null;
    @Input() visible = false;
    @Output() dismissed = new EventEmitter<void>();
    @Output() submitApplication = new EventEmitter<ApplicationPayload>();

    private readonly urlPattern = /^https?:\/\/.+/i;
    applicationForm: FormGroup = this.fb.group({
        candidateName: ['', [Validators.required, Validators.minLength(2)]],
        candidateEmail: ['', [Validators.required, Validators.email]],
        linkedinUrl: ['', [Validators.pattern(this.urlPattern)]],
        githubUrl: ['', [Validators.pattern(this.urlPattern)]],
        coverLetter: ['', [Validators.required, Validators.minLength(50)]],
        attachments: [[] as UploadedDocument[]]
    });

    uploadedDocuments: UploadedDocument[] = [];
    submitting = false;

    constructor(private readonly fb: FormBuilder) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && !this.visible) {
            this.resetForm();
        }

        if (changes['job'] && this.job) {
            this.prefillForDemo();
        }
    }

    get controls() {
        return this.applicationForm.controls;
    }

    handleFileSelection(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) {
            return;
        }

        const files = Array.from(input.files).slice(0, 5);
        this.uploadedDocuments = files.map(file => ({
            id: `doc-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream'
        }));

        this.applicationForm.patchValue({ attachments: this.uploadedDocuments });
        input.value = '';
    }

    removeDocument(documentId: string): void {
        this.uploadedDocuments = this.uploadedDocuments.filter(doc => doc.id !== documentId);
        this.applicationForm.patchValue({ attachments: this.uploadedDocuments });
    }

    submit(): void {
        if (!this.job) {
            return;
        }

        if (this.applicationForm.invalid) {
            this.applicationForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const payload: ApplicationPayload = {
            candidateName: this.controls['candidateName'].value,
            candidateEmail: this.controls['candidateEmail'].value,
            coverLetter: this.controls['coverLetter'].value,
            attachments: this.uploadedDocuments,
            linkedinUrl: this.controls['linkedinUrl'].value?.trim() || undefined,
            githubUrl: this.controls['githubUrl'].value?.trim() || undefined
        };

        this.submitApplication.emit(payload);
        this.submitting = false;
        this.resetForm();
    }

    dismiss(): void {
        this.resetForm();
        this.dismissed.emit();
    }

    private resetForm(): void {
        this.applicationForm.reset();
        this.uploadedDocuments = [];
        this.submitting = false;
    }

    private prefillForDemo(): void {
        this.applicationForm.patchValue({
            candidateName: '',
            candidateEmail: '',
            linkedinUrl: '',
            githubUrl: '',
            coverLetter: ''
        });
    }
}
