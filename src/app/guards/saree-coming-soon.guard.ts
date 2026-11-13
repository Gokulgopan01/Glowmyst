import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ComingSoonService } from '../services/coming-soon.service';

export const sareeComingSoonGuard: CanActivateFn = () => {
  const comingSoonService = inject(ComingSoonService);
  comingSoonService.open({
    title: 'Saree Collection',
    category: 'Sarees',
    message: 'Our handcrafted luxury saree collection is currently being curated with timeless fabrics and royal weaves. Launching very soon!'
  });
  return false;
};
