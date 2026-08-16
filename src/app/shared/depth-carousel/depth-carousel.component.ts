import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DepthCarouselItem {
  image: string;
  title: string;
  subtitle?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-depth-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="depth-carousel-container" [style.perspective.px]="perspective">
      
      <button *ngIf="showControls" class="nav-button prev-btn" (click)="handlePrev()" aria-label="Previous">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div class="carousel-track" [style.height.px]="cardHeight">
        <div *ngFor="let item of items; let i = index"
             class="carousel-item"
             [style.width.px]="cardWidth"
             [style.height.px]="cardHeight"
             [style.border-radius.px]="radius"
             [style]="getCardStyle(i)">
          
          <img [src]="item.image" [alt]="item.title" class="card-image" />
          
          <div class="card-tint" [style.background-color]="tint" [style.opacity]="getTintOpacity(i)"></div>
          
          <div class="card-content" [style.opacity]="getCardOpacity(i)">
            <div class="sig-card-info-text">
              <p class="sig-card-title">{{ item.title }}</p>
              <p *ngIf="item.subtitle" class="sig-card-subtitle">
                {{ item.subtitle }}
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M13 6L19 12L13 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <button *ngIf="showControls" class="nav-button next-btn" (click)="handleNext()" aria-label="Next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .depth-carousel-container {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
    }
    .carousel-track {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
      width: 100%;
    }
    .carousel-item {
      position: absolute;
      top: 0;
      left: 50%;
      transform-origin: center center;
      overflow: hidden;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backface-visibility: hidden;
    }
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .card-tint {
      position: absolute;
      inset: 0;
      pointer-events: none;
      transition: opacity 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .card-content {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 22px 26px;
      background: rgba(8, 8, 8, 0.55);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
      transition: opacity 0.5s ease;
    }
    .sig-card-info-text {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .sig-card-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(22px, 2vw, 27px);
      font-weight: 500;
      color: #fff;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .sig-card-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #C99A45;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sig-card-subtitle .icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }
    .carousel-item:hover .sig-card-subtitle .icon {
      transform: translateX(4px);
    }
    
    .nav-button {
      position: absolute;
      bottom: -70px;
      z-index: 50;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
    }
    .nav-button:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #C99A45;
    }
    .nav-button:active {
      transform: scale(0.94);
    }
    .prev-btn {
      left: calc(50% - 60px); 
    }
    .next-btn {
      right: calc(50% - 60px);
    }
    
    @media (max-width: 768px) {
      .prev-btn { left: calc(50% - 60px); }
      .next-btn { right: calc(50% - 60px); }
    }
  `]
})
export class DepthCarouselComponent implements OnInit, OnDestroy {
  @Input() items: DepthCarouselItem[] = [];
  @Input() cardWidth = 360;
  @Input() cardHeight = 480;
  @Input() radius = 24;
  @Input() tint = '#05060a';
  @Input() depth = 220;
  @Input() spread = 120;
  @Input() tilt = 15;
  @Input() tiltDirection: 'left' | 'right' = 'right';
  @Input() perspective = 1400;
  @Input() visibleCards = 4;
  @Input() falloff = 0.2;
  @Input() blur = 6;
  @Input() duration = 700;
  @Input() ease = 'cubic-bezier(0.165, 0.84, 0.44, 1)';
  @Input() autoplay = false;
  @Input() autoplayDelay = 3200;
  @Input() loop = true;
  @Input() showControls = true;

  @Output() onChange = new EventEmitter<number>();

  activeIndex = 0;
  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  handleNext() {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    } else if (this.loop) {
      this.activeIndex = 0;
    }
    this.emitChange();
    this.resetAutoplay();
  }

  handlePrev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    } else if (this.loop) {
      this.activeIndex = this.items.length - 1;
    }
    this.emitChange();
    this.resetAutoplay();
  }

  private emitChange() {
    this.onChange.emit(this.activeIndex);
  }

  getCardStyle(index: number): any {
    const distance = index - this.activeIndex;
    const absDistance = Math.abs(distance);

    if (absDistance > this.visibleCards) {
      return {
        display: 'none',
        'margin-left.px': -(this.cardWidth / 2)
      };
    }

    const sign = Math.sign(distance);
    const tz = -absDistance * this.depth;
    const tx = distance * this.spread;

    let ry = 0;
    if (this.tiltDirection === 'right') {
      ry = -sign * this.tilt;
    } else {
      ry = sign * this.tilt;
    }

    const zIndex = this.items.length - absDistance;
    const scale = 1 - absDistance * this.falloff;
    const blurAmount = absDistance * this.blur;

    return {
      transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
      'z-index': zIndex,
      filter: `blur(${blurAmount}px)`,
      transition: `transform ${this.duration}ms ${this.ease}, filter ${this.duration}ms ${this.ease}`,
      'margin-left.px': -(this.cardWidth / 2)
    };
  }

  getTintOpacity(index: number): number {
    const distance = Math.abs(index - this.activeIndex);
    if (distance === 0) return 0;
    return Math.min(distance * 0.25, 0.85);
  }

  getCardOpacity(index: number): number {
    const distance = Math.abs(index - this.activeIndex);
    return distance === 0 ? 1 : 0;
  }

  private startAutoplay() {
    this.intervalId = setInterval(() => {
      this.handleNext();
      this.cdr.markForCheck();
    }, this.autoplayDelay);
  }

  private stopAutoplay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private resetAutoplay() {
    if (this.autoplay) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }
}
