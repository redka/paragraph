import { Component, NgZone, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ParagraphService } from './shared/paragraph.service';
import { Paragraph } from './shared/paragraph';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'paragraph';
  private unsubscribe$: Subject<void> = new Subject();
  paragraphs!: Paragraph[];

  constructor(
    public paragraphService: ParagraphService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.paragraphService.getParagraphs().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data: Paragraph[]) => {
      this.ngZone.run(() => {
        this.paragraphs = data;
      });
    });
  }

}
