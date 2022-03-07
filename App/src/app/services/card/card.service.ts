import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CREATE } from 'src/app/common/constants/angular.constants';
import { CARD_COLLECTION, DECK_COLLECTION } from 'src/app/common/constants/collection.constants';
import { ICard } from 'src/app/models/collections/cards/card.model';
import { IDeck } from 'src/app/models/collections/decks/deck.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService 
{
    constructor(
        private afStore: AngularFirestore) { }

    
    public async saveCard(deckId: string, card: ICard): Promise<string>
    {
        if(card.id == CREATE)
            return this.addCard(deckId, card);
        else
            return this.updateCard(deckId, card);
    }

    public async updateCardName(deckId: string, cardId: string, cardName: string): Promise<boolean>
    {
        return await this.afStore.collection(DECK_COLLECTION).doc(deckId)
            .collection(CARD_COLLECTION).doc(cardId).update({name: cardName })
            .then(() => true)
            .catch(error =>
            {
                if(environment.production == false)
                    console.log(error);
                
                return false;
            })
    }

    private async addCard(deckId: string, card: ICard): Promise<string>
    {
        delete card.id;
        
        return await this.afStore.collection(DECK_COLLECTION)
            .doc(deckId).collection(CARD_COLLECTION)
            .add(card)
                .then(document => document.id)
                .catch(error => 
                {
                    if (environment.production)
                        console.log(error);

                    return null;
                });
    }

    private async updateCard(deckId: string, card: ICard): Promise<string>
    {   
        let cardId = card.id;
        delete card.id;

        return await this.afStore.collection(DECK_COLLECTION).doc(deckId)
            .collection(CARD_COLLECTION).doc(cardId).update(card)
            .then(() => 
            {
                card.id = cardId;
                return cardId;
            })
            .catch(error =>
            {
                if(environment.production == false)
                    console.log(error);
                
                return null;
            })
    }

    public getDeckCards(deckId: string): Observable<ICard[]>
    {
        return this.afStore.collection<IDeck>(DECK_COLLECTION)
            .doc(deckId)
            .collection<ICard>(CARD_COLLECTION)
            .valueChanges({ idField: 'id'});
    }
    
    public getCard(deckId: string, cardId: string): Observable<ICard>
    {
        return this.afStore
            .collection(DECK_COLLECTION).doc<IDeck>(deckId)
            .collection(CARD_COLLECTION).doc<ICard>(cardId)
            .valueChanges({ idField: 'id'});
    }
}
