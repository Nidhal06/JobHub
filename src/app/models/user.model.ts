export type UserRole = 'admin' | 'recruiter' | 'seeker';

export interface UserNotification {
    id: string;
    message: string;
    createdAt: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'alert';
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    password: string;
    company?: string;
    title?: string;
    avatarUrl?: string;
    bio?: string;
}
