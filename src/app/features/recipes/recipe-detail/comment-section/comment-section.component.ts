import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Comment } from '../../../../core/interfaces/comment/comment';
import { RecipeService } from '../../../../core/services/recipe.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css'],
  animations: [
    trigger('commentSlide', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 }))
      ])
    ])
  ]
})
export class CommentSectionComponent implements OnInit, OnDestroy {
  @Input() recipeId!: string;
  
  comments: Comment[] = [];
  commentForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    public authService: AuthService
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if (!this.recipeId) {
        console.error('Recipe ID is required');
        return;
    }
    this.loadComments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadComments(): void {
    this.isLoading = true;
    this.recipeService.getComments(this.recipeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comments) => {
          this.comments = comments;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load comments';
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
        const { content } = this.commentForm.value;
        const userId = this.authService.getUserId();
        const username = this.authService.getUsername();
        
        // check for user information
        if (!userId || !username) {
            this.error = 'User not authenticated';
            return;
        }
        
        this.recipeService.addComment(this.recipeId, content)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (newComment) => {
                    const formattedComment: Comment = {
                        ...newComment,
                        creator: {
                            _id: userId, 
                            username: username
                        }
                    };
                    
                    this.comments.unshift(formattedComment);
                    this.commentForm.reset();
                },
                error: (err) => {
                    this.error = 'Failed to add comment';
                }
            });
    }
  }

  deleteComment(commentId: string): void {
    this.recipeService.deleteComment(this.recipeId, commentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c._id !== commentId);
        },
        error: (err) => {
          this.error = 'Failed to delete comment';
        }
      });
  }

  canDeleteComment(comment: Comment): boolean {
    const userId = this.authService.getUserId();
    return userId === comment.creator._id;
  }
}
