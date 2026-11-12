import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-angular';
import { WhatsappService } from '../services/whatsapp.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  readonly PhoneIcon = Phone;
  readonly MailIcon = Mail;
  readonly MapPinIcon = MapPin;
  readonly ClockIcon = Clock;
  readonly MessageCircleIcon = MessageCircle;
  readonly SendIcon = Send;

  whatsappService = inject(WhatsappService);

  onSendMessage() {
    this.whatsappService.openGeneralChat();
  }
}

