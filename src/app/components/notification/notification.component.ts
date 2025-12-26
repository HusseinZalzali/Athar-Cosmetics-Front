import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications" 
        class="notification"
        [class.success]="notification.type === 'success'"
        [class.error]="notification.type === 'error'"
        [class.warning]="notification.type === 'warning'"
        [class.info]="notification.type === 'info'"
        (click)="remove(notification.id)"
      >
        <div class="notification-icon">
          <span *ngIf="notification.type === 'success'">✓</span>
          <span *ngIf="notification.type === 'error'">✕</span>
          <span *ngIf="notification.type === 'warning'">⚠</span>
          <span *ngIf="notification.type === 'info'">ℹ</span>
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <button class="notification-close" (click)="remove(notification.id); $event.stopPropagation()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      pointer-events: none;
    }

    .notification {
      background: white;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      padding: 1rem 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      cursor: pointer;
      pointer-events: auto;
      animation: slideInRight 0.3s ease-out;
      border-left: 4px solid;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateX(-4px);
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
      }

      &.success {
        border-left-color: var(--success);
        
        .notification-icon {
          color: var(--success);
        }
      }

      &.error {
        border-left-color: var(--error);
        
        .notification-icon {
          color: var(--error);
        }
      }

      &.warning {
        border-left-color: var(--warning);
        
        .notification-icon {
          color: var(--warning);
        }
      }

      &.info {
        border-left-color: var(--primary);
        
        .notification-icon {
          color: var(--primary);
        }
      }
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-icon {
      font-size: 1.5rem;
      font-weight: bold;
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.05);
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
      color: var(--text-primary);
    }

    .notification-message {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .notification-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: color 0.2s ease;

      &:hover {
        color: var(--text-primary);
      }
    }

    @media (max-width: 768px) {
      .notification-container {
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  remove(id: number): void {
    this.notificationService.remove(id);
  }
}

