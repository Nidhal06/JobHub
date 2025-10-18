import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JobOffer } from '../../../models/job.model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-job-card',
    templateUrl: './job-card.component.html',
    styleUrls: ['./job-card.component.scss'],
})
export class JobCardComponent {
    @Input() job!: JobOffer;
    @Output() viewDetails = new EventEmitter<JobOffer>();
    constructor(private authService: AuthService, private router: Router) { }

    openDetails(): void {
        if (this.authService.isLoggedIn()) {
            this.viewDetails.emit(this.job);
        } else {
            this.router.navigate(['/login']);
        }
    }
}
