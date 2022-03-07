import { Injectable } from '@angular/core';
import { AnswerOption, FeedbackOption } from 'src/app/common/enums/answers.enum';
import { ANSWER_INPUT_SHOW_JAVASCRIPT, ANSWER_SHOW_CSS, ANSWER_SHOW_HTML, ANSWER_SPEECH_CSS, ANSWER_SPEECH_HTML, ANSWER_SPEECH_OPTION, ANSWER_TYPE_CSS, ANSWER_TYPE_HTML, ANSWER_TYPE_OPTION, ANSWER_WRITE_CSS, ANSWER_WRITE_HTML, ANSWER_WRITE_OPTION } from 'src/app/services/card-html/html/answer.html';
import { FEEDBACK_INPUT_CSS, FEEDBACK_INPUT_HTML } from 'src/app/services/card-html/html/feedback.html';
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root'
})
export class CardHtmlService 
{

    constructor(private translationService: TranslationService) { }

    public getAnswerInputJavascript(answerOptions: AnswerOption[]): string
    {
        if (answerOptions.find(option => option == AnswerOption.Show))
            return '';
        
        return ANSWER_INPUT_SHOW_JAVASCRIPT;
    }

    public getAnswerHtml(answerOptions: AnswerOption[]): string
    {
        let html = '';
        for(let answeroption of answerOptions)
        {
            switch(answeroption)
            {
                case AnswerOption.Show:
                    html = ANSWER_SHOW_HTML
                        .replace('{showAnswer}', this.translationService.get('card.showAnswer')); 
                        break;
                case AnswerOption.Type:
                    html += ANSWER_TYPE_HTML
                        .replace('{submit}', this.translationService.get('input.submit'));
                    break;
                case AnswerOption.Write:
                    html += ANSWER_WRITE_HTML;
                    break;
                case AnswerOption.Speech:
                    html += ANSWER_SPEECH_HTML;
                    break;
                
            }
        }

        return html;
    }

    getAnswerOptionsHtml(answerOptions: AnswerOption[]): string
    {
        let html = '';
        if (answerOptions.length > 1)
        {
            for(let answeroption of answerOptions)
            {
                switch(answeroption)
                {
                    case AnswerOption.Type:
                        html += ANSWER_TYPE_OPTION;
                        break;
                    case AnswerOption.Write:
                        html += ANSWER_WRITE_OPTION;
                        break;
                    case AnswerOption.Speech:
                        html += ANSWER_SPEECH_OPTION;
                        break;
                    
                }
            }
        }

        return html;
    }

    public getAnswerCss(answerOptions: AnswerOption[]): string
    {
        let css = '';
        for(let answeroption of answerOptions)
        {
            switch(answeroption)
            {
                case AnswerOption.Show:
                    css = ANSWER_SHOW_CSS
                        .replace('{showAnswer}', this.translationService.get('card.showAnswer')); 
                        break;
                case AnswerOption.Type:
                    css += ANSWER_TYPE_CSS;
                    break;
                case AnswerOption.Write:
                    css += ANSWER_WRITE_CSS;
                    break;
                case AnswerOption.Speech:
                    css += ANSWER_SPEECH_CSS;
                    break;
                
            }
        }

        return css;
    }
    
    public getFeedbackHtml(feedbackOption: FeedbackOption): string
    {
        switch(feedbackOption)
        {
            case FeedbackOption.InputBased: 
            case FeedbackOption.Both: 
                return FEEDBACK_INPUT_HTML
                    .replace('{again}', this.translationService.get('card.feedback.again'))
                    .replace('{hard}', this.translationService.get('card.feedback.hard'))
                    .replace('{good}', this.translationService.get('card.feedback.good'))
                    .replace('{easy}', this.translationService.get('card.feedback.easy'));
        }
    }

    public getFeedbackCss(feedbackOption: FeedbackOption): string
    {
        switch(feedbackOption)
        {
            case FeedbackOption.InputBased: 
            case FeedbackOption.Both: 
                return FEEDBACK_INPUT_CSS
        }
    }

}
