import Message from "../Message.model";

export default class MessageDTO {

    private readonly content: string;
    private readonly username: string;
    private readonly createdAt: string;

    constructor(message: Message) {
        this.content = message.content;
        this.username = message.username;
        this.createdAt = message.createdAt;
    }

    public static build(message: Message): MessageDTO {
        return new MessageDTO(message);
    }
}
