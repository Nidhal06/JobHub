import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const allowedRoles: UserRole[] = route.data['roles'] ?? [];
        const user = this.authService.currentUser;

        if (!user) {
            return this.router.createUrlTree(['/login'], {
                queryParams: { returnUrl: state.url }
            });
        }

        if (!allowedRoles.length || allowedRoles.includes(user.role)) {
            return true;
        }

        const redirect = this.authService.mapRolesToRoutes()[user.role] ?? '/jobs';
        return this.router.parseUrl(redirect);
    }
}
