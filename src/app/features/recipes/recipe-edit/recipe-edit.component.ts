import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe.service';
import { Recipe } from '../../../core/interfaces/recipe/recipe.interface';

@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit {
  recipeForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  recipeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: [''],
      ingredients: this.fb.array([]),
      instructions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recipeId = params['id'];
      this.loadRecipe();
    });
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.fb.control('', Validators.required));
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  addInstruction(): void {
    this.instructions.push(this.fb.control('', Validators.required));
  }

  removeInstruction(index: number): void {
    this.instructions.removeAt(index);
  }

  loadRecipe(): void {
    if (!this.recipeId) return;

    this.isLoading = true;
    this.recipeService.getRecipe(this.recipeId).subscribe({
      next: (recipe) => {
        this.patchFormValues(recipe);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading recipe:', err);
        this.error = 'Failed to load recipe. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private patchFormValues(recipe: Recipe): void {
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl
    });


    while (this.ingredients.length) {
      this.ingredients.removeAt(0);
    }
    recipe.ingredients.forEach(ingredient => {
      this.ingredients.push(this.fb.control(ingredient));
    });

    while (this.instructions.length) {
      this.instructions.removeAt(0);
    }
    recipe.instructions.forEach(instruction => {
      this.instructions.push(this.fb.control(instruction));
    });
  }

  onSubmit(): void {
    if (this.recipeForm.invalid || !this.recipeId) return;

    this.isLoading = true;
    this.error = null;

    this.recipeService.updateRecipe(this.recipeId, this.recipeForm.value).subscribe({
      next: () => {
        this.router.navigate(['/recipes', this.recipeId]);
      },
      error: (err) => {
        console.error('Error updating recipe:', err);
        this.error = 'Failed to update recipe. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
