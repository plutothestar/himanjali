import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { BlogMeta } from '../../shared/blog-meta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  blogs: BlogMeta[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe(data => this.blogs = data);
  }
}