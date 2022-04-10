import { IDeckIdentity } from "./deck-identity.interface";

export interface IDeck extends IDeckIdentity
{
    userId: string;
    teamId: string;
    createdAt: Date;
    selectedCategories: string[];
    learningSteps: number[];
    description: string;
    answerOptions: string[];
    feedbackOption: string;
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