import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { UserNotification } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly apiUrl = 'http://localhost:8081/api';
    private readonly streams = new Map<string, BehaviorSubject<UserNotification[]>>();

    constructor(private http: HttpClient) {}

    seed(userId: string, notifications: UserNotification[]): void {
        const existing = this.streams.get(userId) ?? new BehaviorSubject<UserNotification[]>([]);
        existing.next([...notifications]);
        this.streams.set(userId, existing);
    }

    getNotifications(userId: string): Observable<UserNotification[]> {
        return this.getStream(userId).asObservable();
    }

    loadNotificationsFromApi(): Observable<UserNotification[]> {
        return this.http.get<UserNotification[]>(`${this.apiUrl}/notifications`);
    }

    getUnreadCount(userId: string): Observable<number> {
        return this.getNotifications(userId).pipe(
            map(list => list.filter(notification => !notification.read).length)
        );
    }

    getUnreadCountFromApi(): Observable<number> {
        return this.http.get<{ count: number }>(`${this.apiUrl}/notifications/unread-count`).pipe(
            map(response => response.count),
            catchError(() => of(0))
        );
    }

    push(userId: string, notification: Omit<UserNotification, 'id' | 'createdAt' | 'read'>): void {
        const entry: UserNotification = {
            ...notification,
            id: `notif-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            read: false
        };

        const stream = this.getStream(userId);
        stream.next([entry, ...stream.value]);

        // Also save to API
        this.http.post<UserNotification>(`${this.apiUrl}/notifications`, notification).subscribe();
    }

    markAsRead(userId: string, notificationId: string): void {
        const stream = this.getStream(userId);
        stream.next(
            stream.value.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            )
        );

        this.http.patch(`${this.apiUrl}/notifications/${notificationId}/read`, {}).subscribe();
    }

    markAllAsRead(userId: string): void {
        const stream = this.getStream(userId);
        stream.next(stream.value.map(notification => ({ ...notification, read: true })));

        this.http.patch(`${this.apiUrl}/notifications/read-all`, {}).subscribe();
    }

    private getStream(userId: string): BehaviorSubject<UserNotification[]> {
        if (!this.streams.has(userId)) {
            this.streams.set(userId, new BehaviorSubject<UserNotification[]>([]));
        }
        return this.streams.get(userId)!;
    }
}
