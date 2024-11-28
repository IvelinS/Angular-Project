import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginData, RegisterData } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$$ = new BehaviorSubject<User | undefined>(undefined);
  private user$ = this.user$$.asObservable();

  constructor(private http: HttpClient) { }

  get isLoggedIn(): boolean {
    return !!this.user$$.getValue();
  }

  get userData$(): Observable<User | undefined> {
    return this.user$;
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/register', data, { withCredentials: true })
      .pipe(tap((response) => this.user$$.next(response)));
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/login', data, { withCredentials: true })
      .pipe(tap((response) => this.user$$.next(response)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>('/api/logout', {}, { withCredentials: true })
      .pipe(tap(() => this.user$$.next(undefined)));
  }

  getProfile(): Observable<User> {
    return this.http
      .get<User>('/api/users/profile', { withCredentials: true })
      .pipe(tap((response) => this.user$$.next(response)));
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http
      .put<User>('/api/users/profile', data, { withCredentials: true })
      .pipe(tap((response) => this.user$$.next(response)));
  }
}