import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  currentRoute: string='';

  constructor(private router: Router) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      // Extract the base path only (e.g. /about from /about?x=1#frag)
      this.currentRoute = '/' + event.urlAfterRedirects.split('?')[0].split('#')[0].split('/')[1];
      if (this.currentRoute === '//') {
        this.currentRoute = '/';
      }
    });
  }
  isActive(route: string): boolean {
    return this.router.url === route || (route === '/home' && this.router.url === '/');
  }
}
