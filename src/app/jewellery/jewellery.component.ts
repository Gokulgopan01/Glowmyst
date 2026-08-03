import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Filter, ChevronDown, LayoutGrid, List } from 'lucide-angular';

@Component({
  selector: 'app-jewellery',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './jewellery.component.html',
  styleUrl: './jewellery.component.scss'
})
export class JewelleryComponent {
  readonly FilterIcon = Filter;
  readonly ChevronDownIcon = ChevronDown;
  readonly GridIcon = LayoutGrid;
  readonly ListIcon = List;

  currentView: 'grid' | 'list' = 'grid';

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
