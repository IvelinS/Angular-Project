import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/interfaces/recipe/recipe.interface';
import { Observable } from 'rxjs';
import { User } from '../../core/interfaces/auth/user.interface';
import { filter, take } from 'rxjs/operators';

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
  isLoadingLiked = false;
  error: string | null = null;
  likedError: string | null = null;
  user$: Observable<User | null>;

  constructor(
    public authService: AuthService,
    private recipeService: RecipeService
  ) {
    this.user$ = this.authService.user;
  }

  ngOnInit(): void {
    this.authService.authCheckComplete$.pipe(
      filter(complete => complete),
      take(1)
    ).subscribe(() => {
      this.loadUserRecipes();
      this.loadLikedRecipes();
    });
  }

  private loadUserRecipes(): void {
    this.isLoading = true;
    console.log('Loading user recipes...');
    
    this.recipeService.getUserRecipes().subscribe({
      next: (recipes) => {
        console.log('Received user recipes:', recipes);
        this.userRecipes = recipes;
        this.isLoading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error loading user recipes:', err);
        this.error = 'Failed to load your recipes';
        this.isLoading = false;
        this.userRecipes = [];
      }
    });
  }

  private loadLikedRecipes(): void {
    this.isLoadingLiked = true;
    console.log('Loading liked recipes...');

    this.recipeService.getLikedRecipes().subscribe({
      next: (recipes) => {
        console.log('Received liked recipes:', recipes);
        this.likedRecipes = recipes;
        this.isLoadingLiked = false;
        this.likedError = null;
      },
      error: (err) => {
        console.error('Error loading liked recipes:', err);
        this.likedError = 'Failed to load liked recipes';
        this.isLoadingLiked = false;
        this.likedRecipes = [];
      }
    });
  }
}