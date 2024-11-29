import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { User, AuthResponse, LoginData, RegisterData } from '../interfaces/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$$ = new BehaviorSubject<User | undefined>(undefined);
  public user$ = this.user$$.asObservable();
  private authCheckComplete$$ = new BehaviorSubject<boolean>(false);
  public authCheckComplete$ = this.authCheckComplete$$.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.authCheckComplete$$.next(false);
    
    this.getProfile().pipe(
      catchError(error => {
        console.error('Auth check failed:', error);
        return of(undefined);
      })
    ).subscribe({
      next: (user) => {
        this.user$$.next(user);
        this.authCheckComplete$$.next(true);
      },
      error: () => {
        this.user$$.next(undefined);
        this.authCheckComplete$$.next(true);
      }
    });
  }

  get isLoggedIn(): boolean {
    return !!this.user$$.getValue();
  }

  get userData$(): Observable<User | undefined> {
    return this.user$;
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/register`, data, { withCredentials: true })
      .pipe(tap((response) => this.user$$.next(response)));
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/login`, data, { withCredentials: true })
      .pipe(tap((response) => this.user$$.next(response)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.user$$.next(undefined)));
  }

  getProfile(): Observable<User> {
    return this.http
      .get<User>(`${environment.apiUrl}/users/profile`, { withCredentials: true })
      .pipe(tap((response) => this.user$$.next(response)));
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http
      .put<User>(`${environment.apiUrl}/users/profile`, data, { withCredentials: true })
      .pipe(tap((response) => this.user$$.next(response)));
  }
}