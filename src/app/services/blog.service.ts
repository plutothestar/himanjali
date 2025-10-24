import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Blog, BlogMeta } from '../shared/blog-meta';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private metaUrl = 'https://api.github.com/repos/plutothestar/himacms/contents/blog-list.json';

  constructor(private http: HttpClient) {}
 // Create a new blog
  createBlog(blog: FormData): Observable<Blog> {
    return this.http.post<Blog>(`${environment.vercel.ApiUrl}/blog/create`, blog);
  }

  // Get all blogs
  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(environment.vercel.ApiUrl);
  }

  // Get a single blog by id
  // getBlogById(id: string): Observable<Blog> {
  //   return this.http.get<Blog>(`${environment.vercel.ApiUrl}/${id}`);
  // }

  
  updateBlog(id: string, blogData: FormData): Observable<any> {
    return this.http.put(`${environment.vercel.ApiUrl}/blog/update?contentId=${id}`, blogData);
  }

  // Delete a blog by id
  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.vercel.ApiUrl}/blog/delete?contentId=${id}`);
  }
  // getBlogs(): Observable<BlogMeta[]> {
  //   return this.http.get<any>(environment.vercel.ApiUrl).pipe(
  //     switchMap(res => {
  //       const rawUrl = res.download_url;
  //       return this.http.get<BlogMeta[]>(rawUrl);
  //     })
  //   );
  // }
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${environment.vercel.ApiUrl}/blog/getall`);  // Adjust API endpoint if necessary
  }

  // Get a single blog by ID (for detail page)
  getBlogById(contentId: string): Observable<Blog> {
    return this.http.get<Blog>(`${environment.vercel.ApiUrl}/blog/get?contentId=${contentId}`);
  }
}
