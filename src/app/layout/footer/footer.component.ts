import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-logo" style="color: var(--accent); font-family: serif; letter-spacing: 2px;">ATHAR COSMETICS</h3>
            <p style="color: var(--text-light);">{{ currentLang === 'ar' ? 'علامة تجارية فاخرة للعناية بالجسم' : 'Premium body care brand' }}</p>
          </div>
          
          <div class="footer-section">
            <h4>{{ currentLang === 'ar' ? 'روابط سريعة' : 'Quick Links' }}</h4>
            <ul>
              <li><a routerLink="/">{{ currentLang === 'ar' ? 'الرئيسية' : 'Home' }}</a></li>
              <li><a routerLink="/shop">{{ currentLang === 'ar' ? 'المتجر' : 'Shop' }}</a></li>
              <li><a routerLink="/about">{{ currentLang === 'ar' ? 'من نحن' : 'About' }}</a></li>
              <li><a routerLink="/contact">{{ currentLang === 'ar' ? 'اتصل بنا' : 'Contact' }}</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>{{ currentLang === 'ar' ? 'اتصل بنا' : 'Contact Us' }}</h4>
            <p style="color: var(--text-light);">📞 81809643</p>
            <p style="color: var(--text-light);">✉️ <a href="mailto:atharcosmetics.lb@gmail.com" style="color: var(--text-light); text-decoration: none;">atharxosmetics.lb&#64;gmail.com</a></p>
          </div>

          <div class="footer-section">
            <h4>{{ currentLang === 'ar' ? 'تابعنا' : 'Follow Us' }}</h4>
            <div class="social-links">
              <a href="https://www.instagram.com/atharcosmetics.lb/" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">📷</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Athar Cosmetics. {{ currentLang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved' }}.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-gradient);
      border-top: 2px solid var(--accent);
      padding: 3rem 0 1.5rem;
      margin-top: 4rem;
      color: var(--text-light);
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h3, .footer-section h4 {
      color: var(--accent);
      margin-bottom: 1rem;
      text-shadow: 0 1px 3px rgba(199, 161, 90, 0.2);
    }

    .footer-section ul {
      list-style: none;
      
      li {
        margin-bottom: 0.5rem;
        
        a {
          color: var(--text-light);
          transition: color 0.3s ease;
          
          &:hover {
            color: var(--accent);
          }
        }
      }
    }

    .social-links {
      display: flex;
      gap: 1rem;
      
      .social-icon {
        font-size: 1.5rem;
        transition: all 0.3s ease;
        filter: brightness(0) invert(1);
        
        &:hover {
          transform: scale(1.2);
          filter: brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(30deg);
        }
      }
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(199, 161, 90, 0.3);
      color: var(--text-light);
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .footer {
        padding: 2rem 0 1rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }

      .footer-section {
        h3, h4 {
          font-size: 1.1rem;
        }

        ul {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
      }

      .social-links {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .footer {
        padding: 1.5rem 0 1rem;
      }

      .footer-content {
        gap: 1.5rem;
      }

      .footer-bottom {
        padding-top: 1.5rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class FooterComponent {
  currentLang = 'en';
  currentYear = new Date().getFullYear();

  constructor(private languageService: LanguageService) {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }
}

