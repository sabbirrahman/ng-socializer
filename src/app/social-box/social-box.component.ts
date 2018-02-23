// Imports from @angular
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
// Interfaces
import { SocialProfile, SocialPlatforms } from '../lib/socializer.interface';

@Component({
  selector: 'social-box',
  templateUrl: './social-box.component.html',
  styleUrls: ['./social-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialBoxComponent {
  @Output() disconnect = new EventEmitter();
  @Output() connect = new EventEmitter();

  @Input() profile: SocialProfile;
  @Input() type: SocialPlatforms;
  @Input() connected: boolean;
  @Input() status: number;
}
