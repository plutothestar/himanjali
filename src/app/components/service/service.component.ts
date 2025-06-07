import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyService, Product } from '../../services/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service',
  imports: [RouterLink, CommonModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {
  product!: Product;
  constructor(private router: Router, private currencyService: CurrencyService) { }
  ngOnInit(): void {

    this.currencyService.product$.subscribe(p => {
      this.product = p;
    });
  }



  bookItem() {
    // sessionStorage.setItem('selectedItem', JSON.stringify(this.product));
    this.router.navigate(['/bookings']);
  }
}
