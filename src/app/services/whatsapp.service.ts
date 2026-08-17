import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private whatsappNumber = '919072239489';

  buyProduct(product: any): void {

    const productUrl = `${window.location.origin}/product/${product.id}`;

    const message = `
Hi, I am interested in buying this product.

Product: ${product.name}
Price: ₹${product.price}
Product ID: ${product.id}

Product Link:
${productUrl}

I would like to place an order for this product.
    `.trim();

    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  }
}
