import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../interfaces/recipe/recipe.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.apiUrl}/recipes`;

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    console.log('Calling API:', this.apiUrl);
    return this.http.get<Recipe[]>(this.apiUrl);
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

  getUserRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/user`);
  }

  getLikedRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/liked`);
  }

  seedRecipes(): Observable<Recipe[]> {
    console.log('Calling seed API:', `${this.apiUrl}/seed`);
    return this.http.post<Recipe[]>(`${this.apiUrl}/seed`, {});
  }
}