import { PlayerId } from "src/enums/player-id.enum";
import { MessageType } from "../enums/message-type.enum";
import { Message } from "./message.model";

export class SetIdMessage extends Message {
  constructor (
    public id: PlayerId
  ) {
    super(MessageType.SETID, '');
    this.id = id;
  }
}