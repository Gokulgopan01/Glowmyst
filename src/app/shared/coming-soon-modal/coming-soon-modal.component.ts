import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, ArrowRight } from 'lucide-angular';
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
  readonly ArrowRightIcon = ArrowRight;

  /** Drives the graceful exit animation before the modal is actually removed. */
  readonly closing = signal(false);

  /** Floating gold dust particles (styled via --i in SCSS). */
  readonly dust = [1, 2, 3, 4, 5, 6, 7, 8];

  private readonly closeDelayMs = 450;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.comingSoonService.isOpen()) {
      this.close();
    }
  }

  close(): void {
    if (this.closing()) return;

    this.closing.set(true);
    setTimeout(() => {
      this.comingSoonService.close();
      this.closing.set(false);
    }, this.closeDelayMs);
  }

  notifyViaWhatsApp(): void {
    const details = this.comingSoonService.details();
    const message = `Hello Glowmyst, please notify me when your luxury ${details.category || 'Saree'} collection launches!`;
    this.whatsappService.openCustomChat(message);
    this.close();
  }
}