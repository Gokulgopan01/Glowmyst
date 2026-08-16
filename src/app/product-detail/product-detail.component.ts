import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, ChevronLeft, ChevronRightIcon, Star, MapPin, ShoppingBag, Gem, ShieldCheck, Undo2, Crown, Heart, Mail, Plus, Minus } from 'lucide-angular';

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
  description : string;
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
  readonly ChevronRightIcon = ChevronRightIcon;
  readonly StarIcon = Star;
  readonly MapPinIcon = MapPin;
  readonly BagIcon = ShoppingBag;
  readonly GemIcon = Gem;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly Undo2Icon = Undo2;
  readonly CrownIcon = Crown;
  readonly HeartIcon = Heart;
  readonly MailIcon = Mail;
  readonly PlusIcon = Plus;
  readonly MinusIcon = Minus;

  product: ProductDetail | null = null;
  relatedProducts: ProductDetail[] = [];

  faqs = [
    { question: 'Is the jewellery real gold plated?', answer: 'Yes, our jewellery is plated with high-quality 18k or 24k gold.', open: false },
    { question: 'What is your return policy?', answer: 'We offer a 14-day hassle-free return policy on all unworn items.', open: false },
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days. Express options are available at checkout.', open: false },
    { question: 'Does it come with gift packaging?', answer: 'Absolutely! Every order is beautifully packaged in our signature Glowmyst box.', open: false },
    { question: 'Is there a warranty on the products?', answer: 'Yes, we provide a 1-year warranty against any manufacturing defects.', open: false }
  ];

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
  images: string[] = [];
  activeImage: string = '';
  description: string = '';

  prevImage() {
    const currentIndex = this.images.indexOf(this.activeImage);
    if (currentIndex > 0) {
      this.activeImage = this.images[currentIndex - 1];
    } else {
      this.activeImage = this.images[this.images.length - 1];
    }
  }

  nextImage() {
    const currentIndex = this.images.indexOf(this.activeImage);
    if (currentIndex < this.images.length - 1) {
      this.activeImage = this.images[currentIndex + 1];
    } else {
      this.activeImage = this.images[0];
    }
  }

  mrp: number = 0;
  discountPercentage: number = 25; // Default assumption
  currentType: string = 'jewellery';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      const type = this.route.snapshot.queryParamMap.get('type') || 'jewellery';
      this.currentType = type;
      if (id) {
        this.fetchProductDetails(id, type);
      }
    });
  }

  fetchProductDetails(id: number, type: string) {
    const jsonPath = type === 'saree' ? 'assets/Products_json/saree_product.json' : 'assets/Products_json/jeweller_product.json';
    this.http.get<ProductDetail[]>(jsonPath).subscribe(data => {
      this.product = data.find(p => p.id === id) || null;

      if (this.product) {
        // Collect all available images
        this.images = [this.product.image];
        if (this.product.image2) this.images.push(this.product.image2);
        if (this.product.image3) this.images.push(this.product.image3);

        this.activeImage = this.images[0];

        this.mrp = Math.round(this.product.price * (100 / (100 - this.discountPercentage)));

        // Get 4 related products (excluding current one, maybe from same category or random)
        const others = data.filter(p => p.id !== id);
        // Let's just take the first 4 for simplicity
        this.relatedProducts = others.slice(0, 4);
        this.description = this.product.description;
      }
    });
  }

  setActiveImage(img: string) {
    this.activeImage = img;
  }
}
