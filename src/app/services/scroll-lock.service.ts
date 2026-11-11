import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollLockService {
  private isLockedSubject = new BehaviorSubject<boolean>(false);
  isLocked$ = this.isLockedSubject.asObservable();

  setLock(locked: boolean): void {
    this.isLockedSubject.next(locked);
  }
}

