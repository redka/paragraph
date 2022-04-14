import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Paragraph } from './paragraph';
import { Caretaker, Memento } from './memento';

declare global {
  interface Window {
    Paragraphs: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ParagraphService {
  private paragraphs$: BehaviorSubject<Paragraph[]> = new BehaviorSubject<Paragraph[]>([]);
  private storage = new Caretaker<Array<Paragraph>>(new Memento([]));
  private arrayParagraphs: Paragraph[] = [];

  constructor() {
    const insertParagraph = (p: Paragraph) => {
      this.arrayParagraphs = [...this.arrayParagraphs, p];
      this.saveNewData();
    }

    const deleteParagraph = (id: string) => {
      this.arrayParagraphs = this.arrayParagraphs.filter(item => item.id !== id);
      this.saveNewData();
    }

    const updateParagraph = (id: string, p: Paragraph) => {
      const index = this.arrayParagraphs.findIndex((item: Paragraph) => item.id === id);
      if (index !== -1) {
        this.arrayParagraphs[index] = { ...this.arrayParagraphs[index], ...p };
        this.saveNewData();
      }
    }

    const undoParagraph = () => {
      this.arrayParagraphs = this.storage.undo().state;
      this.paragraphs$.next(this.storage.getCurrent().state);
    }

    const redoParagraph = () => {
      this.arrayParagraphs = this.storage.redo().state;
      this.paragraphs$.next(this.storage.getCurrent().state);
    }

    window.Paragraphs = {
      insert: insertParagraph,
      delete: deleteParagraph,
      update: updateParagraph,
      undo: undoParagraph,
      redo: redoParagraph
    }
  }

  public getParagraphs(): Observable<Paragraph[]> {
    return this.paragraphs$.asObservable();
  }

  private saveNewData (): void {
    this.storage.save(new Memento<Paragraph[]>([...this.arrayParagraphs]));
    this.paragraphs$.next(this.storage.getCurrent().state);
  }

}
