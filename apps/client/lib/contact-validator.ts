import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// Comprehensive list of disposable / temporary email domains to prevent burner accounts
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  'tempmail.net',
  'temp-mail.org',
  'temp-mail.io',
  '10minutemail.com',
  '10minutemail.net',
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.org',
  'sharklasers.com',
  'grr.la',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'dispostable.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.org',
  'fakeinbox.com',
  'getairmail.com',
  'generator.email',
  'throwawaymail.com',
  'fakemailgenerator.com',
  'mohmal.com',
  'crazymailing.com',
  'mailcatch.com',
  'mytemp.email',
  'tempr.email',
  'discard.email',
  'discardmail.com',
  'inboxkitten.com',
  'burnermail.io',
  'minutemailbox.com',
  'emailondeck.com',
  'fastmail.fm',
  'luxusmail.org',
  'nada.ltd',
  'getnada.com',
  'dropmail.me',
  'harakirimail.com',
  'maildrop.cc',
  'inboxbear.com',
]);

// Indonesian Telco Carrier Prefixes
export const INDONESIAN_OPERATORS: { name: string; prefixes: string[] }[] = [
  {
    name: 'Telkomsel (kartuHalo, simPATI, KARTU As, by.U)',
    prefixes: [
      '0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853'
    ],
  },
  {
    name: 'Indosat Ooredoo Hutchison (IM3, Mentari)',
    prefixes: [
      '0814', '0815', '0816', '0855', '0856', '0857', '0858'
    ],
  },
  {
    name: 'XL Axiata',
    prefixes: [
      '0817', '0818', '0819', '0859', '0877', '0878'
    ],
  },
  {
    name: 'Axis',
    prefixes: [
      '0831', '0832', '0833', '0838'
    ],
  },
  {
    name: 'Tri (3)',
    prefixes: [
      '0895', '0896', '0897', '0898', '0899'
    ],
  },
  {
    name: 'Smartfren',
    prefixes: [
      '0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'
    ],
  },
];

export interface EmailValidationResult {
  valid: boolean;
  domain: string;
  provider?: string;
  isDisposable: boolean;
  hasMxRecord: boolean;
  error?: string;
}

export interface PhoneValidationResult {
  valid: boolean;
  raw: string;
  normalized: string; // e.g. +628123456789
  formatted: string;  // e.g. +62 812-3456-789
  operator?: string;
  isIndonesian: boolean;
  error?: string;
}

/**
 * Validates an email address via regex, disposable domain blacklist,
 * and live DNS MX record lookup.
 */
export async function validateEmail(email: string): Promise<EmailValidationResult> {
  const trimmed = (email || '').trim().toLowerCase();
  
  // 1. Basic RFC syntax check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!trimmed || !emailRegex.test(trimmed)) {
    return {
      valid: false,
      domain: '',
      isDisposable: false,
      hasMxRecord: false,
      error: 'Format email tidak valid. Contoh: nama@domain.com',
    };
  }

  const [, domain] = trimmed.split('@');
  if (!domain) {
    return {
      valid: false,
      domain: '',
      isDisposable: false,
      hasMxRecord: false,
      error: 'Nama domain email tidak ditemukan.',
    };
  }

  // 2. Check disposable email blacklist
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      domain,
      isDisposable: true,
      hasMxRecord: false,
      error: 'Email sementara / sekali pakai tidak diizinkan. Harap gunakan email aktif asli Anda.',
    };
  }

  // 3. DNS MX Record lookup to confirm the domain actually has an active mail server
  try {
    const mxRecords = await resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return {
        valid: false,
        domain,
        isDisposable: false,
        hasMxRecord: false,
        error: `Domain @${domain} tidak memiliki Mail Server (MX Record) aktif. Email tidak dapat menerima pesan.`,
      };
    }

    // Determine primary exchange provider name if popular
    const primaryExchange = mxRecords[0].exchange.toLowerCase();
    let provider = domain;
    if (primaryExchange.includes('google') || primaryExchange.includes('gmail')) {
      provider = 'Google Mail Server';
    } else if (primaryExchange.includes('outlook') || primaryExchange.includes('microsoft')) {
      provider = 'Microsoft 365 / Outlook';
    } else if (primaryExchange.includes('yahoo')) {
      provider = 'Yahoo Mail Server';
    } else if (primaryExchange.includes('icloud') || primaryExchange.includes('apple')) {
      provider = 'Apple iCloud';
    }

    return {
      valid: true,
      domain,
      provider,
      isDisposable: false,
      hasMxRecord: true,
    };
  } catch (err: any) {
    return {
      valid: false,
      domain,
      isDisposable: false,
      hasMxRecord: false,
      error: `Domain @${domain} tidak terdaftar di server DNS dunia atau tidak memiliki server email aktif.`,
    };
  }
}

