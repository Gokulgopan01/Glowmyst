import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-jewellery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './jewellery.component.html',
  styleUrl: './jewellery.component.scss'
})
export class JewelleryComponent {
  categories = [
    { name: 'All', id: 'all', image: 'assets/jewellery/gold.jpg' },
    { name: 'Necklaces', id: 'necklaces', image: 'assets/jewellery/Necklase.jpg' },
    { name: 'Earrings', id: 'earrings', image: 'assets/jewellery/earings.jpg' },
    { name: 'Bangles', id: 'bangles', image: 'assets/jewellery/bangles.jpg' },
    { name: 'Rings', id: 'rings', image: 'assets/jewellery/rings.jpg' },
    { name: 'Bridal', id: 'bridal', image: 'assets/jewellery/bridal.jpg' },
    { name: 'Antique', id: 'antique', image: 'assets/jewellery/antique.jpg' },
    { name: 'Temple', id: 'temple', image: 'assets/jewellery/antique.jpg' },
    { name: 'Diamond', id: 'diamond', image: 'assets/jewellery/diamond.jpg' },
    { name: 'Gold', id: 'gold', image: 'assets/jewellery/gold.jpg' },
    { name: 'Silver', id: 'silver', image: 'assets/jewellery/silver.jpg' }
  ];
}
