import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { CartService } from "app/cart/data-access/cart.service";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-cart",
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <h2>Your Cart ({{ cartService.getCartCount() }} items)</h2>
    <div *ngIf="cart().length > 0; else emptyCart">
      <div *ngFor="let product of cart()" class="cart-item">
  <img [src]="product.image" alt="{{ product.name }}" width="100" height="100">
  <div class="details">
    <h3>{{ product.name }}</h3>
    <p>Price: {{ product.price | currency }}</p>
    <p>Quantity: {{ product.quantity }}</p>
    <button pButton icon="pi pi-trash" class="p-button-danger" (click)="removeFromCart(product.id)">Remove</button>
  </div>
</div>
    <div class="button">
<button pButton label="Clear Cart" icon="pi pi-times" class="p-button-warning clear-cart-btn" (click)="clearCart()"></button>
</div>
    </div>
    <ng-template #emptyCart>
      <p>Your cart is empty.</p>
    </ng-template>
  `,
  styleUrls: ['./cart.component.css'],
  standalone: true,
})
export class CartComponent {
  public readonly cartService = inject(CartService);
  public readonly cart = this.cartService.cart;

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
