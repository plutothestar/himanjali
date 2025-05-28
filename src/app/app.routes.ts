import { ConfirmationPageComponent } from './components/confirmation-page/confirmation-page.component';
import { ContactComponent } from './components/contact/contact.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { ServiceComponent } from './components/service/service.component';
import { AboutComponent } from './components/about/about.component';
import { BlogsComponent } from './components/blogs/blogs.component';

export const routes: Routes = [{
    path: "home",
    component: HomeComponent
}, {
    path: "bookings",
    component: BookingPageComponent
},
{
    path: "confirmations",
    component: ConfirmationPageComponent
},
{
    path: "services",
    component: ServiceComponent
},
{
    path: "about",
    component: AboutComponent
},
{
    path: "contact",
    component: ContactComponent
},
{
    path: "blogs",
    component: BlogsComponent
},
{
    path: "",
    component: HomeComponent
},
{
    path: "**",
    component: HomeComponent
},];
