export class BaseDTO {
  id?: string;

  constructor(partial: Partial<BaseDTO>) {
    Object.assign(this, partial);
  }
}
