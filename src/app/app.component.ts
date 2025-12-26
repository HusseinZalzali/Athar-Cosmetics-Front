import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificationComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <app-notification></app-notification>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    main {
      flex: 1;
      padding-top: 80px; /* Account for fixed header */
    }

    @media (max-width: 768px) {
      main {
        padding-top: 70px;
      }
    }

    @media (max-width: 480px) {
      main {
        padding-top: 65px;
      }
    }

    @media (max-width: 360px) {
      main {
        padding-top: 60px;
      }
    }

    /* Landscape orientation adjustments */
    @media (max-width: 896px) and (orientation: landscape) and (max-height: 500px) {
      main {
        padding-top: 55px;
      }
    }
  `]
})
export class AppComponent {}

