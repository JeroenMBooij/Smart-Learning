import { AnswerOption, FeedbackOption } from "src/app/common/enums/answers.enum";
import { IDeckIdentity } from "./deck-identity.interface";

export interface IDeck extends IDeckIdentity
{
    userId: string;
    teamId: string;
    createdAt: Date;
    selectedCategories: string[];
    description: string;
    answerOptions: AnswerOption[],
    feedbackOption: FeedbackOption;
    intervalModifier: number;
    hardIntervalModifier: number;
    defaultEaseModifier: number;
    easeBonus: number;
    easePenalty: number;
    again: number;
    hard: number;
    good: number;
    easy: number;
}