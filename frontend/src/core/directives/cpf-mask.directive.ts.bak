import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[cpfMask]',
  standalone: true,
})
export class CpfMaskDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event']) onInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const digits = (el.value || '').replace(/\D+/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 9) {
      formatted = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (digits.length > 6) {
      formatted = digits.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (digits.length > 3) {
      formatted = digits.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    this.setValue(formatted);
  }

  private setValue(v: string) {
    try {
      this.control.control?.setValue(v, { emitEvent: false });
    } catch (err) {
      // fallback: directly set native value
      const el = (this.control as any).valueAccessor?.element || null;
      if (el) el.value = v;
    }
  }
}
