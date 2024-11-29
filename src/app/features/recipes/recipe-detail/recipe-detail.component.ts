import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe } from '../../../core/interfaces/recipe/recipe.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  isLoading = false;
  error: string | null = null;
  isCreator = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRecipe();
  }

  loadRecipe(): void {
    this.isLoading = true;
    this.error = null;

    this.route.params.pipe(
      switchMap(params => this.recipeService.getRecipe(params['id'])),
      tap(recipe => {
        this.authService.user$.subscribe(user => {
          this.isCreator = user?._id === recipe.creator._id;
        });
      })
    ).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading recipe:', err);
        this.error = 'Failed to load recipe. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onDelete(): void {
    if (!this.recipe || !confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    this.recipeService.deleteRecipe(this.recipe._id).subscribe({
      next: () => {
        this.router.navigate(['/recipes']);
      },
      error: (err) => {
        console.error('Error deleting recipe:', err);
        this.error = 'Failed to delete recipe. Please try again later.';
      }
    });
  }

  onLike(): void {
    if (!this.recipe) return;

    this.recipeService.likeRecipe(this.recipe._id).subscribe({
      next: (updatedRecipe) => {
        this.recipe = updatedRecipe;
      },
      error: (err) => {
        console.error('Error liking recipe:', err);
        this.error = 'Failed to like recipe. Please try again later.';
      }
    });
  }
}
