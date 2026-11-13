import { Injectable, signal } from '@angular/core';

export interface ComingSoonDetails {
  title?: string;
  category?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComingSoonService {
  isOpen = signal<boolean>(false);
  details = signal<ComingSoonDetails>({
    title: 'Saree Collection',
    category: 'Sarees',
    message: 'Our handcrafted luxury saree collection is currently being curated with timeless fabrics and artisan embroideries.'
  });

  open(customDetails?: ComingSoonDetails): void {
    if (customDetails) {
      this.details.set({
        title: customDetails.title || 'Saree Collection',
        category: customDetails.category || 'Sarees',
        message: customDetails.message || 'Our handcrafted luxury saree collection is currently being curated with timeless fabrics and artisan embroideries.'
      });
    } else {
      this.details.set({
        title: 'Saree Collection',
        category: 'Sarees',
        message: 'Our handcrafted luxury saree collection is currently being curated with timeless fabrics and artisan embroideries.'
      });
    }
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }
}
