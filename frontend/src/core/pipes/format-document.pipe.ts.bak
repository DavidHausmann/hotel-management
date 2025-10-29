import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a document string (CPF or CNPJ) in a forgiving way.
 * - If input contains only digits and length === 11 -> CPF: XXX.XXX.XXX-XX
 * - If length === 14 -> CNPJ: XX.XXX.XXX/0001-XX (common CNPJ format)
 * - Otherwise returns a trimmed, collapsed-whitespace original string.
 */
@Pipe({
  name: 'formatDocument',
  standalone: true,
})
export class FormatDocumentPipe implements PipeTransform {
  transform(value: unknown): string {
    if (value === null || value === undefined) return '';
    const raw = String(value).trim();
    if (!raw) return '';

    // keep only digits for the decision/format step
    const digits = raw.replace(/\D+/g, '');

    if (digits.length === 11) {
      // CPF: XXX.XXX.XXX-XX
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    if (digits.length === 14) {
      // CNPJ: XX.XXX.XXX/XXXX-XX
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    // Fallback: if it already contains punctuation, collapse multiple spaces and return
    return raw.replace(/\s+/g, ' ');
  }
}
