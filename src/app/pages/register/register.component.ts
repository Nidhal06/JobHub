import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, startWith, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

type RegistrationRole = 'recruiter' | 'seeker';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
    registrationForm: FormGroup;
    loading = false;
    errorMessage = '';

    private readonly destroy$ = new Subject<void>();
    private readonly passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        if (!password || !confirmPassword) {
            return null;
        }
        return password === confirmPassword ? null : { passwordMismatch: true };
    };

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
        this.registrationForm = this.fb.group(
            {
                role: ['seeker', Validators.required],
                name: ['', [Validators.required, Validators.minLength(2)]],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', Validators.required],
                company: [''],
                title: ['']
            },
            { validators: this.passwordMatchValidator }
        );

        this.registrationForm
            .get('role')
            ?.valueChanges.pipe(startWith(this.registrationForm.get('role')?.value), takeUntil(this.destroy$))
            .subscribe(role => this.applyRoleValidators((role as RegistrationRole) ?? 'seeker'));

        this.applyRoleValidators((this.registrationForm.get('role')?.value as RegistrationRole) ?? 'seeker');
    }

    get controls() {
        return this.registrationForm.controls;
    }

    get passwordMismatch(): boolean {
        return this.registrationForm.hasError('passwordMismatch');
    }

    submit(): void {
        if (this.registrationForm.invalid || this.passwordMismatch) {
            this.registrationForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        const role = this.controls['role'].value as RegistrationRole;

        this.authService
            .register({
                role,
                name: this.controls['name'].value,
                email: this.controls['email'].value,
                password: this.controls['password'].value,
                company: this.controls['company'].value,
                title: this.controls['title'].value
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: user => {
                    this.loading = false;
                    const redirectMap = this.authService.mapRolesToRoutes();
                    const destination = redirectMap[user.role] ?? '/jobs';
                    this.router.navigateByUrl(destination);
                },
                error: err => {
                    this.loading = false;
                    this.errorMessage = err?.message ?? 'Unable to complete registration. Please try again.';
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private applyRoleValidators(role: RegistrationRole): void {
        const companyControl = this.registrationForm.get('company');
        const titleControl = this.registrationForm.get('title');

        if (!companyControl || !titleControl) {
            return;
        }

        if (role === 'recruiter') {
            companyControl.setValidators([Validators.required, Validators.minLength(2)]);
            titleControl.setValidators([Validators.minLength(2)]);
        } else {
            companyControl.setValidators([Validators.minLength(2)]);
            titleControl.setValidators([Validators.required, Validators.minLength(2)]);
        }

        companyControl.updateValueAndValidity({ emitEvent: false });
        titleControl.updateValueAndValidity({ emitEvent: false });
    }
}
