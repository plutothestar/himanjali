import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogMeta } from '../shared/blog-meta';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private metaUrl = 'https://api.github.com/repos/plutothestar/himacms/contents/blog-list.json';

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<BlogMeta[]> {
    return this.http.get<any>(this.metaUrl).pipe(
      switchMap(res => {
        const rawUrl = res.download_url;
        return this.http.get<BlogMeta[]>(rawUrl);
      })
    );
  }
}
