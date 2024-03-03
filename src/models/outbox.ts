export interface Outbox {
  id: number;
  subject: string;
  payload: Record<string, any>;
  transactionId: string;
  resourceId?: string;
}

export class OutboxModel implements Outbox {
  id: number;
  subject: string;
  payload: Record<string, any>;
  transactionId: string;
  resourceId?: string;

  constructor(id: number, subject: string, payload: Record<string, any>, transactionId: string, resourceId?: string) {
    this.id = id;
    this.subject = subject;
    this.payload = payload;
    this.transactionId = transactionId;
    this.resourceId = resourceId;
  }
}
