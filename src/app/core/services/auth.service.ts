import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/auth/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$$ = new BehaviorSubject<any>(null);
  
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

  getProfile(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/profile`, 
      { withCredentials: true }
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/login`, 
      { email, password }, 
      { 
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(user => {
        this.user$$.next(user);
      })
    );
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

  get user(): Observable<User | null> {
    return this.user$$.asObservable();
  }

  getUser(): Observable<User | null> {
    return this.user$$.asObservable();
  }

  getUsername(): string {
    const user = this.user$$.getValue();
    return user ? user.username : '';
  }
}