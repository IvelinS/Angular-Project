import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe.service';
import { Recipe } from '../../../core/interfaces/recipe/recipe.interface';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  isLoading = false;
  error: string | null = null;
  currentUserId = 'current-user-id'; // TODO update this later
  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.error = null;
    
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
        this.error = 'Failed to load recipes. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  likeRecipe(id: string): void {
    this.recipeService.likeRecipe(id).subscribe({
      next: (updatedRecipe) => {
        this.recipes = this.recipes.map(recipe => 
          recipe._id === updatedRecipe._id ? updatedRecipe : recipe
        );
      },
      error: (err) => {
        console.error('Error liking recipe:', err);
      }
    });
  }

  deleteRecipe(id: string): void {
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => {
        this.recipes = this.recipes.filter(recipe => recipe._id !== id);
      },
      error: (err) => {
        console.error('Error deleting recipe:', err);
      }
    });
  }

  isCreator(recipe: Recipe): boolean {
    return recipe.creator._id === this.currentUserId;
  }
}