import { Injectable, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";

@Injectable({
  providedIn: "root"
})
export class CartService {

  private readonly _cart = signal<Product[]>([]);
  public readonly cart = this._cart.asReadonly();

  addToCart(product: Product): void {
    const existingCart = this._cart();
    const index = existingCart.findIndex(item => item.id === product.id);
  
    if (index !== -1) {
      existingCart[index].quantity! += 1; // Quantity assumed defined
      this._cart.set([...existingCart]);
    } else {
      this._cart.set([...existingCart, { ...product, quantity: 1 }]);
    }
  }
  

  removeFromCart(productId: number): void {
    const updatedCart = this._cart().filter(product => product.id !== productId);
    this._cart.set(updatedCart);
  }

  clearCart(): void {
    this._cart.set([]);
  }

  getCartCount(): number {
    return this._cart().reduce((count, product) => count + product.quantity, 0);
  }
}
