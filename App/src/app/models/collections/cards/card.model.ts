import { IMedia } from "../media.model";

export interface ICard
{
    id: string;
    deckId: string;
    name: string;
    type: string;
    frontFrameSource: string;
    backFrameSource: string;
    createdAt: Date;
    dueDate: Date;
    lastEditedBy: string;
    currentInterval: number;
    state: string;
    easeModifier: number;

    frontHtml: string;
    backHtml: string;
    css: string;
    javascript: string;
    images: IMedia[];
}