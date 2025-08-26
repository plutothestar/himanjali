import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from '../../services/loader.service';
import { isAdmin } from '../../shared/utils';
@Component({
  selector: 'app-blog',
  imports: [DatePipe, CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {

  blog: any;
  error: string | null = null;
  blogContent: SafeHtml | null = null;  // Safe HTML type for binding
  isAdmin() {
    return isAdmin();
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService // Inject the sanitizer service
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader();
    const contentId = this.route.snapshot.paramMap.get('contentId');
    if (contentId) {
      this.getBlog(contentId);
    }
  }

  getBlog(contentId: string): void {
    this.blogService.getBlogById(contentId).subscribe(
      (response: any) => {
        this.blog = response.data;
        this.blogContent = this.sanitizer.bypassSecurityTrustHtml(this.blog.content); // Sanitize HTML
        this.loaderService.hideLoader();
      },
      (error) => {
        this.error = 'Failed to load blog';
        this.loaderService.hideLoader();
      }
    );
  }
  deleteBlog(contentId: string): void {
    this.blogService.deleteBlog(contentId).subscribe(
      (response: any) => {
        this.blog = response.data;
        this.router.navigate(['/blogs']);
        this.loaderService.hideLoader();
      },
      (error) => {
        this.error = 'Failed to load blog';
        this.loaderService.hideLoader();
      }
    );
  }
  editBlog(contentId: string): void {

    this.router.navigate(['/edit/' + contentId]);

  }
}
