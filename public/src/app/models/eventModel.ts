export class Event {
  HasError: boolean;
  Code: number;
  Message: string;

  constructor(hasError?: boolean, code?: number, message?: string) {
    this.HasError = hasError || false;
    this.Code = code || 0;
    this.Message = message || '';
  }
}
