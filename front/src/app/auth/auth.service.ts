import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private adminStatus = new BehaviorSubject<boolean>(false);

  constructor() {
    const storedAdminStatus = localStorage.getItem('isAdmin');
    if (storedAdminStatus) {
      this.adminStatus.next(storedAdminStatus === 'true');
    }
  }

  login(email: string, password: string): Observable<boolean> {
    if (email === 'admin@admin.com' && password === 'admin123') {
      return of(true);
    } else if (email === 'user@user.com' && password === 'user123') {
      return of(true);
    }
    return of(false);
  }

  setAdminStatus(isAdmin: boolean): void {
    this.adminStatus.next(isAdmin);
    sessionStorage.setItem('isAdmin', isAdmin.toString());
  }

  getAdminStatus(): boolean {
    const adminStatus = sessionStorage.getItem('isAdmin');
    return adminStatus ? JSON.parse(adminStatus) : false;
  }
}
