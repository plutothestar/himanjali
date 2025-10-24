import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../shared/blog-meta';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule, Editor, NgxEditorMenuComponent } from 'ngx-editor';
import { LoaderService } from '../../services/loader.service';
import { isAdmin } from '../../shared/utils';
import { NgxImageCompressService } from 'ngx-image-compress';
@Component({
  selector: 'app-blog-add-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxEditorModule, NgxEditorMenuComponent],
  templateUrl: './blog-add-edit.component.html',
  styleUrls: ['./blog-add-edit.component.scss'],
})
export class BlogAddEditComponent implements OnInit, OnDestroy {

  blog: Blog = {
    contentType: 'blog',
    title: '',
    author: '',
    publication_date: '',
    banner_image_url: '',
    content: '',
    tags: []
  };

  // Form-bound helpers
  tagString: string = ''; // for editing tags as string
  editor!: Editor;
  htmlContent = new FormControl('');
  isEditMode: boolean = false;
  id: string = '';
  selectedFile: File | null = null;
  errorMessage: string = '';
  toolbar: any = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule'],
    ['undo', 'redo'],
  ];
  isAdmin() {
    return isAdmin();
  }
  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private imageCompress: NgxImageCompressService
  ) {

  }

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.editor = new Editor();
    this.id = this.activatedRoute.snapshot.params['id'];

    if (this.id) {
      this.isEditMode = true;
      this.fetchBlog(this.id);
    }else{this.loaderService.hideLoader();}

  }

  fetchBlog(id: string): void {
    this.blogService.getBlogById(id).subscribe(
      (response: any) => {
        this.loaderService.hideLoader();
        const data = response?.data;

        if (data) {
          // Convert date to yyyy-MM-dd
          const formattedDate = data.publication_date?.split('T')[0] ?? '';

          // Convert tags array to comma-separated string for form input
          const tagString = Array.isArray(data.tags) ? data.tags.join(', ') : '';

          this.blog = {
            ...data,
            publication_date: formattedDate,
            tags: data.tags || []
          };

          this.tagString = tagString;
        }
      },
      (error) => {
        console.error('Error fetching blog for editing:', error);
        this.errorMessage = 'Failed to fetch blog data for editing.';
        this.loaderService.hideLoader();
      }
    );
  }

  onFileChange(event: any) {
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


  saveBlog(): void {
    if (typeof this.tagString === 'string') {
      this.blog.tags = this.tagString.split(',').map(tag => tag.trim());
    }
    this.loaderService.showLoader();

    const formData = new FormData();

    formData.append('contentType', this.blog.contentType ?? 'blog');
    formData.append('title', this.blog.title);
    formData.append('author', this.blog.author);
    formData.append('publication_date', this.blog.publication_date);
    formData.append('content', this.blog.content);
    formData.append(
      'tags',
      Array.isArray(this.blog.tags) ? this.blog.tags.join(',') : this.blog.tags
    );


    if (this.selectedFile) {
      formData.append('banner_image', this.selectedFile, this.selectedFile.name);
    }

    if (this.isEditMode) {
      this.blogService.updateBlog(this.id, formData).subscribe(
        (response) => {
          console.log('Blog updated successfully:', response);
          this.router.navigate(['/blogs']);
        },
        (error) => {
          console.error('Error updating blog:', error);
          this.errorMessage = 'Failed to update the blog.';
        },
        () => {
          this.loaderService.hideLoader();
        }
      );
    } else {
      this.blogService.createBlog(formData).subscribe(
        (data) => {
          this.router.navigate(['/blogs']);
        },
        (error) => {
          console.error('Error creating blog:', error);
          this.errorMessage = 'Failed to create the blog.';
          this.loaderService.hideLoader();
        },
        () => {
          this.loaderService.hideLoader();
        }
      );
    }

  }

  ngOnDestroy() {
    this.editor?.destroy();
  }
}
