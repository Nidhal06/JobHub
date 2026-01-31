import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserProfile, UserRole } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

type RegistrationRole = Extract<UserRole, 'recruiter' | 'seeker'>;

interface RegistrationPayload {
    role: RegistrationRole;
    name: string;
    email: string;
    password: string;
    company?: string;
    title?: string;
}

interface AuthResponse {
    token: string;
    user: UserProfile;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = 'http://localhost:8081/api';
    private readonly currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
    private readonly TOKEN_KEY = 'jobhub_token';

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

    constructor(private http: HttpClient) {
        this.loadUserFromToken();
    }

    private loadUserFromToken(): void {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (token) {
            this.http.get<UserProfile>(`${this.apiUrl}/auth/me`).subscribe({
                next: (user) => this.currentUserSubject.next(user),
                error: () => {
                    localStorage.removeItem(this.TOKEN_KEY);
                    this.currentUserSubject.next(null);
                }
            });
        }
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    get currentUser$(): Observable<UserProfile | null> {
        return this.currentUserSubject.asObservable();
    }

    get currentUser(): UserProfile | null {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string): Observable<UserProfile | null> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
            tap(response => {
                localStorage.setItem(this.TOKEN_KEY, response.token);
                this.currentUserSubject.next(response.user);
            }),
            map(response => response.user),
            catchError(error => {
                console.error('Login error:', error);
                return throwError(() => new Error(error.error?.message || 'Invalid email or password'));
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
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
        const user = this.seedUsers.find(profile => profile.role === role) ?? null;
        if (user) {
            this.login(user.email, user.password).subscribe();
        }
    }

    register(payload: RegistrationPayload): Observable<UserProfile> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload).pipe(
            tap(response => {
                localStorage.setItem(this.TOKEN_KEY, response.token);
                this.currentUserSubject.next(response.user);
            }),
            map(response => response.user),
            catchError(error => {
                console.error('Registration error:', error);
                return throwError(() => new Error(error.error?.message || 'Registration failed'));
            })
        );
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
