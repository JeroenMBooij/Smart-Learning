import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EducationCard } from 'src/app/services/didac/didac-client.generated';
import { DidacService } from 'src/app/services/didac/didac.service';

@Component({
  selector: 'app-learn-card',
  templateUrl: './learn-card.component.html',
  styleUrls: ['./learn-card.component.scss']
})
export class LearnCardComponent implements OnInit 
{
    public deckId: string;
    public sessionId: string;
    public sessionCardId: string;
    public playerCardId: string;
    public showAnswer: boolean;
    public frontFrameSource: string;
    public backFrameSource: string;

    constructor(
        private didacService: DidacService,
        private router: Router,
        private route: ActivatedRoute) { }

    async ngOnInit(): Promise<void> 
    {
        this.deckId = this.route.snapshot.paramMap.get('deckId');

        this.sessionId = await this.didacService.startSession(this.deckId);
        if (this.sessionId == "")
        {
            this.router.navigate([`/deck/${this.deckId}/cards/learn-overview`]);
            return;
        }

        await this.getNextCard();
    }

    async ngOnDestroy(): Promise<void> 
    {
        this.didacService.endSession(this.sessionId);
    }

    public async getNextCard(): Promise<void>
    {
        let frontEducationCard: EducationCard = await this.didacService.GetNextFrontCard(this.sessionId);
        if (frontEducationCard == null)
        {
            this.router.navigate([`/`]);
            return;
        }

        this.showAnswer = false;
        this.frontFrameSource = frontEducationCard.content;

        this.sessionCardId = frontEducationCard.sessionCardId;
        this.playerCardId = frontEducationCard.playerCardId;
    }

    public async flipCard(event: boolean): Promise<void>
    {
        let backEducationCard: EducationCard = await this.didacService.submitCardAnswer(this.sessionId, this.sessionCardId);
        this.backFrameSource = backEducationCard.content;
        this.showAnswer = true;
    }

    public async feedback(event: string): Promise<void>
    {
        await this.didacService.submitCardFeedback(this.sessionId, this.sessionCardId, event);

        await this.getNextCard();
    }

}
