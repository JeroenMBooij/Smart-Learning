import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit 
{

    constructor(
        public themeService: ThemeService,
        private router: Router) { }

    ngOnInit(): void 
    {}


    public openLogin(): void
    {
        this.router.navigate(['/login']);
    }

    public openRegister():void
    {
        this.router.navigate(['/register']);
    }

}
