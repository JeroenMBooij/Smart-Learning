import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DidacClient, EducationCard } from './didac-client.generated';

@Injectable({
  providedIn: 'root'
})
export class DidacService 
{

    constructor(private didacClient: DidacClient) { }

    public async GetNextFrontCard(sessionId: string): Promise<EducationCard>
    {
        let frontEducationCard: EducationCard = await new Promise(resolve => 
        {
            this.didacClient.getNextFrontCard(sessionId).subscribe(card => 
            {
                if(card)
                    resolve(card);
                else
                    resolve(null);
            }, 
            error => 
            {
                if (environment.production == false)
                    console.log(error);
                
                resolve(null);
            });
        });

        return frontEducationCard;
    }

    public async submitCardAnswer(sessionId: string, sessionCardId: string): Promise<EducationCard>
    {
        let backEducationCard: EducationCard = await new Promise(resolve =>
        {
            this.didacClient.submitCardAnswer(sessionId, sessionCardId).subscribe(card =>
            {
                if (card)
                    resolve(card);
                else
                    resolve(null);
            },
            error =>
            {
                if (environment.production == false)
                    console.log(error);

                resolve(null);
            });            
        });

        return backEducationCard;
    }

    public async submitCardFeedback(sessionId: string, sessionCardId: string, feedback: string): Promise<void>
    {
        await new Promise<void>((resolve, reject) =>
        {
            this.didacClient.submitCardFeedback(sessionId, sessionCardId, feedback).subscribe(card =>
            {
                resolve();
            },
            error =>
            {
                if (environment.production == false)
                    console.log(error);

                    reject();
            });
        });
    }

    
    public async endSession(sessionId: any): Promise<boolean>
    {
        return await new Promise(resolve =>
        {
            this.didacClient.endSession(sessionId).subscribe(() =>
            {
                resolve(true);
            },
            error =>
            {
                if (environment.production == false)
                    console.log(error);

                resolve(false);
            });
        });
    }

    public async startSession(deckId: string): Promise<string>
    {
        return await new Promise(resolve =>
            {
                this.didacClient.startSession(deckId).subscribe((sessionId) =>
                {
                    resolve(sessionId);
                },
                error =>
                {
                    if (environment.production == false)
                        console.log(error);
    
                    resolve("");
                });
            });
    }
}
