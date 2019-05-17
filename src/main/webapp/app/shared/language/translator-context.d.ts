/**
 * Holder for tranlation content and locale
 */
declare class TranslatorContext {
  static context: {
    previousLocale: any;
    defaultLocale: any;
    locale: any;
    translations: {};
    renderInnerTextForMissingKeys: boolean;
    missingTranslationMsg: string;
  };
  static registerTranslations(locale: string, translation: any): void;
  static setDefaultLocale(locale: string): void;
  static setMissingTranslationMsg(msg: string): void;
  static setRenderInnerTextForMissingKeys(flag: boolean): void;
  static setLocale(locale: string): void;
}
export default TranslatorContext;
