import { Component, OnInit, inject, Directive, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Filter, ChevronDown, LayoutGrid, List, ShieldCheck, Award, Package, Lock, ChevronLeft, ChevronRight, Eye, ArrowDownUp, ShoppingBag, RotateCcw, Star, Check } from 'lucide-angular';

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
  selector: 'app-saree',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule, FadeInDirective],
  templateUrl: './saree.component.html',
  styleUrl: './saree.component.scss'
})
export class SareeComponent implements OnInit {
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
  readonly StarIcon = Star;
  readonly CheckIcon = Check;

  currentView: 'grid' | 'list' = 'grid';
  allProducts: Product[] = [];
  products: Product[] = [];

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
  selectedCategory = 'All Sarees';
  minPrice = 0;
  maxPrice = 5000;
  selectedOccasions: string[] = [];
  currentSort = 'Popular';

  // Mobile filter panel
  isMobileFilterOpen = false;

  categories = [
    { name: 'All', id: 'all', image: 'assets/jewellery/gold.png' },
    { name: 'Silk', id: 'silk', image: 'assets/jewellery/gold.png' },
    { name: 'Banarasi', id: 'banarasi', image: 'assets/jewellery/gold.png' },
    { name: 'Organza', id: 'organza', image: 'assets/jewellery/gold.png' },
    { name: 'Georgette', id: 'georgette', image: 'assets/jewellery/gold.png' },
    { name: 'Designer', id: 'designer', image: 'assets/jewellery/gold.png' },
    { name: 'Chiffon', id: 'chiffon', image: 'assets/jewellery/gold.png' },
    { name: 'Cotton', id: 'cotton', image: 'assets/jewellery/gold.png' }
  ];

  sidebarCategories = [
    { name: 'All Sarees', count: 0 },
    { name: 'Silk Sarees', count: 0 },
    { name: 'Banarasi Sarees', count: 0 },
    { name: 'Organza Sarees', count: 0 },
    { name: 'Georgette Sarees', count: 0 },
    { name: 'Designer Sarees', count: 0 },
    { name: 'Chiffon Sarees', count: 0 },
    { name: 'Cotton Sarees', count: 0 },
    { name: 'Traditional Sarees', count: 0 },
    { name: 'Printed Sarees', count: 0 },
    { name: 'Chanderi Sarees', count: 0 },
    { name: 'Satin Sarees', count: 0 },
    { name: 'Tissue Sarees', count: 0 },
    { name: 'Party Wear Sarees', count: 0 },
    { name: 'Bridal Sarees', count: 0 },
    { name: 'Zari Sarees', count: 0 },
    { name: 'Crepe Sarees', count: 0 }
  ];

  materials = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Organza', 'Satin', 'Crepe', 'Tissue'];
  occasions = ['Daily Wear', 'Office Wear', 'Party Wear', 'Wedding', 'Festive'];

  ngOnInit() {
    this.http.get<Product[]>('assets/Products_json/saree_product.json').subscribe(data => {
      this.allProducts = data;
      this.totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);
      this.updatePagination();
      this.updateDisplayedProducts();
      this.updateCategoryCounts();
    });
  }

  updateCategoryCounts() {
    this.sidebarCategories.forEach(cat => {
      if (cat.name === 'All Sarees') {
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
      }, 0);
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

  onSortChange(event: any) {
    this.currentSort = event.target.value;
    this.currentPage = 1;
    this.updateDisplayedProducts();
    this.updatePagination();
  }

  updateDisplayedProducts() {
    let filtered = this.allProducts.filter(p => {
      const matchCategory = this.selectedCategory === 'All Sarees' || p.category.toLowerCase() === this.selectedCategory.toLowerCase();
      const matchPrice = p.price >= this.minPrice && p.price <= this.maxPrice;
      const matchOccasion = this.selectedOccasions.length === 0 || (p.OCCASION && this.selectedOccasions.includes(p.OCCASION));
      return matchCategory && matchPrice && matchOccasion;
    });

    if (this.currentSort === 'Price: Low to High') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.currentSort === 'Price: High to Low') {
      filtered.sort((a, b) => b.price - a.price);
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
    this.selectedCategory = 'All Sarees';
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.selectedOccasions = [];
    this.currentSort = 'Popular';
    this.onFilterChange();
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }
}

