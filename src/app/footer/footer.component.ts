import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Lock,
  ArrowRight
} from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly TruckIcon = Truck;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly RotateCcwIcon = RotateCcw;
  readonly SparklesIcon = Sparkles;
  readonly PhoneIcon = Phone;
  readonly MailIcon = Mail;
  readonly MapPinIcon = MapPin;
  readonly InstagramIcon = Instagram;
  readonly FacebookIcon = Facebook;
  readonly YoutubeIcon = Youtube;
  readonly MessageCircleIcon = MessageCircle;
  readonly LockIcon = Lock;
  readonly ArrowRightIcon = ArrowRight;

  currentYear: number = new Date().getFullYear();
  newsletterEmail: string = '';
  isSubscribed: boolean = false;

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

