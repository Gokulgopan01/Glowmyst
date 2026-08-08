import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight, ArrowRight, Star, Heart, ShoppingBag } from 'lucide-angular';

interface Slide {
  id: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  OCCASION?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly ArrowRightIcon = ArrowRight;
  readonly StarIcon = Star;
  readonly HeartIcon = Heart;
  readonly ShoppingBagIcon = ShoppingBag;

  @ViewChildren('animatedElement') animatedElements!: QueryList<ElementRef>;
  private observer: IntersectionObserver | null = null;

  slides: Slide[] = [
    { id: 0, image: 'assets/home/hero_1.png' },
    { id: 1, image: 'assets/home/hero_2.png' }
  ];

  activeSlide = 0;
  private intervalId: any;
  trendingProducts: Product[] = [];
  jewelleryProducts: Product[] = [];

  ngOnInit(): void {
    this.startAutoPlay();
    this.loadTrendingProducts();
    this.loadJewelleryProducts();
  }

  async loadTrendingProducts() {
    try {
      const response = await fetch('/assets/Products_json/saree_product.json');
      const data: Product[] = await response.json();
      const targetIds = [17, 1, 2, 16];
      // Filter and maintain order
      this.trendingProducts = targetIds
        .map(id => data.find(p => p.id === id))
        .filter(p => !!p) as Product[];

      // Add mock data for UI fields not present in json
      const mockRatings = [4.8, 4.7, 4.8, 4.9];
      this.trendingProducts.forEach((p, index) => {
        p.originalPrice = Math.round(p.price * 1.3); // Closer to the image's original prices
        p.discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        p.rating = mockRatings[index] || 4.5;
        p.badge = 'NEW';
      });
    } catch (error) {
      console.error('Error loading saree products', error);
    }
  }

  async loadJewelleryProducts() {
    try {
      const response = await fetch('/assets/Products_json/jeweller_product.json');
      const data: Product[] = await response.json();
      // Just take the first 4 products for the jewellery section
      this.jewelleryProducts = data.slice(0, 4);
      
      const mockRatings = [4.9, 4.8, 4.7, 4.9];
      this.jewelleryProducts.forEach((p, index) => {
        p.originalPrice = Math.round(p.price * 1.4);
        p.discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        p.rating = mockRatings[index] || 4.8;
        p.badge = 'EXCLUSIVE';
      });
    } catch (error) {
      console.error('Error loading jewellery products', error);
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    this.animatedElements.forEach(el => {
      this.observer?.observe(el.nativeElement);
    });
  }

  startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    this.activeSlide = (this.activeSlide + 1) % this.slides.length;
    this.resetAutoPlay();
  }

  prevSlide(): void {
    this.activeSlide = (this.activeSlide - 1 + this.slides.length) % this.slides.length;
    this.resetAutoPlay();
  }

  goToSlide(index: number): void {
    this.activeSlide = index;
    this.resetAutoPlay();
  }

  private resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
