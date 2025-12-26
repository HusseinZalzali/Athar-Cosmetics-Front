import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor() {
    const savedLang = localStorage.getItem('language') || 'en';
    this.currentLanguageSubject.next(savedLang);
  }

  setLanguage(lang: 'en' | 'ar'): void {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }
}




