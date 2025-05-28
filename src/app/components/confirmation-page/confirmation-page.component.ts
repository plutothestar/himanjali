import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-confirmation-page',
  imports: [RouterLink],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './confirmation-page.component.scss'
})
export class ConfirmationPageComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {
   
  }
}
