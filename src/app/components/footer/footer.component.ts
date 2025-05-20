import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogMeta } from '../../shared/blog-meta';
import { BlogService } from '../../services/blog.service';
@Component({
  selector: 'app-footer',
  imports: [RouterLink,CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  blogs: BlogMeta[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe(data => this.blogs = data);
  }
}
