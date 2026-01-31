import { Component } from '@angular/core';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
    readonly supportChannels = [
        {
            label: 'Customer Support',
            detail: 'support@jobhub.com',
            icon: 'bi bi-headset'
        },
        {
            label: 'Sales Team',
            detail: 'sales@jobhub.com',
            icon: 'bi bi-briefcase'
        },
        {
            label: 'Media & Partnerships',
            detail: 'press@jobhub.com',
            icon: 'bi bi-megaphone'
        }
    ];

    onSubmit() {
        alert('✅ Your message has been sent! We’ll get back to you soon.');
    }
}
