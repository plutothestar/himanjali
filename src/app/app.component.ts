import { Component, OnInit } from '@angular/core';
import {  NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Himanjali';
  constructor(private router: Router) {}

  ngOnInit() {
    const homeWrapper = document.getElementById('home-static-wrapper');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!homeWrapper) return;
if(event.urlAfterRedirects === '/home'){
  event.urlAfterRedirects = '/';
}
        // Change this if your home route is something else like '/home'
        const isHome = event.urlAfterRedirects === '/';

        homeWrapper.style.display = isHome ? 'block' : 'none';
      });
  }
}
