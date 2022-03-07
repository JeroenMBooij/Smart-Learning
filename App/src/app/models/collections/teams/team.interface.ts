import { IMedia } from "../media.model";

export interface ITeam
{
    id: string;
    createdAt: Date;
    name: string;
    description: string;
    public: boolean;
    Icon: IMedia;
    ownerId: string;
    adminIds: string[];
    playerIds: string[];
    deckIds: string[];
}