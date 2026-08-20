import { Component, HostListener, HostBinding, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Search, ChevronDown, Menu, X, RotateCcw, Gem, ShieldCheck, Truck } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnDestroy {
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

  private routerSub: Subscription;

  constructor(private router: Router) {
    // Auto-close the mobile panel the moment a new route starts loading,
    // so the slide-out plays instead of the page just jumping underneath it.
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

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

  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.setBodyScrollLock(this.isMobileMenuOpen);
  }

  closeMobileMenu() {
    if (!this.isMobileMenuOpen) return;
    this.isMobileMenuOpen = false;
    this.setBodyScrollLock(false);
  }

  /** Prevent the page behind the mobile panel from scrolling while it's open. */
  private setBodyScrollLock(locked: boolean) {
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    document.body.style.overflow = '';
  }
}