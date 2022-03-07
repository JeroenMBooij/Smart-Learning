import { IMedia } from "../media.model";
import { ICard } from "./card.model";

export interface ICustomCard extends ICard
{
    frontHtml: string;
    backHtml: string;
    css: string;
    javascript: string;
    images: IMedia[];
}