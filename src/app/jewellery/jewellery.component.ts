import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Filter, ChevronDown, LayoutGrid, List, ShieldCheck, Award, Package, Lock, ChevronLeft, ChevronRight } from 'lucide-angular';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge: string;
}

@Component({
  selector: 'app-jewellery',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
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
  isCategoryOpen = true;
  isPriceOpen = true;
  isMaterialOpen = true;
  isOccasionOpen = true;

  // Filter selections
  selectedCategory = 'All Jewellery';

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
    { name: 'All Jewellery', count: 156 },
    { name: 'Necklaces', count: 32 },
    { name: 'Earrings', count: 28 },
    { name: 'Bangles', count: 21 },
    { name: 'Rings', count: 18 },
    { name: 'Bridal', count: 15 },
    { name: 'Antique', count: 12 },
    { name: 'Temple', count: 10 },
    { name: 'Diamond', count: 8 },
    { name: 'Gold', count: 7 },
    { name: 'Silver', count: 5 }
  ];

  materials = ['Gold', 'Diamond', 'Kundan', 'Polki', 'Silver', 'Rose Gold', 'White Gold'];
  occasions = ['Daily Wear', 'Office Wear', 'Party Wear', 'Wedding', 'Festive'];

  ngOnInit() {
    this.http.get<Product[]>('assets/Products_json/jeweller_product.json').subscribe(data => {
      this.allProducts = data;
      this.totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);
      this.updatePagination();
      this.updateDisplayedProducts();
      
      // Update the total count dynamically for "All Jewellery" if needed, though sidebar count is hardcoded right now.
      // this.sidebarCategories[0].count = this.allProducts.length;
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
    const element = document.querySelector('.toolbar-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  updateDisplayedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.products = this.allProducts.slice(startIndex, endIndex);
  }

  updatePagination() {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1, '...', this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
      } else {
        pages.push(1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', this.totalPages);
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

