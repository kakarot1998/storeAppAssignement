import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  template: `
    <form #loginForm="ngForm" (ngSubmit)="onSubmit()">
      <div class="form-field">
        <label for="email">Email</label>
        <input
          pInputText
          type="email"
          id="email"
          name="email"
          [(ngModel)]="loginData.email"
          #email="ngModel"
          required
          [ngModelOptions]="{ updateOn: 'blur' }"
          email
        />
        <div *ngIf="email.invalid && email.touched" class="error-message">
          L'email est obligatoire et doit être valide.
        </div>
      </div>

      <div class="form-field">
        <label for="password">Password</label>
        <input
          pInputText
          type="password"
          id="password"
          name="password"
          [(ngModel)]="loginData.password"
          required
          minlength="6"
          #password="ngModel"
        />
        <div *ngIf="password.invalid && password.touched" class="error-message">
          Le mot de passe est obligatoire et doit faire au moins 6 caractères.
        </div>
      </div>

      <div class="flex justify-content-between">
        <p-button type="button" (click)="onCancel()" label="Annuler" severity="help" />
        <p-button
          type="submit"
          [disabled]="loginForm.invalid"
          label="Se connecter"
          severity="success"
        />
      </div>
    </form>
  `,
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule],
})
export class LoginComponent {
  loginData = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onCancel() {
    this.loginData = { email: '', password: '' };
  }

  ngOnInit(): void {
    const isLoggedIn = sessionStorage.getItem('token');
    if (isLoggedIn) {
      this.router.navigate(['/products']);
    }
  }

  onSubmit(): void {
    if (this.loginData.email && this.loginData.password) {
      console.log('Login details:', this.loginData);

      this.authService.login(this.loginData.email, this.loginData.password).subscribe((isAuthenticated: boolean) => {
          if (this.loginData.email === 'admin@admin.com') {
            this.authService.setAdminStatus(true);
            this.router.navigate(['/products']);
          } else {
            this.authService.setAdminStatus(false);
            this.router.navigate(['/products']);
          }
      });
    }
  }
}
