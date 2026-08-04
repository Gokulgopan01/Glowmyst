import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, ChevronLeft, Star, MapPin, ShoppingBag, Gem, ShieldCheck, Undo2 } from 'lucide-angular';

export interface ProductDetail {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  image2?: string;
  image3?: string;
  badge: string;
  OCCASION?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  readonly ChevronLeftIcon = ChevronLeft;
  readonly StarIcon = Star;
  readonly MapPinIcon = MapPin;
  readonly BagIcon = ShoppingBag;
  readonly GemIcon = Gem;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly Undo2Icon = Undo2;

  product: ProductDetail | null = null;
  images: string[] = [];
  activeImage: string = '';

  mrp: number = 0;
  discountPercentage: number = 25; // Default assumption

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.fetchProductDetails(id);
      }
    });
  }

  fetchProductDetails(id: number) {
    this.http.get<ProductDetail[]>('assets/Products_json/jeweller_product.json').subscribe(data => {
      this.product = data.find(p => p.id === id) || null;

      if (this.product) {
        // Collect all available images
        this.images = [this.product.image];
        if (this.product.image2) this.images.push(this.product.image2);
        if (this.product.image3) this.images.push(this.product.image3);

        this.activeImage = this.images[0];

        // Calculate MRP (assuming ~25% discount logic since json only has offer price)
        // If product is 9999, MRP would be around 13332
        this.mrp = Math.round(this.product.price * (100 / (100 - this.discountPercentage)));
      }
    });
  }

  setActiveImage(img: string) {
    this.activeImage = img;
  }
}
