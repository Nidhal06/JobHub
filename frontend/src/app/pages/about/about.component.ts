import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    readonly values = [
        {
            title: 'Candidate-first Experiences',
            description:
                'Every interaction empowers job seekers to tell their story and find meaningful opportunities.',
            icon: 'bi bi-person-heart'
        },
        {
            title: 'Data-driven Hiring',
            description:
                'Analytics surface the best-fit talent so teams can make confident, equitable decisions.',
            icon: 'bi bi-graph-up-arrow'
        },
        {
            title: 'Trusted Collaboration',
            description:
                'Shared workspaces, alerts, and permissions keep hiring teams connected and accountable.',
            icon: 'bi bi-people'
        }
    ];
}
