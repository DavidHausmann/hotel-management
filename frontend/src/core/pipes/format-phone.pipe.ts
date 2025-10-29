import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats phone numbers in a forgiving way.
 * Accepts inputs like:
 * - digits only (10 or 11 digits)
 * - variants with partial punctuation
 * Outputs:
 * - (DD)9XXXX-XXXX for 11-digit numbers
 * - (DD)XXXX-XXXX for 10-digit numbers
 * - original trimmed string otherwise
 */
@Pipe({
  name: 'formatPhone',
  standalone: true,
})
export class FormatPhonePipe implements PipeTransform {
  transform(value: unknown): string {
    if (value === null || value === undefined) return '';
    const raw = String(value).trim();
    if (!raw) return '';

    const digits = raw.replace(/\D+/g, '');

    if (digits.length === 11) {
      // (DD) 9XXXX-XXXX (space after DDD)
      return digits.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4');
    }

    if (digits.length === 10) {
      // (DD) XXXX-XXXX (space after DDD)
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    // If digits length is other, but raw contains parentheses only like (DD)XXXXXXXX
    const parenOnly = raw.replace(/[0-9\s\-\.]/g, '');
    if (parenOnly === '()' || parenOnly === '') {
      // try a best-effort grouping of digits
      if (digits.length >= 8 && digits.length <= 11) {
        // try to format as above based on length
        return this.transform(digits);
      }
    }

    // Fallback: return trimmed original
    return raw;
  }
}
