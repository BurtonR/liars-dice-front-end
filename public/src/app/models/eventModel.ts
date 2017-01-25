export class Event {
  HasError: boolean;
  Code: number;
  Message: string;

  constructor(obj?: any) {
    this.HasError = obj && obj.HasError || false;
    this.Code = obj && obj.Code || 0;
    this.Message = obj && obj.Message || '';
  }
}
