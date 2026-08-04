import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Filter, ChevronDown, LayoutGrid, List, ShieldCheck, Award, Package, Lock, ChevronLeft, ChevronRight } from 'lucide-angular';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge: string;
  OCCASION?: string;
}

@Component({
  selector: 'app-jewellery',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  templateUrl: './jewellery.component.html',
  styleUrl: './jewellery.component.scss'
})
export class JewelleryComponent implements OnInit {
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

  currentView: 'grid' | 'list' = 'grid';
  allProducts: Product[] = [];
  products: Product[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 16;
  totalPages = 1;
  pages: (number | string)[] = [];

  // Accordion states
  isCategoryOpen = false;
  isPriceOpen = false;
  isMaterialOpen = false;
  isOccasionOpen = false;

  // Filter selections
  selectedCategory = 'All Jewellery';
  minPrice = 0;
  maxPrice = 200000;
  selectedOccasions: string[] = [];
  currentSort = 'Popular';

  // Mobile filter panel
  isMobileFilterOpen = false;

  categories = [
    { name: 'All', id: 'all', image: 'assets/jewellery/gold.png' },
    { name: 'Necklaces', id: 'necklaces', image: 'assets/jewellery/Necklase.png' },
    { name: 'Earrings', id: 'earrings', image: 'assets/jewellery/earings.jpg' },
    { name: 'Bangles', id: 'bangles', image: 'assets/jewellery/bangles.jpg' },
    { name: 'Rings', id: 'rings', image: 'assets/jewellery/rings.jpg' },
    { name: 'Bridal', id: 'bridal', image: 'assets/jewellery/bridal.png' },
    { name: 'Antique', id: 'antique', image: 'assets/jewellery/antique.png' },
    { name: 'Temple', id: 'temple', image: 'assets/jewellery/antique.png' },
    { name: 'Diamond', id: 'diamond', image: 'assets/jewellery/diamond.jpg' },
    { name: 'Gold', id: 'gold', image: 'assets/jewellery/gold.png' },
    { name: 'Silver', id: 'silver', image: 'assets/jewellery/silver.jpg' }
  ];

  sidebarCategories = [
    { name: 'All Jewellery', count: 0 },
    { name: 'Necklaces', count: 0 },
    { name: 'Earrings', count: 0 },
    { name: 'Bangles', count: 0 },
    { name: 'Rings', count: 0 },
    { name: 'Bridal', count: 0 },
    { name: 'Antique', count: 0 },
    { name: 'Temple', count: 0 },
    { name: 'Diamond', count: 0 },
    { name: 'Gold', count: 0 },
    { name: 'Silver', count: 0 }
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
  }
}

