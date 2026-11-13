import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { JewelleryComponent } from './jewellery/jewellery.component';
import { SareeComponent } from './saree/saree.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { sareeComingSoonGuard } from './guards/saree-coming-soon.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'jewellery', component: JewelleryComponent },
    { path: 'sarees', component: SareeComponent, canActivate: [sareeComingSoonGuard] },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'contact-us', component: ContactUsComponent },
    { path: '**', redirectTo: 'home' }
];
