import { MessageType } from "../enums/message-type.enum";

export class Message {
  constructor(
    public type: MessageType,
    public source?: string
  ) {
    this.type = type;
    this.source = source || '';
  }
}