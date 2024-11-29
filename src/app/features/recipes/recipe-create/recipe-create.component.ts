import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css'
})
export class RecipeCreateComponent {
  recipeForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: [''],
      ingredients: this.fb.array([this.fb.control('')]),
      instructions: this.fb.array([this.fb.control('')])
    });
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.fb.control(''));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addInstruction() {
    this.instructions.push(this.fb.control(''));
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      this.isSubmitting = true;
      this.error = null;

      this.recipeService.createRecipe(this.recipeForm.value).subscribe({
        next: () => {
          this.router.navigate(['/recipes']);
        },
        error: (err) => {
          this.error = 'Failed to create recipe. Please try again.';
          this.isSubmitting = false;
          console.error('Error creating recipe:', err);
        }
      });
    }
  }
}