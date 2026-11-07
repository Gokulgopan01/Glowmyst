import { Component, OnInit, inject, Directive, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Filter, ChevronDown, LayoutGrid, List, ShieldCheck, Award, Package, Lock, ChevronLeft, ChevronRight, Eye, ArrowDownUp, ShoppingBag, RotateCcw, X, Star, Check, Sparkles } from 'lucide-angular';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge: string;
  OCCASION?: string;
}

@Directive({
  selector: '[appFadeIn]',
  standalone: true
})
export class FadeInDirective implements OnInit, OnDestroy {
  private observer: IntersectionObserver | undefined;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.el.nativeElement.classList.add('in-view');
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

@Component({
  selector: 'app-jewellery',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule, FadeInDirective],
  templateUrl: './jewellery.component.html',
  styleUrl: './jewellery.component.scss'
})
export class JewelleryComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);

  readonly FilterIcon = Filter;
  readonly ChevronDownIcon = ChevronDown;
  readonly GridIcon = LayoutGrid;
  readonly ListIcon = List;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly AwardIcon = Award;
  readonly PackageIcon = Package;
  readonly LockIcon = Lock;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly EyeIcon = Eye;
  readonly ArrowDownUpIcon = ArrowDownUp;
  readonly ShoppingBagIcon = ShoppingBag;
  readonly RotateCcwIcon = RotateCcw;
  readonly XIcon = X;
  readonly StarIcon = Star;
  readonly CheckIcon = Check;
  readonly SparklesIcon = Sparkles;

  currentView: 'grid' | 'list' = 'grid';
  allProducts: Product[] = [];
  products: Product[] = [];

  // Dropdown states
  isSortDropdownOpen = false;
  sortOptions: string[] = ['Popular', 'New Arrivals', 'Price: Low to High', 'Price: High to Low'];

  // Pagination
  currentPage = 1;
  itemsPerPage = 16;
  totalPages = 1;
  pages: (number | string)[] = [];

  // Accordion states
  isCategoryOpen = true;
  isPriceOpen = true;
  isMaterialOpen = true;
  isOccasionOpen = true;
  isSortOpen = true;

  // Filter selections
  selectedCategory = 'All Jewellery';
  minPrice = 0;
  maxPrice = 2000;
  selectedOccasions: string[] = [];
  currentSort = 'Popular';

  // Mobile filter panel
  isMobileFilterOpen = false;

  categories = [
    { name: 'All', id: 'all', image: 'assets/jewellery/gold.png' },
    { name: 'Necklaces', id: 'necklaces', image: 'assets/jewellery/Necklase.png' },
    { name: 'Earrings', id: 'earrings', image: 'assets/jewellery/earings.jpg' },
    { name: 'Combo Set', id: 'Combo Set', image: 'assets/jewellery/bangles.jpg' }
  ];

  sidebarCategories = [
    { name: 'All Jewellery', count: 0 },
    { name: 'Necklaces', count: 0 },
    { name: 'Earrings', count: 0 },
    { name: 'Combo Set', count: 0 }
  ];

  materials = ['Gold', 'Diamond', 'Kundan', 'Polki', 'Silver', 'Rose Gold', 'White Gold'];
  occasions = ['Daily Wear', 'Office Wear', 'Party Wear', 'Wedding', 'Festive'];

  ngOnInit() {
    this.http.get<Product[]>('assets/Products_json/jeweller_product.json').subscribe(data => {
      this.allProducts = data;
      this.totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);
      this.updatePagination();
      this.updateDisplayedProducts();
      this.updateCategoryCounts();
    });
  }

  updateCategoryCounts() {
    this.sidebarCategories.forEach(cat => {
      if (cat.name === 'All Jewellery') {
        cat.count = this.allProducts.length;
      } else {
        cat.count = this.allProducts.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
      }
    });
  }

  changePage(page: number | string) {
    if (page === '...' || typeof page === 'string') return;
    this.currentPage = page;
    this.updateDisplayedProducts();
    this.updatePagination();
    this.scrollToProducts();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
      this.updatePagination();
      this.scrollToProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
      this.updatePagination();
      this.scrollToProducts();
    }
  }

  private scrollToProducts() {
    const element = document.querySelector('.listing-section');
    if (element) {
      // Add a slight delay to allow the DOM to render the new products before scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  onFilterChange() {
    this.currentPage = 1;
    this.updateDisplayedProducts();
    this.updatePagination();
  }

  toggleOccasion(occ: string, event: any) {
    if (event.target.checked) {
      this.selectedOccasions.push(occ);
    } else {
      this.selectedOccasions = this.selectedOccasions.filter(o => o !== occ);
    }
    this.onFilterChange();
  }

  toggleSortDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isSortDropdownOpen = !this.isSortDropdownOpen;
  }

  selectSort(option: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.currentSort = option;
    this.isSortDropdownOpen = false;
    this.currentPage = 1;
    this.updateDisplayedProducts();
    this.updatePagination();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isSortDropdownOpen) {
      const target = event.target as HTMLElement;
      if (!target.closest('.sort-dropdown')) {
        this.isSortDropdownOpen = false;
      }
    }
  }

  onSortChange(event: any) {
    this.currentSort = event.target.value;
    this.currentPage = 1;
    this.updateDisplayedProducts();
    this.updatePagination();
  }

  updateDisplayedProducts() {
    let filtered = this.allProducts.filter(p => {
      const matchCategory = this.selectedCategory === 'All Jewellery' || p.category.toLowerCase() === this.selectedCategory.toLowerCase();
      const matchPrice = p.price >= this.minPrice && p.price <= this.maxPrice;
      const matchOccasion = this.selectedOccasions.length === 0 || (p.OCCASION && this.selectedOccasions.includes(p.OCCASION));
      return matchCategory && matchPrice && matchOccasion;
    });

    if (this.currentSort === 'Price: Low to High') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.currentSort === 'Price: High to Low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.currentSort === 'New Arrivals') {
      filtered.sort((a, b) => {
        const isNewA = a.badge === 'NEW' ? 1 : 0;
        const isNewB = b.badge === 'NEW' ? 1 : 0;
        if (isNewB !== isNewA) return isNewB - isNewA;
        return b.id - a.id;
      });
    } else if (this.currentSort === 'Popular') {
      filtered.sort((a, b) => {
        const score = (badge?: string) => {
          if (!badge) return 0;
          const upper = badge.toUpperCase();
          if (upper === 'BESTSELLER') return 4;
          if (upper === 'POPULAR') return 3;
          if (upper === 'HOT' || upper === 'TRENDING') return 2;
          return 0;
        };
        const diff = score(b.badge) - score(a.badge);
        return diff !== 0 ? diff : a.id - b.id;
      });
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage) || 1;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.products = filtered.slice(startIndex, endIndex);
  }

  updatePagination() {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 3) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 2) {
        pages.push(1, 2, 3, '...', this.totalPages);
      } else if (this.currentPage >= this.totalPages - 1) {
        pages.push(1, '...', this.totalPages - 2, this.totalPages - 1, this.totalPages);
      } else {
        pages.push(1, '...', this.currentPage, '...', this.totalPages);
      }
    }
    this.pages = pages;
  }

  get currentRangeStart(): number {
    return this.allProducts.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get currentRangeEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.allProducts.length);
  }

  toggleMobileFilter() {
    this.isMobileFilterOpen = !this.isMobileFilterOpen;
    if (this.isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  clearAllFilters() {
    this.selectedCategory = 'All Jewellery';
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.selectedOccasions = [];
    this.currentSort = 'Popular';
    this.isSortDropdownOpen = false;
    this.onFilterChange();
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }
}

