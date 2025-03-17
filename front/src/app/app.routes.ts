import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";
import { ContactComponent } from "./shared/features/contact/contact.component";
import { CartComponent } from "./shared/features/cart/cart.component";
import { LoginComponent } from "./login/login.component";

export const APP_ROUTES: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  { path: '**', redirectTo: 'login' },
  { path: "", redirectTo: "login", pathMatch: "full" },
];
