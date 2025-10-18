import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserNotification } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly streams = new Map<string, BehaviorSubject<UserNotification[]>>();

    seed(userId: string, notifications: UserNotification[]): void {
        const existing = this.streams.get(userId) ?? new BehaviorSubject<UserNotification[]>([]);
        existing.next([...notifications]);
        this.streams.set(userId, existing);
    }

    getNotifications(userId: string): Observable<UserNotification[]> {
        return this.getStream(userId).asObservable();
    }

    getUnreadCount(userId: string): Observable<number> {
        return this.getNotifications(userId).pipe(
            map(list => list.filter(notification => !notification.read).length)
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
    }

    markAsRead(userId: string, notificationId: string): void {
        const stream = this.getStream(userId);
        stream.next(
            stream.value.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            )
        );
    }

    markAllAsRead(userId: string): void {
        const stream = this.getStream(userId);
        stream.next(stream.value.map(notification => ({ ...notification, read: true })));
    }

    private getStream(userId: string): BehaviorSubject<UserNotification[]> {
        if (!this.streams.has(userId)) {
            this.streams.set(userId, new BehaviorSubject<UserNotification[]>([]));
        }
        return this.streams.get(userId)!;
    }
}
