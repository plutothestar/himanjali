import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-service',
  imports: [RouterLink],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {
  constructor( private router: Router) { }
  bookItem() {
    const item = {
      title: 'Root Cause Clarity Session',
      description: 'A 60-minute 1:1 session to identify root blocks, realign with your core self, and create a personalized healing plan for clarity, grounding, and self-trust',
      duration: '60 mins',
      price: 50
    };
    sessionStorage.setItem('selectedItem', JSON.stringify(item));
    this.router.navigate(['/bookings']);
  }
}
