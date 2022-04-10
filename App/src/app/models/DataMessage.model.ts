export class DataMessage
{
    constructor(type: string, content: any)
    {
        this.type = type;
        this.content = content;
    }

    public type: string;
    public content: any;
}