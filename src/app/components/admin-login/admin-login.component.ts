import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
 password = '';
  error = '';

  constructor(private auth: AdminService, private router: Router) {}

  login() {
    this.auth.login(this.password).subscribe({
      next: () => this.router.navigate(['/blogs']),
      error: err => this.error = err.error?.message || 'Login failed'
    });
  }
}
