import { ICard } from '../cards/card.model';
import { IDeckWithIcon } from './deck-with-icon.interface';

export interface IDeckWithStats extends IDeckWithIcon
{
    cards: ICard[];
    cardsDue: number;
    cardsDueTomorrow: number;
}