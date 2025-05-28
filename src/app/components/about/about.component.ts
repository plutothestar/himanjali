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
    '/images/certificate1.jpeg',
    '/images/certificate2.jpeg',
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