export class Memento<T> {
  private _state: T;

  constructor(state: T) {
    this._state = state;
  }

  public get state(): T {
    return this._state;
  }
}

export class Caretaker<T> {
  private mementos: Array<Memento<T>> = [];
  private index = -1;

  constructor(value: Memento<T>) {
    this.save(value);
  }

  public save(memento: Memento<T>): void {
    if (this.index < this.mementos.length -1) {
      this.mementos.length = this.index + 1;
    }
    this.mementos.push(memento);

    if (this.mementos.length > 30) {
      this.mementos.splice(0, 10);
    }

    this.index = this.mementos.length - 1;
  }

  public getCurrent(): Memento<T> {
    return this.mementos[this.index];
  }

  public undo(): Memento<T> {
    if (this.index > 0) {
      this.index = this.index - 1;
    }
    return this.mementos[this.index];
  }

  public redo() {
    if (this.index >= 0 && this.index <= this.mementos.length - 2) {
      this.index = this.index + 1;
    }
    return this.mementos[this.index];
  }
}


