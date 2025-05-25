import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink,CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  images: string[] = [
    'https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=1470&auto=format&fit=crop',
    'https://plus.unsplash.com/premium_photo-1661927190802-97d541e1d182?q=80&w=1471&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601138061518-864051769be7?q=80&w=1471&auto=format&fit=crop',

  ];

  lightboxOpen: boolean = false;
  currentImage: string = '';

  openLightbox(imageSrc: string): void {
    this.currentImage = imageSrc;
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.currentImage = '';
  }
}