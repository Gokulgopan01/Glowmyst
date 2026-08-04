import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { JewelleryComponent } from './jewellery/jewellery.component';

import { ProductDetailComponent } from './product-detail/product-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'jewellery', component: JewelleryComponent },
    { path: 'product/:id', component: ProductDetailComponent }
];
