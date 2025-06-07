import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { filter } from 'rxjs';
import { FooterComponent } from "./components/footer/footer.component"; import { HomeComponent } from "./components/home/home.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Himanjali';
  constructor(private router: Router) { }

  ngOnInit() {
    const homeWrapper = document.getElementById('home-static-wrapper');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => { window.scrollTo({ top: 0, behavior: 'smooth' });
       const navCollapse = document.getElementById('ftco-nav');
  if (navCollapse?.classList.contains('show')) {
    navCollapse.classList.remove('show');
  }
        if (!homeWrapper) return;
        if (event.urlAfterRedirects === '/home') {
          event.urlAfterRedirects = '/';
        }
        const isHome = event.urlAfterRedirects === '/';

        homeWrapper.style.display = isHome ? 'block' : 'none';


      }
    );
  }
}
