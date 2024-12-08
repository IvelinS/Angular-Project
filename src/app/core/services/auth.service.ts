import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$$ = new BehaviorSubject<any>(undefined);
  private user$ = this.user$$.asObservable();
  
  private authCheckComplete$$ = new ReplaySubject<boolean>(1);
  public authCheckComplete$ = this.authCheckComplete$$.asObservable();

  constructor(private http: HttpClient) {
    this.getProfile().subscribe({
      next: (user) => {
        this.user$$.next(user);
        this.authCheckComplete$$.next(true);
      },
      error: () => {
        this.user$$.next(null);
        this.authCheckComplete$$.next(true);
      }
    });
  }

  get isLoggedIn(): boolean {
    return !!this.user$$.value;
  }

  getUserId(): string | null {
    return this.user$$.value?._id || null;
  }

  getProfile() {
    return this.http.get<any>(`${environment.apiUrl}/users/profile`);
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/login`, { email, password })
      .pipe(tap(user => {
        this.user$$.next(user);
        this.authCheckComplete$$.next(true);
      }));
  }

  register(username: string, email: string, password: string, rePassword: string) {
    return this.http.post<any>(`${environment.apiUrl}/register`, { username, email, password, rePassword })
      .pipe(tap(user => {
        this.user$$.next(user);
        this.authCheckComplete$$.next(true);
      }));
  }

  logout() {
    return this.http.post<any>(`${environment.apiUrl}/logout`, {})
      .pipe(tap(() => {
        this.user$$.next(null);
        this.authCheckComplete$$.next(true);
      }));
  }

  getUser(): Observable<any> {
    return this.user$;
  }
}