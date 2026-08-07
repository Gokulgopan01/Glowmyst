import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Search, ChevronDown, Menu, X, RotateCcw, Gem, ShieldCheck, Truck } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isScrolled = false;
  isMobileMenuOpen = false;

  readonly SearchIcon = Search;
  readonly ChevronDownIcon = ChevronDown;
  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly RotateCcwIcon = RotateCcw;
  readonly GemIcon = Gem;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly TruckIcon = Truck;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
