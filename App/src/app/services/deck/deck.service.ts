import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CATEGORY_COLLECTION, DECK_COLLECTION } from 'src/app/common/constants/collection.constants';
import { ICategory } from 'src/app/models/collections/decks/category.interface';
import { IDeckIdentity } from 'src/app/models/collections/decks/deck-identity.interface';
import { IDeckWithIcon } from 'src/app/models/collections/decks/deck-with-icon.interface';
import { IDeckWithStats } from 'src/app/models/collections/decks/deck-with-stats.interface';
import { IDeck } from 'src/app/models/collections/decks/deck.interface';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root'
})
export class DeckService 
{
    constructor(
        private afStore: AngularFirestore, 
        private authService: AuthenticationService, 
        private translationService: TranslationService) { }


    public async createDeck(deck: IDeckWithIcon): Promise<string>
    {
        let iconFile = deck.iconFile;
        delete deck.iconFile;
        
        deck.userId = this.authService.userId.value;

        return this.afStore.collection(DECK_COLLECTION)
            .add(deck)
                .then(document => document.id)
                .catch(error => 
                {
                    if (environment.production)
                        console.log(error);

                    return null;
                });
    }

    public getUserDecks(): Observable<IDeck[]>
    {
        return this.afStore.collection<IDeck>(DECK_COLLECTION, ref => ref
            .where("userId", "==", this.authService.userId.value))
            .valueChanges({ idField: 'id'});
    }

    public getDeck(deckId: string): Observable<IDeck>
    {
        return this.afStore
            .collection<IDeck>(DECK_COLLECTION)
            .doc(deckId)
            .valueChanges({ idField: 'id'});
    }

    public getDeckIdentities(): Observable<IDeckIdentity[]>
    {
        return this.afStore.collection(DECK_COLLECTION, ref => ref
            .where("userId", "==", this.authService.userId.value))
            .snapshotChanges()
            .pipe(
                map(actions => { 
                    return actions.map(action => {
                        const id = action.payload.doc.id;
                        const data = action.payload.doc.data() as IDeck;
                        return <IDeckIdentity> {
                            id, title: data.title
                        };
                    });
                })
            );
    }

    public async createCategory(categoryName: string): Promise<boolean>
    {
        var category = {} as ICategory;
        category.name = categoryName;
        category.userId = this.authService.userId.value;

       return await this.afStore.collection(CATEGORY_COLLECTION)
            .add(category)
                .then(document => true)
                .catch(error => 
                {
                    if (environment.production)
                        console.log(error);

                    return false;
                });
    }

    public getUserCategories(): Observable<ICategory[]>
    {
        return this.afStore.collection<ICategory>(CATEGORY_COLLECTION, ref => ref
            .where("userId", "==", this.authService.userId.value))
            .valueChanges({ idField: 'id'});
    }

    public async deleteCategory(category: ICategory): Promise<string>
    {
        return await this.afStore.collection(CATEGORY_COLLECTION)
            .doc(category.id)
            .delete()
            .then(() => `${category.name} ${this.translationService.get('input.deleted')}`)
            .catch(error => 
            {
                if (environment.production == false)
                    console.log(error);
                
                return `${this.translationService.get('input.somethingWentWrong')}`;
            });
    }


}
