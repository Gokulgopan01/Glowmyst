import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChildren, QueryList, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight, ArrowRight, Star, Heart, ShoppingBag, ArrowUp, ArrowDown } from 'lucide-angular';

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
  readonly ArrowUpIcon = ArrowUp;
  readonly ArrowDownIcon = ArrowDown;

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
  featuredNecklaces: Product[] = [];
  featuredBangles: Product[] = [];
  featuredEarrings: Product[] = [];

  // Signature Carousel State
  signatureCategories = [
    { title: 'Necklaces', count: 'Explore Collection', image: 'assets/home/necklaces.png' },
    { title: 'Bangles', count: 'Explore Collection', image: 'assets/home/bangles.png' },
    { title: 'Earrings', count: 'Explore Collection', image: 'assets/home/earrings.png' },
    { title: 'Sarees', count: 'Explore Collection', image: 'assets/home/sarees.png' }
  ];
  currentSignatureIndex = 0;
  isAnimating = false;
  animationDirection: 'up' | 'down' | '' = '';
  private touchStartY = 0;

  // Try-On Section State
  tryOnProducts: Product[] = [];
  selectedTryOnProduct: Product | null = null;
  tryOnModelImage = 'assets/home/earings_modal.png'; // Placeholder for model
  tryOnAnimating = false;
  tryOnStartIndex = 0; // For desktop carousel navigation (shows 3 at a time)
  private tryOnTouchStartX = 0;

  ngOnInit(): void {
    this.startAutoPlay();
    this.loadTrendingProducts();
    this.loadJewelleryProducts();
    this.loadFeaturedNecklaces();
    this.loadFeaturedBangles();
    this.loadFeaturedEarrings();
    this.loadTryOnProducts();
  }

  async loadFeaturedNecklaces() {
    try {
      const response = await fetch('/assets/Products_json/jeweller_product.json');
      const data: Product[] = await response.json();
      this.featuredNecklaces = data
        .filter(p => p.category === 'Necklaces')
        .slice(0, 5);
    } catch (error) {
      console.error('Error loading featured necklaces', error);
    }
  }

  async loadFeaturedBangles() {
    try {
      const response = await fetch('/assets/Products_json/jeweller_product.json');
      const data: Product[] = await response.json();
      this.featuredBangles = data
        .filter(p => p.category === 'Bangles')
        .slice(0, 5);
    } catch (error) {
      console.error('Error loading featured bangles', error);
    }
  }

  async loadFeaturedEarrings() {
    try {
      const response = await fetch('/assets/Products_json/jeweller_product.json');
      const data: Product[] = await response.json();
      this.featuredEarrings = data
        .filter(p => p.category === 'Earrings')
        .slice(0, 5);
    } catch (error) {
      console.error('Error loading featured earrings', error);
    }
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
      // Just take the first 5 products for the jewellery section
      this.jewelleryProducts = data.slice(0, 5);

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

  async loadTryOnProducts() {
    try {
      const response = await fetch('/assets/Products_json/jeweller_product.json');
      const data: Product[] = await response.json();

      const selectedImages = [
        'earings.png',
        'earings2.png',
        'earings3.png',
        'earings4.png',
        'earings5.png'
      ];

      this.tryOnProducts = selectedImages
        .map(imageName =>
          data.find(product =>
            product.image.toLowerCase().endsWith('/' + imageName.toLowerCase())
          )
        )
        .filter((product): product is Product => !!product);

      if (this.tryOnProducts.length > 0) {
        this.selectedTryOnProduct = this.tryOnProducts[0];
      }

    } catch (error) {
      console.error('Error loading try-on products', error);
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

  // Signature Carousel Methods
  nextSignature() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animationDirection = 'down'; // Next item comes from bottom

    // Halfway point: swap the data
    setTimeout(() => {
      this.currentSignatureIndex = (this.currentSignatureIndex + 1) % this.signatureCategories.length;
    }, 300);

    // End of animation
    setTimeout(() => {
      this.isAnimating = false;
      this.animationDirection = '';
    }, 700);
  }

  prevSignature() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animationDirection = 'up'; // Prev item comes from top

    setTimeout(() => {
      this.currentSignatureIndex = (this.currentSignatureIndex - 1 + this.signatureCategories.length) % this.signatureCategories.length;
    }, 300);

    setTimeout(() => {
      this.isAnimating = false;
      this.animationDirection = '';
    }, 700);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Only handle if it's broadly useful or check if element is in viewport,
    // but for now we'll handle document wide to match requirements.
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.prevSignature();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.nextSignature();
    }
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
    this.tryOnTouchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const touchEndY = event.changedTouches[0].clientY;
    const touchEndX = event.changedTouches[0].clientX;
    const deltaY = this.touchStartY - touchEndY;
    const deltaX = this.tryOnTouchStartX - touchEndX;

    // Vertical swipe for signature carousel
    if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0) {
        this.nextSignature(); // swiped up -> go next
      } else {
        this.prevSignature(); // swiped down -> go prev
      }
    }

    // Horizontal swipe for try-on carousel (mobile)
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        this.nextTryOn(); // swiped left -> go next
      } else {
        this.prevTryOn(); // swiped right -> go prev
      }
    }
  }

  // Try-On Section Methods
  selectTryOnEarring(product: Product) {
    if (this.selectedTryOnProduct?.id === product.id || this.tryOnAnimating) return;

    this.tryOnAnimating = true;

    // Halfway through animation, swap the actual product overlay
    setTimeout(() => {
      this.selectedTryOnProduct = product;
    }, 250); // Matches CSS crossfade timing

    setTimeout(() => {
      this.tryOnAnimating = false;
    }, 500); // Total animation duration
  }

  nextTryOn() {
    if (this.tryOnProducts.length === 0) return;

    // For desktop carousel sliding
    this.tryOnStartIndex = (this.tryOnStartIndex + 1) % this.tryOnProducts.length;

    // On mobile, also update the selected product automatically when swiping
    // We can just rely on the same logic for simplicity if it's one item
    if (window.innerWidth <= 768) {
      this.selectTryOnEarring(this.tryOnProducts[this.tryOnStartIndex]);
    }
  }

  prevTryOn() {
    if (this.tryOnProducts.length === 0) return;

    // For desktop carousel sliding
    this.tryOnStartIndex = (this.tryOnStartIndex - 1 + this.tryOnProducts.length) % this.tryOnProducts.length;

    if (window.innerWidth <= 768) {
      this.selectTryOnEarring(this.tryOnProducts[this.tryOnStartIndex]);
    }
  }
}
