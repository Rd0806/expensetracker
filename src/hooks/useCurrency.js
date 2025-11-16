import { useState, useEffect } from 'react';

// Currency mapping by country code (ISO 3166-1 alpha-2)
const COUNTRY_CURRENCIES = {
  // Americas
  US: 'USD', // United States
  CA: 'CAD', // Canada
  MX: 'MXN', // Mexico
  BR: 'BRL', // Brazil
  AR: 'ARS', // Argentina
  CL: 'CLP', // Chile
  CO: 'COP', // Colombia
  PE: 'PEN', // Peru
  
  // Europe
  GB: 'GBP', // United Kingdom
  FR: 'EUR', // France
  DE: 'EUR', // Germany
  IT: 'EUR', // Italy
  ES: 'EUR', // Spain
  NL: 'EUR', // Netherlands
  BE: 'EUR', // Belgium
  AT: 'EUR', // Austria
  PT: 'EUR', // Portugal
  IE: 'EUR', // Ireland
  FI: 'EUR', // Finland
  GR: 'EUR', // Greece
  PL: 'PLN', // Poland
  SE: 'SEK', // Sweden
  NO: 'NOK', // Norway
  DK: 'DKK', // Denmark
  CH: 'CHF', // Switzerland
  RU: 'RUB', // Russia
  
  // Asia
  IN: 'INR', // India
  JP: 'JPY', // Japan
  CN: 'CNY', // China
  KR: 'KRW', // South Korea
  SG: 'SGD', // Singapore
  MY: 'MYR', // Malaysia
  TH: 'THB', // Thailand
  ID: 'IDR', // Indonesia
  PH: 'PHP', // Philippines
  VN: 'VND', // Vietnam
  TW: 'TWD', // Taiwan
  HK: 'HKD', // Hong Kong
  
  // Oceania
  AU: 'AUD', // Australia
  NZ: 'NZD', // New Zealand
  
  // Middle East & Africa
  AE: 'AED', // UAE
  SA: 'SAR', // Saudi Arabia
  IL: 'ILS', // Israel
  TR: 'TRY', // Turkey
  ZA: 'ZAR', // South Africa
  EG: 'EGP', // Egypt
  NG: 'NGN', // Nigeria
};

// Default currency fallback
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LOCALE = 'en-US';

export const useCurrency = () => {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to detect user's location and currency
    const detectCurrency = async () => {
      try {
        // Method 1: Use browser's locale (fastest, always available)
        const browserLocale = navigator.language || navigator.userLanguage || DEFAULT_LOCALE;
        const localeParts = browserLocale.split('-');
        const countryCode = localeParts[1]?.toUpperCase() || localeParts[0]?.toUpperCase();
        
        // Get currency from country code
        let detectedCurrency = COUNTRY_CURRENCIES[countryCode] || DEFAULT_CURRENCY;
        let detectedLocale = browserLocale;

        // Method 2: Try to get currency from locale using Intl.DisplayNames (if available)
        try {
          // Some locales have currency info embedded, but we'll rely on country code mapping
          // which is more reliable
        } catch (e) {
          // Fallback to country code mapping
        }
        
        setCurrency(detectedCurrency);
        setLocale(detectedLocale);
        setLoading(false);
      } catch (error) {
        console.error('Error detecting currency:', error);
        setCurrency(DEFAULT_CURRENCY);
        setLocale(DEFAULT_LOCALE);
        setLoading(false);
      }
    };

    detectCurrency();
  }, []);

  // Format currency based on detected locale and currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(0);
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(0)
      .replace(/\d/g, '')
      .trim();
  };

  return {
    currency,
    locale,
    formatCurrency,
    getCurrencySymbol,
    loading,
  };
};

