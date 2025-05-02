import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCalendar } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environment';
import { GoogleCalendarService } from '../../services/google-calendar.service';
import { SafeUrlPipe } from '../../shared/safe-url.pipe';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-booking-page',
  imports: [CommonModule, MatCalendar, MatNativeDateModule, SafeUrlPipe, ReactiveFormsModule],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent implements OnInit {

  public availableSlots: any;
  slots: any;
  userTimeZone: any;
  calSrc: any;
  selectedDate: Date = new Date;
  private stripe!: Stripe;
  currentStep: number = 0;
  steps: any[] = [
    { label: 'Meeting Information' },
    { label: 'Contact Details' },
    { label: 'Confirmation' },
  ];
  availablityData: any;
  bookingData: any;
  finalAvailableSlots: any = [];
  selectedSlot: any = null;
  calendarUrl: string = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(environment.availablityCalender)}&ctz=Asia%2FKolkata`;
  appointmentForm!: FormGroup;

  constructor(private calender: GoogleCalendarService, private fb: FormBuilder) { }

  onDateSelected(event: Date): void {
    this.selectedDate = event;
    this.getAvailablityByDate(new Date(this.selectedDate), environment.availablityCalender)
  }


  selectSlot(slot: any) {
    this.selectedSlot = slot;
    this.appointmentForm.get('step1.selectedSlot')?.setValue(slot);
    this.appointmentForm.get('step1.selectedSlot')?.markAsTouched();
    this.appointmentForm.get('step1.selectedSlot')?.updateValueAndValidity();
  }
  async ngOnInit(): Promise<void> {
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
    this.onDateSelected(new Date(this.selectedDate));
    const stripeInstance = await loadStripe('pk_test_51QwGxXCh8EDrcPxALNtQjurmVgKwcc2o1MOj1XMFdQCWVyXcek5JTHzUOkcjBICVT2YGb90jANDqf1c7KfCtlBNc00MO179KtO');
    if (stripeInstance) {
      this.stripe = stripeInstance;
    }
    setTimeout(() => {
    }, 0);
    return;
  }

  async payWithStripe() {
    const { error } = await this.stripe.redirectToCheckout({
      lineItems: [{ price: 'price_1QwHAmCh8EDrcPxA8S19ygNC', quantity: 1 }],
      mode: 'payment',
      successUrl: `${environment.currentHost}/bookings`,
      cancelUrl: `${environment.currentHost}/bookings`,
    });

    if (error) {
      console.error('Payment failed:', error.message);
    }
  }

  nextStep(): void {
    if (this.currentStep === 0 && this.appointmentForm.get('step1')?.invalid) {
      this.appointmentForm.get('step1')?.markAllAsTouched();
      return;
    }
    if (this.currentStep === 1 && this.appointmentForm.get('step2')?.invalid) {
      this.appointmentForm.get('step2')?.markAllAsTouched();
      return;
    }
    this.currentStep++;
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  get progress(): number {
    return (this.currentStep + 1) / this.steps.length * 100;
  }


  getAvailablityByDate(date: any, calenderId: string) {
    const timeMin = new Date(date.setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(new Date(date.setHours(23, 59, 59, 999))).toISOString();
    const calendarId = calenderId;

    this.calender.getCalendarEvents(timeMin, timeMax, calendarId).subscribe(
      response => {
        this.availablityData = response.events.map((event: any) => ({
          start: event.start.dateTime,
          end: event.end.dateTime
        }));
        this.fetchBookedSlots(date, this.availablityData);
      },
      error => {
        console.error('Error:', error);
      }
    );

  }

  fetchBookedSlots(date: any, availableSlots: any) {
    const timeMin = new Date(date.setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(new Date(date.setHours(23, 59, 59, 999))).toISOString();
    const calendarId = environment.appointmentCalender;

    this.calender.getCalendarEvents(timeMin, timeMax, calendarId).subscribe(
      response => {
        this.bookingData = response.events.map((event: any) => ({
          start: event.start.dateTime,
          end: event.end.dateTime
        }));
        this.finalAvailableSlots = this.filterFreeSlots(availableSlots, this.bookingData);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  filterFreeSlots(availableSlots: any, bookedSlots: any) {
    let freeSlots: any[] = [];

    availableSlots.forEach((slot: any) => {
      let currentStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      let relevantBookings = bookedSlots
        .filter((booked: any) => booked.end > slot.start && booked.start < slot.end)
        .map((booked: any) => ({
          start: new Date(booked.start),
          end: new Date(booked.end),
        }))
        .sort((a: any, b: any) => a.start.getTime() - b.start.getTime());

      relevantBookings.forEach((booked: any) => {
        if (currentStart < booked.start) {
          freeSlots.push(...this.generateHourlySlots(currentStart, booked.start));
        }
        currentStart = booked.end > currentStart ? booked.end : currentStart;
      });

      if (currentStart < slotEnd) {
        freeSlots.push(...this.generateHourlySlots(currentStart, slotEnd));
      }
    });

    return freeSlots;
  }

  generateHourlySlots(startTime: Date, endTime: Date) {
    let slots = [];
    let slotStart = new Date(startTime);

    while (slotStart < endTime) {
      let slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1);

      if (slotEnd > endTime) {
        break;
      }

      slots.push({
        start: new Date(slotStart).toISOString(),
        end: new Date(slotEnd).toISOString(),
      });

      slotStart = new Date(slotEnd);
    }

    return slots;
  }

  createEvent() {

      const startDate = this.selectedSlot.start instanceof Date ? this.selectedSlot.start : new Date(this.selectedSlot.start);
      const endDate = this.selectedSlot.end instanceof Date ? this.selectedSlot.end : new Date(this.selectedSlot.end);

      const event = {
        summary: `Scheduled Meeting with ${this.appointmentForm.get('step2.name')?.value}`,
        location: 'Google Meet',
        description: `${this.appointmentForm.get('step3.description')?.value}\n\nContact Details:\nEmail - ${this.appointmentForm.get('step2.email')?.value}\nPhone No - ${this.appointmentForm.get('step2.contact')?.value}`,
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
        CALENDAR_ID:environment.appointmentCalender,
      };

      this.calender.addCalendarEvent(event).subscribe({
        next: (data) => {
          console.log('Event Created:', data);
          console.log('Google Meet Link:', data?.conferenceData?.entryPoints[0]?.uri);
        },
        error: (error) => console.error('Error:', error)
      });
    }

    inputValue: string = '100';

  updateInputValue(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;
  }

  payWithRazorpay(): void {
    if (isNaN(Number(this.inputValue))) {
      alert('Enter numeric value');
      return;
    }

    const finalRazorPayValue = Number(this.inputValue) * 100;

    const options: any = {
      key: environment.RazorpayKey,
      amount: finalRazorPayValue,
      name: 'Himanjali Dimri',
      description: 'Himanjali Dimri appointment',
      image: 'logo.png',
      handler: function (response: any) {
        alert('Payment Id ' + response.razorpay_payment_id + ' : Payment successful');
        console.log(response);
      },
      prefill: {
        name: this.appointmentForm.get('step2.name')?.value,
        email: this.appointmentForm.get('step2.email')?.value,
        contact: this.appointmentForm.get('step2.contact')?.value,
      },
      notes: {
        address: this.appointmentForm.get('step2.description')?.value
      },
      theme: {
        color: '#C6c09C'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  }


