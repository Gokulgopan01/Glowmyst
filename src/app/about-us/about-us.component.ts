import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComingSoonService } from '../services/coming-soon.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  comingSoonService = inject(ComingSoonService);

  openSareeComingSoon(event: Event): void {
    event.preventDefault();
    this.comingSoonService.open();
  }
}

