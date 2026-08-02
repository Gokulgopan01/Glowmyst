import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-angular';

interface Slide {
  id: number;
  image: string;
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

  @ViewChildren('animatedElement') animatedElements!: QueryList<ElementRef>;
  private observer: IntersectionObserver | null = null;

  slides: Slide[] = [
    { id: 0, image: 'assets/hero_1.png' },
    { id: 1, image: 'assets/hero_2.png' }
  ];

  activeSlide = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.startAutoPlay();
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
          // Optional: stop observing once it's visible if we only want to animate once
          // this.observer?.unobserve(entry.target);
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
