import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    readonly highlights = [
        {
            title: 'Find the right role',
            description:
                'Browse curated opportunities with powerful filters that surface the jobs that suit your skills and ambitions.'
        },
        {
            title: 'Hire with confidence',
            description:
                'Recruiters manage pipelines effortlessly, post new openings in minutes, and track every candidate interaction.'
        },
        {
            title: 'Stay in the loop',
            description:
                'Real-time notifications keep seekers and hiring teams aligned from application to offer.'
        }
    ];

    readonly seekerBenefits = [
        'Save favorite roles, follow companies, and receive tailored alerts.',
        'Craft standout applications with guided prompts and attachment tracking.',
        'Monitor every stage of the hiring journey from a single dashboard.'
    ];

    readonly recruiterBenefits = [
        'Publish polished job posts with reusable templates in minutes.',
        'Collaborate with hiring managers using shared notes and scorecards.',
        'Automate candidate nudges and keep pipelines moving efficiently.'
    ];

    readonly steps = [
        {
            title: 'Discover',
            description:
                'Use smart filters to uncover roles and candidates matched to skills, goals, and availability.'
        },
        {
            title: 'Engage',
            description:
                'Message, schedule, and share feedback without leaving JobHub so everyone stays aligned.'
        },
        {
            title: 'Decide',
            description:
                'Track offers, approvals, and analytics that spotlight the best hiring outcomes for your team.'
        }
    ];

    readonly stats = [
        { value: '4K+', label: 'Matches made between seekers and teams' },
        { value: '2x', label: 'Faster hiring cycle after adoption' },
        { value: '94%', label: 'Candidate satisfaction with the experience' },
        { value: '40+', label: 'Industries represented on JobHub' }
    ];

    readonly testimonials = [
        {
            quote:
                'JobHub gives us every signal we need to make confident decisions. Our hiring process finally feels collaborative.',
            name: 'Ines Ben Amor',
            title: 'Head of Talent, NovaWare'
        },
        {
            quote:
                'Applying is effortless and transparent. I can see where I stand at all times, which is a game changer.',
            name: 'Omar Trabelsi',
            title: 'Product Designer'
        }
    ];
}