/**
 * Validates a WhatsApp phone number.
 * Ensures it's a valid mobile phone number format, checks for legitimate
 * Indonesian operator prefixes, and formats to E.164.
 */
export function validateWhatsAppNumber(phone: string): PhoneValidationResult {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return {
      valid: false,
      raw: phone,
      normalized: '',
      formatted: '',
      isIndonesian: false,
      error: 'Nomor WhatsApp wajib diisi.',
    };
  }

  // Remove non-numeric characters except leading plus
  let cleaned = trimmed.replace(/[^0-9+]/g, '');

  // Convert local 08xx or 628xx to +628xx
  if (cleaned.startsWith('0')) {
    cleaned = '+62' + cleaned.substring(1);
  } else if (cleaned.startsWith('62')) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+')) {
    // If starts with 8 without zero, prepend +62
    if (cleaned.startsWith('8')) {
      cleaned = '+62' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }

  // Indonesian mobile check
  if (cleaned.startsWith('+62')) {
    const nationalNumber = cleaned.replace('+62', '0'); // e.g. 08123456789
    const digitsOnly = nationalNumber.replace(/\D/g, '');

    // Digits count check (Indonesian mobile numbers have 10-13 digits: 08xx-xxxx-xxxx)
    if (digitsOnly.length < 10) {
      return {
        valid: false,
        raw: phone,
        normalized: cleaned,
        formatted: cleaned,
        isIndonesian: true,
        error: 'Nomor WhatsApp terlalu pendek (minimal 10 digit).',
      };
    }

    if (digitsOnly.length > 14) {
      return {
        valid: false,
        raw: phone,
        normalized: cleaned,
        formatted: cleaned,
        isIndonesian: true,
        error: 'Nomor WhatsApp terlalu panjang (maksimal 13-14 digit).',
      };
    }

    // Check 4-digit prefix against registered Indonesian mobile telco operators
    const prefix = digitsOnly.substring(0, 4);
    let matchedOperator = '';

    for (const op of INDONESIAN_OPERATORS) {
      if (op.prefixes.includes(prefix)) {
        matchedOperator = op.name;
        break;
      }
    }

    if (!matchedOperator) {
      return {
        valid: false,
        raw: phone,
        normalized: cleaned,
        formatted: cleaned,
        isIndonesian: true,
        error: `Awalan ${prefix} bukan nomor seluler operator Indonesia yang valid (bukan Telkomsel, Indosat, XL, Tri, Axis, atau Smartfren).`,
      };
    }

    // Nicely format: +62 812-3456-7890
    const rest = digitsOnly.substring(1); // without leading 0
    const part1 = rest.substring(0, 3);   // 812
    const part2 = rest.substring(3, 7);   // 3456
    const part3 = rest.substring(7);      // 7890
    const formatted = `+62 ${part1}-${part2}${part3 ? '-' + part3 : ''}`;

    return {
      valid: true,
      raw: phone,
      normalized: cleaned,
      formatted,
      operator: matchedOperator,
      isIndonesian: true,
    };
  }

  // International phone fallback (must have 10 to 15 digits according to E.164)
  const intlDigits = cleaned.replace(/\D/g, '');
  if (intlDigits.length < 10 || intlDigits.length > 15) {
    return {
      valid: false,
      raw: phone,
      normalized: cleaned,
      formatted: cleaned,
      isIndonesian: false,
      error: 'Format nomor internasional tidak valid (harus 10-15 digit sesuai standar E.164).',
    };
  }

  return {
    valid: true,
    raw: phone,
    normalized: cleaned,
    formatted: cleaned,
    operator: 'Nomor Internasional',
    isIndonesian: false,
  };
}
