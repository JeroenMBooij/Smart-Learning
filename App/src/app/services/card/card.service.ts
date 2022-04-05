import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CREATE } from 'src/app/common/constants/angular.constants';
import { CARD_LEARNING_PHASE } from 'src/app/common/constants/card.constants';
import { CARD_COLLECTION, DECK_COLLECTION, PLAYERCARD_COLLECTION, PLAYER_COLLECTION } from 'src/app/common/constants/collection.constants';
import { DECK_DEFAULT_DEFAULT_EASE_MODIFIER, DECK_DEFAULT_FIRST_LEARNING_INTERVAL, DECK_DEFAULT_INTERVAL_MODIFIER } from 'src/app/common/constants/deck.constants';
import { EDUCATION_PLANNING_UNSCHEDULED } from 'src/app/common/enums/education.enum';
import { ICard } from 'src/app/models/collections/cards/card.model';
import { IPlayerCard } from 'src/app/models/collections/cards/player-card.model';
import { IDeck } from 'src/app/models/collections/decks/deck.interface';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CardService 
{
    constructor(
        private authService: AuthenticationService,
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

        let cardId: string;
        let result = await this.afStore.firestore.runTransaction(async () => 
        {
            let promises = [];

            let cardPromise = this.afStore.collection(DECK_COLLECTION)
                .doc(deckId).collection(CARD_COLLECTION)
                .add(card)
            promises.push(cardPromise);
            
            cardId =  await cardPromise
                .then(document => document.id)
                .catch(error => 
                {
                    if (environment.production == false)
                        console.log(error);

                    return null;
                });
            
             // TODO get users in team
            let teamUserIds = [this.authService.userId.value];

            let playerCard = {} as IPlayerCard;
            for (let userId of teamUserIds)
            {
                playerCard.deckId = deckId;
                playerCard.cardId = cardId;
                playerCard.userId = userId;
                playerCard.phase = CARD_LEARNING_PHASE;

                // TODO configure modifiers
                playerCard.easeModifier = DECK_DEFAULT_DEFAULT_EASE_MODIFIER;

                playerCard.planning = EDUCATION_PLANNING_UNSCHEDULED;

                let pcPromise = this.afStore.collection(DECK_COLLECTION)
                    .doc(deckId).collection(CARD_COLLECTION)
                    .doc(cardId).collection(PLAYERCARD_COLLECTION)
                    .add(playerCard)
                promises.push(pcPromise);
                
                await pcPromise.then(document => document.id)
                    .catch(error => 
                    {
                        if (environment.production == false)
                            console.log(error);

                        return null;
                    });
            }


            const promise = Promise.all(promises);

            return promise;
        })
        .catch((error) => 
        {
            if (environment.production == false)
                console.log(error);
        });

        if (result)
            return cardId;
        else
            return null;
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

    public getDeckPlayerCards(deckId: string): Observable<IPlayerCard[]>
    {
        return this.afStore.collectionGroup<IPlayerCard>(PLAYERCARD_COLLECTION, ref => ref
            .where('deckId', '==', deckId))
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
