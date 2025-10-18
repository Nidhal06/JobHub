import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UserProfile, UserRole } from '../models/user.model';

type RegistrationRole = Extract<UserRole, 'recruiter' | 'seeker'>;

interface RegistrationPayload {
    role: RegistrationRole;
    name: string;
    email: string;
    password: string;
    company?: string;
    title?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly currentUserSubject = new BehaviorSubject<UserProfile | null>(null);

    private readonly seedUsers: UserProfile[] = [
        {
            id: 'admin-1',
            name: 'Nidhal Gharbi',
            email: 'admin@jobhub.com',
            password: 'DemoAdmin123',
            role: 'admin',
            title: 'Platform Administrator'
        },
        {
            id: 'recruiter-1',
            name: 'RH Manager',
            email: 'recruiter@jobhub.com',
            password: 'DemoRecruiter123',
            role: 'recruiter',
            company: 'FutureTech Labs',
            title: 'Lead Recruiter'
        },
        {
            id: 'seeker-1',
            name: 'User Seeker',
            email: 'seeker@jobhub.com',
            password: 'DemoSeeker123',
            role: 'seeker',
            title: 'Product Designer'
        }
    ];

    private users: UserProfile[] = [...this.seedUsers];

    get currentUser$(): Observable<UserProfile | null> {
        return this.currentUserSubject.asObservable();
    }

    get currentUser(): UserProfile | null {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string): Observable<UserProfile | null> {
        const user = this.users.find(
            profile => profile.email.toLowerCase() === email.toLowerCase() && profile.password === password
        );

        this.currentUserSubject.next(user ?? null);
        return of(user ?? null).pipe(delay(400));
    }

    logout(): void {
        this.currentUserSubject.next(null);
    }

    hasRole(role: UserRole): boolean {
        return this.currentUser?.role === role;
    }

    isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }

    getDemoUsers(): UserProfile[] {
        return this.seedUsers;
    }

    impersonate(role: UserRole): void {
        const user = this.users.find(profile => profile.role === role) ?? null;
        this.currentUserSubject.next(user);
    }

    register(payload: RegistrationPayload): Observable<UserProfile> {
        const normalizedEmail = payload.email.trim().toLowerCase();
        if (this.users.some(user => user.email.toLowerCase() === normalizedEmail)) {
            return throwError(() => new Error('An account with this email already exists.'));
        }

        if (payload.role === 'recruiter' && !payload.company?.trim()) {
            return throwError(() => new Error('Company is required for recruiter accounts.'));
        }

        if (payload.role === 'seeker' && !payload.title?.trim()) {
            return throwError(() => new Error('Role or headline is required for seeker accounts.'));
        }

        const newUser: UserProfile = {
            id: this.generateId(payload.role),
            name: payload.name.trim(),
            email: payload.email.trim(),
            password: payload.password,
            role: payload.role,
            company: payload.company?.trim() || undefined,
            title: payload.title?.trim() || undefined
        };

        this.users = [...this.users, newUser];
        this.currentUserSubject.next(newUser);

        return of(newUser).pipe(delay(400));
    }

    private generateId(role: UserRole): string {
        return `${role}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    }

    mapRolesToRoutes(): Record<UserRole, string> {
        return {
            admin: '/dashboard/admin',
            recruiter: '/dashboard/recruiter',
            seeker: '/dashboard/seeker'
        };
    }

    getUserDisplayName(): string {
        return this.currentUser?.name ?? 'Guest';
    }
}
