import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page container">
      <div class="auth-card card">
        <h1>Login</h1>
        
        <form (ngSubmit)="onSubmit()" *ngIf="!loading">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required />
          </div>

          <div class="error" *ngIf="error">{{ error }}</div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
        </form>

        <div class="loading" *ngIf="loading">Logging in...</div>

        <p class="auth-link">
          Don't have an account? <a routerLink="/register">Register</a>
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
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          // Redirect admin users directly to admin panel
          if (response.data.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.error = response.message || 'Login failed';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}

