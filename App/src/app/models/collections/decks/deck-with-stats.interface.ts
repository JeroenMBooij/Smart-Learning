import { IPlayerCard } from '../cards/player-card.model';
import { IDeckWithIcon } from './deck-with-icon.interface';

export interface IDeckWithStats extends IDeckWithIcon
{
    cards: IPlayerCard[];
    cardsDue: number;
    cardsDueTomorrow: number;
}