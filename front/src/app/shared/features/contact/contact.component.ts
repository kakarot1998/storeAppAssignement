import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  template: `
    <form #contactForm="ngForm" (ngSubmit)="onSubmit()">
      <div class="form-field">
        <label for="email">Email</label>
        <input
          pInputText
          type="email"
          id="email"
          name="email"
          [(ngModel)]="contactData.email"
          #email="ngModel"
          required
          [ngModelOptions]="{ updateOn: 'blur' }"
          email
        />
        <div
          *ngIf="email.invalid && email.touched"
          class="error-message"
        >
          L'email est obligatoire et doit être valide.
        </div>
      </div>

      <div class="form-field">
        <label for="message">Message</label>
        <textarea
          pInputTextarea
          id="message"
          name="message"
          [(ngModel)]="contactData.message"
          rows="5"
          required
          maxlength="300"
        ></textarea>
        <div
          *ngIf="contactForm.controls['message']?.invalid && contactForm.controls['message']?.touched"
          class="error-message"
        >
          Le message est obligatoire et doit faire moins de 300 caractères.
        </div>
      </div>

      <div class="flex justify-content-between">
        <p-button type="button" (click)="onCancel()" label="Annuler" severity="help" />
        <p-button
          type="submit"
          [disabled]="contactForm.invalid"
          label="Envoyer"
          severity="success"
        />
      </div>
    </form>
  `,
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, InputTextareaModule],
  encapsulation: ViewEncapsulation.None,
})
export class ContactComponent {
  // The contact data for the form
  @Input() contactData: { email: string; message: string } = {
    email: '',
    message: '',
  };

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ email: string; message: string }>();

  onCancel() {
    this.cancel.emit();
  }
  onSubmit() {
    if (this.contactData.email && this.contactData.message) {
      this.submit.emit(this.contactData);
      alert("Demande de contact envoyée avec succès");
    }
  }
}
