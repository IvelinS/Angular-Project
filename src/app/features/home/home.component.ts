import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <h1>Welcome to Recipe Sharing</h1>
      <p>Discover and share your favorite recipes with our community</p>
      
      <div class="cta-buttons">
        <a routerLink="/recipes" class="cta-button">Browse Recipes</a>
        <a *ngIf="!authService.isLoggedIn" routerLink="/login" class="cta-button secondary">Login to Share</a>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
