import { ConfirmationPageComponent } from './components/confirmation-page/confirmation-page.component';
import { ContactComponent } from './components/contact/contact.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { ServiceComponent } from './components/service/service.component';
import { AboutComponent } from './components/about/about.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogAddEditComponent } from './components/blog-add-edit/blog-add-edit.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminGuard } from './shared/admin.guard';
import { TestimonialsEditComponent } from './components/testimonials-edit/testimonials-edit.component';

export const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "bookings", component: BookingPageComponent },
    { path: "confirmations", component: ConfirmationPageComponent },
    { path: "services", component: ServiceComponent },
    { path: "about", component: AboutComponent },
    { path: "contact", component: ContactComponent },
    { path: "blogs", component: BlogsComponent },
    { path: "blog/:contentId", component: BlogComponent },
    { path: "testimonials", component: TestimonialsEditComponent, canActivate: [AdminGuard] },

    // 🔐 Admin login route (hidden from public navigation)
    { path: "admin-login", component: AdminLoginComponent },

    // ✍️ Admin-only routes protected by AdminGuard
    { path: 'create', component: BlogAddEditComponent, canActivate: [AdminGuard] },
    { path: 'edit/:id', component: BlogAddEditComponent, canActivate: [AdminGuard] },

    // Default route
    { path: "", component: HomeComponent },

    // Fallback for undefined route
    { path: "**", component: HomeComponent }];
