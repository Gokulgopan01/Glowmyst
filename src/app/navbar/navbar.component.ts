import { Component, HostListener, HostBinding } from '@angular/core';
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
  lastScrollY = 0;

  @HostBinding('class.nav-hidden') isHidden = false;

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
    const currentScrollY = window.scrollY;
    
    this.isScrolled = currentScrollY > 20;

    // Hide navbar on scroll down, show on scroll up
    if (currentScrollY > this.lastScrollY && currentScrollY > 150) {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }
    
    this.lastScrollY = currentScrollY;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
