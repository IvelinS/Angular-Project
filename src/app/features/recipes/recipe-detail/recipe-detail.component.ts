import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe } from '../../../core/interfaces/recipe/recipe.interface';
import { CommentSectionComponent } from './comment-section/comment-section.component';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CommentSectionComponent],
  template: `
    <div *ngIf="recipe" class="recipe-detail">
      <h2>{{ recipe.title }}</h2>
      
      <img [src]="recipe.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'" [alt]="recipe.title">
      
      <p class="description">{{ recipe.description }}</p>
      
      <p class="creator" *ngIf="recipe.creator">
        Created by: {{ recipe.creator.username }}
      </p>

      <div class="ingredients">
        <h3>Ingredients:</h3>
        <ul>
          <li *ngFor="let ingredient of recipe.ingredients">{{ ingredient }}</li>
        </ul>
      </div>

      <div class="instructions">
        <h3>Instructions:</h3>
        <ol>
          <li *ngFor="let instruction of recipe.instructions">{{ instruction }}</li>
        </ol>
      </div>

      <!-- Only show edit/delete buttons if user is the creator -->
      <div class="actions" *ngIf="recipe.creator?._id === currentUserId">
        <button (click)="onEdit()">Edit Recipe</button>
        <button (click)="onDelete()">Delete Recipe</button>
      </div>

      <button (click)="onLike()" *ngIf="userIsLoggedIn && (!recipe.creator || recipe.creator._id !== currentUserId)">
        {{ isLiked ? 'Unlike' : 'Like' }} Recipe
      </button>

      <div class="likes" *ngIf="recipe.likes">
        Likes: {{ recipe.likes.length }}
      </div>

      <app-comment-section 
        *ngIf="recipe" 
        [recipeId]="recipe._id">
      </app-comment-section>
    </div>

    <div *ngIf="error" class="error-message">
      {{ error }}
    </div>
  `,
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  error: string | null = null;
  currentUserId: string | null = null;
  userIsLoggedIn = false;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userIsLoggedIn = this.authService.isLoggedIn;
    this.currentUserId = this.authService.getUserId();
    this.loadRecipe();
  }

  get isLiked(): boolean {
    return this.recipe?.likes?.includes(this.currentUserId || '') || false;
  }

  private loadRecipe(): void {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (!recipeId) {
      this.error = 'Recipe ID not found';
      return;
    }

    this.recipeService.getRecipe(recipeId).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.error = null;
      },
      error: (err) => {
        console.error('Error loading recipe:', err);
        this.error = 'Failed to load recipe';
      }
    });
  }

  onEdit(): void {
    if (this.recipe) {
      this.router.navigate(['/recipes', this.recipe._id, 'edit']);
    }
  }

  onDelete(): void {
    if (!this.recipe) return;

    this.recipeService.deleteRecipe(this.recipe._id).subscribe({
      next: () => {
        this.router.navigate(['/recipes']);
      },
      error: (err) => {
        console.error('Error deleting recipe:', err);
        this.error = 'Failed to delete recipe';
      }
    });
  }

  onLike(): void {
    if (!this.recipe || !this.userIsLoggedIn) return;

    this.recipeService.likeRecipe(this.recipe._id).subscribe({
      next: (updatedRecipe) => {
        this.recipe = updatedRecipe;
        this.error = null;
      },
      error: (err) => {
        console.error('Error liking recipe:', err);
        this.error = 'Failed to like recipe';
      }
    });
  }
}
