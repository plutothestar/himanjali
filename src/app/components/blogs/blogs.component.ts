import { Component } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoaderService } from '../../services/loader.service';
import { isAdmin } from '../../shared/utils';
@Component({
  selector: 'app-blogs',
  imports: [DatePipe, CommonModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent {
managetestimonials() {
this.router.navigate([`/testimonials`]); 
}
createNewBlog() {
 this.router.navigate([`/create`]); 
}
  blogs: any[] = [];
  isAdmin() {
    return isAdmin();
  }
  constructor(private blogService: BlogService, private router: Router, private sanitizer: DomSanitizer,private loaderService: LoaderService) { }

  ngOnInit(): void {
   this.loaderService.showLoader();
    this.blogService.getAllBlogs().subscribe(
      (response: any) => {
        this.blogs = response.data;
        console.log(this.blogs);
       this.loaderService.hideLoader();
      },
      (error: any) => {
        console.error('Error fetching blog list:', error);
       this.loaderService.hideLoader();
      }
    );
  }

  goToBlogDetail(contentId: string): void {
    this.router.navigate([`/blog/${contentId}`]);  // Navigate to the blog detail page
  }
  sanitizeContent(content: string): SafeHtml {
    // Sanitize the content and return safe HTML for rendering
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
