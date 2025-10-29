import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// CPF utils
export function onlyDigits(value: string | null | undefined): string {
  return (value || '').replace(/\D+/g, '');
}

export function isValidCPF(value: string | null | undefined): boolean {
  const cpf = onlyDigits(value);
  if (!cpf || cpf.length !== 11) return false;
  // reject known invalid CPFs
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calc = (t: number) => {
    let sum = 0;
    for (let i = 0; i < t - 1; i++) {
      sum += parseInt(cpf.charAt(i)) * (t - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const v1 = calc(10);
  const v2 = calc(11);
  return v1 === parseInt(cpf.charAt(9)) && v2 === parseInt(cpf.charAt(10));
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || v === '') return { required: true } as any;
    return isValidCPF(v) ? null : { cpf: { valid: false } };
  };
}

// Phone utils
export const PHONE_REGEX = /^\(\d{2}\)9\d{4}-\d{4}$/;

export function isValidPhone(value: string | null | undefined): boolean {
  if (!value) return false;
  return PHONE_REGEX.test(value);
}

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || v === '') return { required: true } as any;
    return isValidPhone(v) ? null : { phone: { valid: false } };
  };
}
