import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service',
  imports: [RouterLink,CommonModule  ],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {
  
  product = {
    title: 'Yogic Coaching for Psychosomatic Healing',
    description: '1:1 Video call session ',
    duration: '60 minutes',
    price: 2500
  };
  priceINR = this.product.price;
  displayPrice: number = 0;
  currency: string = 'INR';
  constructor(private router: Router,private currencyService: CurrencyService) { }
  ngOnInit(): void {
    this.currencyService.getUserCountry().subscribe(countryCode => {
      if (countryCode === 'IN') {
        this.displayPrice = this.priceINR;
        this.currency = 'INR';
      } else {
        this.currencyService.getExchangeRate().subscribe(rate => {
          this.displayPrice = this.priceINR * rate;
          this.currency = 'GBP';
        });
      }this.product.price = this.displayPrice
    });
  }
    
  

  bookItem() {
    sessionStorage.setItem('selectedItem', JSON.stringify(this.product));
    this.router.navigate(['/bookings']);
  }
}
