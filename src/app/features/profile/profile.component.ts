import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/interfaces/recipe/recipe.interface';
import { Observable } from 'rxjs';
import { User } from '../../core/interfaces/auth/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userRecipes: Recipe[] = [];
  likedRecipes: Recipe[] = [];
  isLoading = false;
  error: string | null = null;
  likedError: string | null = null;
  user$: Observable<User | undefined>;

  constructor(
    public authService: AuthService,
    private recipeService: RecipeService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.loadUserRecipes();
    this.loadLikedRecipes();
  }

  private loadUserRecipes(): void {
    this.isLoading = true;
    this.recipeService.getUserRecipes().subscribe({
      next: (recipes) => {
        this.userRecipes = recipes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user recipes:', err);
        this.error = 'Failed to load your recipes';
        this.isLoading = false;
      }
    });
  }

  private loadLikedRecipes(): void {
    this.recipeService.getLikedRecipes().subscribe({
      next: (recipes) => {
        this.likedRecipes = recipes;
      },
      error: (err) => {
        console.error('Error loading liked recipes:', err);
        this.likedError = 'Failed to load liked recipes';
      }
    });
  }
}