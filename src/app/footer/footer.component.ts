import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComingSoonService } from '../services/coming-soon.service';
import { WhatsappService } from '../services/whatsapp.service';
import {
  LucideAngularModule,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ChevronRight,
  MessageCircle
} from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly PhoneIcon = Phone;
  readonly MailIcon = Mail;
  readonly MapPinIcon = MapPin;
  readonly InstagramIcon = Instagram;
  readonly FacebookIcon = Facebook;
  readonly YoutubeIcon = Youtube;
  readonly ChevronRightIcon = ChevronRight;
  readonly MessageCircleIcon = MessageCircle;

  currentYear: number = new Date().getFullYear();
  newsletterEmail: string = '';
  isSubscribed: boolean = false;
  comingSoonService = inject(ComingSoonService);
  whatsappService = inject(WhatsappService);

  openSareeComingSoon(event: Event): void {
    event.preventDefault();
    this.comingSoonService.open();
  }

  onSubscribe(event: Event) {
    event.preventDefault();
    if (this.newsletterEmail && this.newsletterEmail.includes('@')) {
      this.isSubscribed = true;
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
