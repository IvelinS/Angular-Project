import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Recipe } from '../interfaces/recipe/recipe.interface'; 

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private http: HttpClient) { }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.apiUrl}/recipes`);
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${environment.apiUrl}/recipes/${id}`);
  }

  createRecipe(recipeData: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<Recipe>(`${environment.apiUrl}/recipes`, recipeData, { withCredentials: true });
  }

  updateRecipe(id: string, recipeData: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<Recipe>(`${environment.apiUrl}/recipes/${id}`, recipeData, { withCredentials: true });
  }

  deleteRecipe(id: string): Observable<Recipe> {
    return this.http.delete<Recipe>(`${environment.apiUrl}/recipes/${id}`, { withCredentials: true });
  }

  likeRecipe(id: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${environment.apiUrl}/recipes/${id}/like`, {}, { withCredentials: true });
  }
}