import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, switchMap, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.authCheckComplete$.pipe(
    filter(complete => complete),
    take(1),
    switchMap(() => authService.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          router.navigate(['/login'], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }
      })
    ))
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.authCheckComplete$.pipe(
    filter(complete => complete),
    take(1),
    switchMap(() => authService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return true;
        } else {
          router.navigate(['/']);
          return false;
        }
      })
    ))
  );
};