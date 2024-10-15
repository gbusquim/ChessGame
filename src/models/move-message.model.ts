import { MessageType } from "../enums/message-type.enum";
import { Message } from "./message.model";

export class MoveMessage extends Message {
  constructor (
    public position: string,
    source?: string
  ) {
    super(MessageType.MOVE, source || '');
    this.position = position;
  }
}