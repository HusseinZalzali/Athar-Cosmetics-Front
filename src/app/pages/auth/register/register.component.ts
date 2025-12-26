import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page container">
      <div class="auth-card card">
        <h1>{{ currentLang === 'ar' ? 'إنشاء حساب' : 'Register' }}</h1>
        
        <form (ngSubmit)="onSubmit()" *ngIf="!loading">
          <div class="form-group">
            <label>{{ currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name' }}</label>
            <input type="text" [(ngModel)]="name" name="name" required />
          </div>

          <div class="form-group">
            <label>{{ currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email' }}</label>
            <input type="email" [(ngModel)]="email" name="email" required />
          </div>

          <div class="form-group">
            <label>{{ currentLang === 'ar' ? 'كلمة المرور' : 'Password' }}</label>
            <input type="password" [(ngModel)]="password" name="password" required />
          </div>

          <div class="error" *ngIf="error">{{ error }}</div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">
            {{ currentLang === 'ar' ? 'إنشاء حساب' : 'Register' }}
          </button>
        </form>

        <div class="loading" *ngIf="loading">
          {{ currentLang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...' }}
        </div>

        <p class="auth-link">
          {{ currentLang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?' }}
          <a routerLink="/login">{{ currentLang === 'ar' ? 'تسجيل الدخول' : 'Login' }}</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      padding: 4rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
    }

    .auth-card {
      max-width: 400px;
      width: 100%;
      padding: 2rem;

      h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: var(--accent);
      }

      .auth-link {
        text-align: center;
        margin-top: 1.5rem;
        color: var(--text-secondary);
      }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .auth-page {
        padding: 2rem 0;
        min-height: calc(100vh - 150px);
      }

      .auth-card {
        padding: 1.5rem;
        margin: 0 1rem;
      }
    }

    @media (max-width: 480px) {
      .auth-page {
        padding: 1.5rem 0;
      }

      .auth-card {
        padding: 1.25rem;
        margin: 0 0.5rem;

        h1 {
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
        }
      }
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  error = '';
  currentLang = 'en';

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.error = response.message || 'Registration failed';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}

