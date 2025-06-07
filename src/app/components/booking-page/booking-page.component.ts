import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCalendar } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
// import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environment';
import { GoogleCalendarService } from '../../services/google-calendar.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyService, Product } from '../../services/currency.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, MatCalendar, MatNativeDateModule, ReactiveFormsModule],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent implements OnInit,OnDestroy {
  selectedDate: Date = new Date();
  currentStep: number = 0;
  product!: Product;
  finalAvailableSlots: any = [];
  selectedSlot: any = null;
  appointmentForm!: FormGroup;
  // private stripe!: Stripe;

  steps: any[] = [
    { label: 'Meeting Information' },
    { label: 'Contact Details' },
    { label: 'Confirmation' },
  ];
  private subscription!: Subscription;

  constructor(
    private calender: GoogleCalendarService,
    private fb: FormBuilder,
    private router: Router,
    private currencyService: CurrencyService
  ) { }

  async ngOnInit(): Promise<void> {
    this.subscription = this.currencyService.product$.subscribe(p => {
      this.product = p;
    });

    this.appointmentForm = this.fb.group({
      step1: this.fb.group({
        selectedSlot: ['', Validators.required]
      }),
      step2: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
      }),
      step3: this.fb.group({
        description: ['']
      })
    });

    this.onDateSelected(this.selectedDate);

    // const stripeInstance = await loadStripe("");
    // if (stripeInstance) this.stripe = stripeInstance;
  }

  onDateSelected(event: any): void {
    if (event < new Date()) return;
    this.selectedDate = event;
    this.getAvailablityByDate(new Date(this.selectedDate), environment.availablityCalender);
  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;
    this.appointmentForm.get('step1.selectedSlot')?.setValue(slot);
  }
  dateFilter = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };
  get progress(): number {
    return ((this.currentStep + 1) / this.steps.length) * 100;
  }

  nextStep(): void {
    const stepGroup = this.appointmentForm.get(`step${this.currentStep + 1}`) as FormGroup;
    if (stepGroup?.invalid) {
      stepGroup.markAllAsTouched();
      return;
    }
    this.currentStep++;
  }

  previousStep(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  // async payWithStripe() {
  //   const { error } = await this.stripe.redirectToCheckout({
  //     lineItems: [{ price: 'price_1QwHAmCh8EDrcPxA8S19ygNC', quantity: 1 }],
  //     mode: 'payment',
  //     successUrl: `${environment.currentHost}/bookings`,
  //     cancelUrl: `${environment.currentHost}/bookings`,
  //   });

  //   if (error) {
  //     console.error('Payment failed:', error.message);
  //   }
  // }

  payWithRazorpay(): void {
    const amountInSubunits = Math.round(Number(this.product.price) * 100);

    const options: any = {
      key: environment.RazorpayKey,
      amount: amountInSubunits,
      currency: this.product.currency,
      name: 'Himanjali Dimri',
      description: 'Himanjali Dimri appointment',
      image: 'logo.png',
      handler: (response: any) => {
        this.createEvent(response);
        console.log('Payment successful:', response);
      },
      prefill: {
        name: this.appointmentForm.get('step2.name')?.value,
        email: this.appointmentForm.get('step2.email')?.value,
        contact: this.product.currency === 'INR'
          ? `+91${this.appointmentForm.get('step2.contact')?.value}`
          : this.appointmentForm.get('step2.contact')?.value
      },
      notes: {
        address: this.appointmentForm.get('step3.description')?.value
      },
      theme: {
        color: '#C6c09C'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  createEvent(razorPresponse: any) {
    const startDate = new Date(this.selectedSlot.start);
    const endDate = new Date(this.selectedSlot.end);

    const event = {
      summary: `Scheduled Meeting with ${this.appointmentForm.get('step2.name')?.value}`,
      location: 'Google Meet',
      description: `Your payment reference no: ${razorPresponse.razorpay_payment_id}\n\n${this.appointmentForm.get('step3.description')?.value}\n\nEmail: ${this.appointmentForm.get('step2.email')?.value}\nPhone: ${this.appointmentForm.get('step2.contact')?.value}`,
      start: { dateTime: startDate.toISOString(), timeZone: 'Asia/Kolkata' },
      end: { dateTime: endDate.toISOString(), timeZone: 'Asia/Kolkata' },
      attendees: [{ email: this.appointmentForm.get('step2.email')?.value }],
      conferenceData: {
        createRequest: {
          requestId: new Date().getTime().toString(),
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [{ method: "email", minutes: 30 }]
      },
      conferenceDataVersion: 1,
      sendUpdates: "all",
      CALENDAR_ID: environment.appointmentCalender,
    };

    this.calender.addCalendarEvent(event).subscribe({
      next: (data) => {
        console.log('Event Created:', data);
        this.router.navigate(['/confirmations']);
      },
      error: (error) => console.error('Error:', error)
    });
  }

  getAvailablityByDate(date: any, calendarId: string) {
    const timeMin = new Date(date.setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(new Date(date.setHours(23, 59, 59, 999))).toISOString();

    this.calender.getCalendarEvents(timeMin, timeMax, calendarId).subscribe(
      response => {
        const availablityData = response.events.map((event: any) => ({
          start: event.start.dateTime,
          end: event.end.dateTime
        }));
        this.fetchBookedSlots(date, availablityData);
      },
      error => console.error('Error:', error)
    );
  }

  fetchBookedSlots(date: any, availableSlots: any) {
    const timeMin = new Date(date.setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(new Date(date.setHours(23, 59, 59, 999))).toISOString();

    this.calender.getCalendarEvents(timeMin, timeMax, environment.appointmentCalender).subscribe(
      response => {
        const bookedSlots = response.events.map((event: any) => ({
          start: event.start.dateTime,
          end: event.end.dateTime
        }));
        this.finalAvailableSlots = this.filterFreeSlots(availableSlots, bookedSlots);
      },
      error => console.error('Error:', error)
    );
  }

  filterFreeSlots(availableSlots: any, bookedSlots: any) {
    let freeSlots: any[] = [];
    const now = new Date();
    availableSlots.forEach((slot: any) => {
      let currentStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      if (slotEnd <= now) return;
      const relevantBookings = bookedSlots
        .filter((b: any) => b.end > slot.start && b.start < slot.end)
        .map((b: any) => ({ start: new Date(b.start), end: new Date(b.end) }))
        .sort((a: any, b: any) => a.start.getTime() - b.start.getTime());

      for (let booked of relevantBookings) {
        if (currentStart < booked.start) {
          freeSlots.push(...this.generateHourlySlots(currentStart, booked.start, now));
        }
        currentStart = booked.end > currentStart ? booked.end : currentStart;
      }

      if (currentStart < slotEnd) {
        freeSlots.push(...this.generateHourlySlots(currentStart, slotEnd, now));
      }
    });

    return freeSlots;
  }

  generateHourlySlots(startTime: Date, endTime: Date, now: Date) {
    let slots = [];
    let slotStart = new Date(startTime);

    while (slotStart < endTime) {
      let slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1);
      if (slotEnd > endTime) break;

      if (slotStart > now) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString()
        });
      }

      slotStart = slotEnd;
    }

    return slots;
  }
  ngOnDestroy(): void {
  this.subscription?.unsubscribe();
}
}
