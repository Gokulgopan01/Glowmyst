import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, Sparkles, Bell, ArrowRight } from 'lucide-angular';
import { ComingSoonService } from '../../services/coming-soon.service';
import { WhatsappService } from '../../services/whatsapp.service';

@Component({
  selector: 'app-coming-soon-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './coming-soon-modal.component.html',
  styleUrl: './coming-soon-modal.component.scss'
})
export class ComingSoonModalComponent {
  comingSoonService = inject(ComingSoonService);
  whatsappService = inject(WhatsappService);

  readonly XIcon = X;
  readonly SparklesIcon = Sparkles;
  readonly BellIcon = Bell;
  readonly ArrowRightIcon = ArrowRight;

  close(): void {
    this.comingSoonService.close();
  }

  notifyViaWhatsApp(): void {
    const details = this.comingSoonService.details();
    const message = `Hello Glowmyst, please notify me when your luxury ${details.category || 'Saree'} collection launches!`;
    this.whatsappService.openCustomChat(message);
    this.close();
  }
}
