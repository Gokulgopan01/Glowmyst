import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fold-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span #container class="fold-text-container" [style.perspective.px]="perspective">
      <!-- We split the text into words or chars based on splitBy -->
      <span *ngFor="let item of parsedItems; let i = index"
            class="fold-item"
            [class.fold-char]="splitBy === 'char'"
            [class.fold-word]="splitBy === 'word'"
            [class.visible]="isVisible"
            [style.transition-duration.s]="duration"
            [style.transition-delay.s]="(i * stagger) + staggerOffset"
            [style.transform-origin]="hinge">
        <ng-container *ngIf="item === ' '; else textNode">&nbsp;</ng-container>
        <ng-template #textNode>{{ item }}</ng-template>
        
        <!-- Crease shading effect if requested -->
        <span *ngIf="creaseShading && creaseShading > 0" 
              class="crease-shading"
              [style.opacity]="isVisible ? 0 : creaseShading"
              [style.transition-duration.s]="duration"
              [style.transition-delay.s]="(i * stagger) + staggerOffset">
        </span>
      </span>
    </span>
  `,
  styles: [`
    .fold-text-container {
      display: inline-block;
    }
    
    .fold-item {
      display: inline-block;
      position: relative;
      opacity: 0;
      transform: rotateX(-90deg); /* Default hinge top */
      transform-style: preserve-3d;
      transition-property: transform, opacity;
      transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1); /* similar to power3.out */
      backface-visibility: hidden;
    }

    .fold-item.visible {
      opacity: 1;
      transform: rotateX(0deg);
    }

    .fold-char {
      white-space: pre;
    }

    .fold-word {
      margin-right: 0.25em; /* roughly a space */
    }

    .crease-shading {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(0, 0, 0, 1);
      pointer-events: none;
      transition-property: opacity;
      transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    }
  `]
})
export class FoldTextComponent implements OnInit, AfterViewInit {
  @Input() text: string = '';
  @Input() splitBy: 'char' | 'word' = 'char';
  @Input() hinge: 'top' | 'bottom' = 'top';
  @Input() trigger: 'mount' | 'scroll' = 'mount';
  @Input() duration: number = 0.65;
  @Input() stagger: number = 0.045;
  @Input() staggerOffset: number = 0; /* for chaining multiple components */
  @Input() perspective: number = 700;
  @Input() creaseShading: number = 0; /* e.g. 0.55 for 55% opacity shading before unfolding */
  
  parsedItems: string[] = [];
  isVisible = false;
  
  @ViewChild('container') containerRef!: ElementRef;

  ngOnInit() {
    if (this.splitBy === 'char') {
      this.parsedItems = this.text.split('');
    } else {
      this.parsedItems = this.text.split(' ');
    }
  }
  
  ngAfterViewInit() {
    if (this.trigger === 'mount') {
      // Short delay to ensure browser paints initial state before animating
      setTimeout(() => {
        this.isVisible = true;
      }, 50);
    } else if (this.trigger === 'scroll') {
      // Basic Intersection Observer implementation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(this.containerRef.nativeElement);
    }
  }
}
