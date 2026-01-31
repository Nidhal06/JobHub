import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    errorMessage = '';
    loading = false;
    readonly demoAccounts = this.authService.getDemoUsers();
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                if (user) {
                    this.navigateAfterLogin(user);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    submit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const { email, password } = this.loginForm.value;
        this.authService.login(email, password).subscribe(user => {
            this.loading = false;
            if (!user) {
                this.errorMessage = 'Incorrect email or password. Try a demo account below.';
                return;
            }

            this.errorMessage = '';
            this.navigateAfterLogin(user);
        });
    }

    useDemo(account: UserProfile): void {
        this.loginForm.setValue({ email: account.email, password: account.password });
        this.submit();
    }

    get controls() {
        return this.loginForm.controls;
    }

    private navigateAfterLogin(user: UserProfile): void {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
            return;
        }

        const roleRoutes = this.authService.mapRolesToRoutes();
        this.router.navigateByUrl(roleRoutes[user.role] ?? '/jobs');
    }
}
