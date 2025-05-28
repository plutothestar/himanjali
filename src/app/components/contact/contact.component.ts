import { Component } from '@angular/core';
@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  nextUrl = `${window.location.origin}/confirmations`;
  constructor( ) {
    this.nextUrl = `${window.location.origin}/confirmations`;
  }


}
