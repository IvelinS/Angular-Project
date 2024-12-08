import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../core/services/recipe.service';
import { Recipe } from '../../../core/interfaces/recipe/recipe.interface';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="recipes-container">
      <h2>Browse Recipes</h2>
      
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div class="recipes-grid">
        <div *ngFor="let recipe of recipes" class="recipe-card">
          <img [src]="recipe.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'" [alt]="recipe.title">
          <div class="recipe-info">
            <h3>{{ recipe.title }}</h3>
            <p>{{ recipe.description }}</p>
            <a [routerLink]="['/recipes', recipe._id]" class="view-recipe">View Recipe</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  error: string | null = null;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadRecipes();
  }

  private loadRecipes(): void {
    console.log('Loading recipes...');
    this.recipeService.getRecipes().subscribe({
      next: (recipes: Recipe[]) => {
        console.log('Recipes received:', recipes);
        if (recipes.length === 0) {
          console.log('No recipes found, seeding...');
          this.seedRecipes();
        } else {
          this.recipes = recipes;
          this.error = null;
        }
      },
      error: (err: Error) => {
        console.error('Loading recipes failed:', err);
        this.error = 'Failed to load recipes';
      }
    });
  }

  private seedRecipes(): void {
    console.log('Starting seed process...');
    this.recipeService.seedRecipes().subscribe({
      next: (recipes: Recipe[]) => {
        console.log('Seeds added:', recipes);
        this.recipes = recipes;
        this.error = null;
      },
      error: (err: Error) => {
        console.error('Seeding failed:', err);
        this.error = 'Failed to load recipes';
      }
    });
  }
}