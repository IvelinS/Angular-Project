import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { RecipeListComponent } from './features/recipes/recipe-list/recipe-list.component';
import { RecipeCreateComponent } from './features/recipes/recipe-create/recipe-create.component';
import { RecipeDetailComponent } from './features/recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './features/recipes/recipe-edit/recipe-edit.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard, publicGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [publicGuard]
  },
  { 
    path: 'recipes/create', 
    component: RecipeCreateComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'recipes/:id/edit', 
    component: RecipeEditComponent,
    canActivate: [authGuard]
  },
  { path: 'recipes/:id', component: RecipeDetailComponent },
  { path: 'recipes', component: RecipeListComponent },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [authGuard]
  },
];
