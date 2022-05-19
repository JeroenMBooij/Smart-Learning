import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import 
{ 
    DARK_THEME_COLOR, 
    DARK_THEME_INDEX, 
    LIGHT_THEME_COLOR, 
    LIGHT_THEME_INDEX, 
    THEME_LIST, 
    LIGHT_THEME_BACK_COLOR,
    DARK_THEME_BACK_COLOR,
    LIGHT_THEME_OPPOSITE_COLOR,
    DARK_THEME_OPPOSITE_COLOR,
    LIGHT_THEME_PRIMARY_COLOR,
    DARK_THEME_PRIMARY_COLOR,
    LIGHT_THEME_CONTRAST_COLOR,
    DARK_THEME_CONTRAST_COLOR
} from "src/app/common/constants/theme.constants";
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService 
{

    public update: BehaviorSubject<any> = new BehaviorSubject("");
    public addButton: BehaviorSubject<any> = new BehaviorSubject("");

    public themeBanner1: BehaviorSubject<any> = new BehaviorSubject("");
    public themeBanner2: BehaviorSubject<any> = new BehaviorSubject("");
    public themeMath: BehaviorSubject<any> = new BehaviorSubject("");
    public themeReading: BehaviorSubject<any> = new BehaviorSubject("");
    public themeWriting: BehaviorSubject<any> = new BehaviorSubject("");
    public themeCustom: BehaviorSubject<any> = new BehaviorSubject("");


    
    constructor(private translationService: TranslationService) { }


    public bootstrap()
    {
        let selectedTheme = localStorage.getItem('theme');
        this.setTheme(selectedTheme);
    }

    public get(): string
    {
        return localStorage.getItem('theme');
    }

    public switch(): string
    {
        let selectedThemeKey = localStorage.getItem('theme');
        let newTheme = THEME_LIST.find(s => s != selectedThemeKey);
        selectedThemeKey = this.setTheme(newTheme);

        return selectedThemeKey
    }

    public removeTheme(): void
    {
        THEME_LIST.forEach(theme => {
            document.body.classList.remove(theme);
        }); 
    }

    public setTheme(selectedTheme: string): string
    {
        this.removeTheme();

        let newTheme: string;
        if(THEME_LIST.includes(selectedTheme))
        {
            document.body.classList.add(selectedTheme);
            
            localStorage.setItem("theme", selectedTheme);

            newTheme =  selectedTheme;
        }
        else
        {
            document.body.classList.add(THEME_LIST[0]);
            
            localStorage.setItem("theme", THEME_LIST[0]);

            newTheme =  THEME_LIST[0];
        }

        switch(newTheme)
        {
            case THEME_LIST[LIGHT_THEME_INDEX]:
                document.documentElement.style.setProperty('--my-theme-primary', LIGHT_THEME_PRIMARY_COLOR);
                document.documentElement.style.setProperty('--my-theme-color', LIGHT_THEME_COLOR);
                document.documentElement.style.setProperty('--theme-back-color', LIGHT_THEME_BACK_COLOR);
                document.documentElement.style.setProperty('--theme-opposite-color', LIGHT_THEME_OPPOSITE_COLOR);
                document.documentElement.style.setProperty('--theme-contrast-color', LIGHT_THEME_CONTRAST_COLOR);
                this.addButton.next('add-light');

                this.themeBanner1.next('banner-light-1.svg');
                this.themeBanner2.next('banner-light-2.svg');
                this.themeMath.next('light-math.png');
                this.themeReading.next('light-reading.png');
                this.themeWriting.next('light-writing.png');
                this.themeCustom.next('light-custom.png');

                break;
            
            case THEME_LIST[DARK_THEME_INDEX]:
                document.documentElement.style.setProperty('--my-theme-primary', DARK_THEME_PRIMARY_COLOR);
                document.documentElement.style.setProperty('--my-theme-color', DARK_THEME_COLOR);
                document.documentElement.style.setProperty('--theme-back-color', DARK_THEME_BACK_COLOR);
                document.documentElement.style.setProperty('--theme-opposite-color', DARK_THEME_OPPOSITE_COLOR);
                document.documentElement.style.setProperty('--theme-contrast-color', DARK_THEME_CONTRAST_COLOR);
                this.addButton.next('add-dark');
                
                this.themeBanner1.next('banner-dark-1.svg');
                this.themeBanner2.next('banner-dark-2.svg');
                this.themeMath.next('dark-math.png');
                this.themeReading.next('dark-reading.png');
                this.themeWriting.next('dark-writing.png');
                this.themeCustom.next('dark-custom.png');
                break;
        }
        
        this.update.next(newTheme);
        return newTheme;
    }

    public getDropdownSettings(displayKey: string): any
    {
        return {
            displayKey: displayKey, //if objects array passed which key to be displayed defaults to description
            search:true, //true/false for the search functionlity defaults to false,
            height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
            placeholder:this.translationService.get('dropdown.select'), // text to be displayed when no item is selected defaults to Select,
            customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
            limitTo: 0, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
            moreText: this.translationService.get('dropdown.more'), // text to be displayed whenmore than one items are selected like Option 1 + 5 more
            noResultsFound: this.translationService.get('dropdown.noResults'), // text to be displayed when no items are found while searching
            searchPlaceholder: this.translationService.get('dropdown.search'), // label thats displayed in search input,
            searchOnKey: displayKey // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
        }
    }
}
