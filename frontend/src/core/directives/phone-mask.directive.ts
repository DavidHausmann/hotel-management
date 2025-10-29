import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[phoneMask]',
  standalone: true,
})
export class PhoneMaskDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event']) onInput(e: Event) {
    const el = e.target as HTMLInputElement;
    let digits = (el.value || '').replace(/\D+/g, '').slice(0, 11);
    if (digits.length > 2 && digits.charAt(2) !== '9') {
    }

    let formatted = digits;
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 2)})${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      formatted = `(${digits.slice(0, 2)})${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      formatted = `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    this.setValue(formatted);
  }

  private setValue(v: string) {
    try {
      this.control.control?.setValue(v, { emitEvent: false });
    } catch (err) {
      const el = (this.control as any).valueAccessor?.element || null;
      if (el) el.value = v;
    }
  }
}
