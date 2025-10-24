import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment.prod';
import { NgxImageCompressService } from 'ngx-image-compress';
import { isAdmin } from '../../shared/utils';
import { Router } from '@angular/router';
interface TestimonialImage {
  url: string;
  public_id: string;
}
@Component({
  selector: 'app-testimonials-edit',
  imports: [CommonModule],
  templateUrl: './testimonials-edit.component.html',
  styleUrl: './testimonials-edit.component.scss'
})
export class TestimonialsEditComponent implements OnInit {
  createNewBlog() {
    this.router.navigate([`/create`]);
  }
  testimonials: TestimonialImage[] = [];
  selectedFile: File | null = null;
  loading = false;
  testimonialLoading = false;
  isAdmin() {
    return isAdmin();
  }
  private apiUrl = `${environment.vercel.ApiUrl}/testimonials`; // Adjust path to your Vercel function

  constructor(private router:Router,private http: HttpClient, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
    this.testimonialLoading = true;
    this.fetchTestimonials();
  }

  fetchTestimonials() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.testimonials = res.data || [];
        this.testimonialLoading = false;
      },
      error: (err) => console.error('Fetch error:', err),
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const imageBase64 = e.target.result; // base64 encoded original image

        // Compress image using ngx-image-compress
        this.imageCompress
          .compressFile(imageBase64, -1, 50, 50) // (-1=auto orientation, quality, maxWidthHeight)
          .then((compressedImage: string) => {
            // Convert compressed base64 back to File object
            const blob = this.base64ToBlob(compressedImage);
            this.selectedFile = new File([blob], file.name, { type: file.type });

            console.log(
              'Original size (MB):',
              this.imageCompress.byteCount(imageBase64) / (1024 * 1024)
            );
            console.log(
              'Compressed size (MB):',
              this.imageCompress.byteCount(compressedImage) / (1024 * 1024)
            );
          });
      };

      reader.readAsDataURL(file);
    }
  }

  // Helper: Convert Base64 -> Blob
  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }


  uploadImage() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('banner_image', this.selectedFile);

    this.loading = true;
    this.http.post<any>(this.apiUrl, formData).subscribe({
      next: (res) => {
        this.testimonials.push(res.data);
        this.selectedFile = null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.loading = false;
      },
    });
  }

  deleteImage(publicId: string) {
    this.loading = true;
    this.http.delete<any>(`${this.apiUrl}?public_id=${publicId}`).subscribe({
      next: () => {
        this.testimonials = this.testimonials.filter(img => img.public_id !== publicId);
        this.loading = false;
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.loading = false;
      },
    });
  }
}