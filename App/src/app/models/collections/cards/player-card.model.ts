
export interface IPlayerCard
{
    userId: string;
    deckId: string;
    cardId: string;
    easeModifier: number;
    phase: string;
    state: string;
    currentInterval: number;
    planning: string;
    createdAt: Date;
}