import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from 'rxjs';
import * as locale from 'src/app/common/constants/language.constants';
import * as lsKeys from 'src/app/common/constants/localstorage.constants';
import { LanguageDropdown } from "src/app/models/dropdown/language-dropdown.model";


@Injectable({
  providedIn: 'root'
})
export class TranslationService {

    public supportedLanguages: LanguageDropdown[];
    public update: BehaviorSubject<any> = new BehaviorSubject("");

    private translate: TranslateService;

    constructor(translate: TranslateService)
    {
        this.translate = translate;
        this.supportedLanguages = locale.supportedLanguages;
    }

    
    public setLanguage(code: string): void
    {
        this.translate.use(code);
    }

    
    public get(key: string): string
    {
        return this.translate.instant(key);
    }

    public GetSelectedLanguage(): LanguageDropdown
    {
        let selectedLanguage = locale.supportedLanguages.find(s => s.code == this.translate.currentLang);

        if(selectedLanguage == undefined)
            selectedLanguage  = locale.supportedLanguages.find(s => s.code == localStorage.getItem(lsKeys.languageKey));
        if(selectedLanguage == undefined)
            selectedLanguage  = locale.supportedLanguages.find(s => s.code == locale.defaulLanguage);
        if(selectedLanguage == undefined)
            throw Error("no language set");
        
        return selectedLanguage;
    }

    public saveSelectedLanguage(code: string): void
    {
        localStorage.setItem(lsKeys.languageKey, code);
        this.update.next("");
    }

    public bootstrap(): void
    {
        this.translate.addLangs(['en', 'nl', 'zh']);
        this.translate.setDefaultLang('en');
        this.translate.use(this.GetSelectedLanguage().code);
    }
}
