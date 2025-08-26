import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { BlogMeta } from '../../shared/blog-meta';
import { Router, RouterLink } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';
import { environment } from '../../../environment.prod';
declare var Flickity: any;
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  private readonly API_URL = 'https://api.github.com/repos/plutothestar/himacms/contents/testimonialImages';
  blogs: BlogMeta[] = [];
  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit(): void {
    // this.blogService.getBlogs().subscribe(data => this.blogs = data);
  }


  ngAfterViewInit() {
    fetch(`${environment.vercel.ApiUrl}/testimonials`)
      .then(res => res.json())
      .then(files => {
        const images = files.data.filter((file: any) => file.url);
        const carousel = document.getElementById('github-carousels');

        images.forEach((file: any) => {
          const div = document.createElement('div');
          div.className = 'carousel-cell';
          const img = document.createElement('img');
          img.src = file.url;
          div.appendChild(img);
          carousel?.appendChild(div);
        });

        new Flickity('#github-carousels', {
          wrapAround: true,
          autoPlay: 3000,
          imagesLoaded: true,
        });
      })
      .catch(err => console.error('Failed to fetch GitHub images', err));
  }
  bookItem() {
    this.router.navigate(['/bookings']);
  }
}
