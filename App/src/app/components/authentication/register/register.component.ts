import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IPlayer } from 'src/app/models/collections/teams/player.interface';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public alert: string = null;
    public registerStatus: string;
   

    public registerForm = new FormGroup({
        username     : new FormControl('',[
            Validators.required,
          ]),
        email     : new FormControl('',[
          Validators.required,
        ]),
        password  : new FormControl('',[
          Validators.required
        ]),
    });

    get username() { return this.registerForm.get('username') }
    get email() { return this.registerForm.get('email') }
    get password() { return this.registerForm.get('password') }

    constructor(
        private authService: AuthenticationService,
        private translationService: TranslationService,
        private router: Router,
        private dialog: MatDialog) 
    {
    }

    ngOnInit(): void 
    {
        this.registerForm.valueChanges.subscribe(status => {
            if (environment.production == false)
                console.log('registerForm subscribed');

            for (let controlKey in this.registerForm.controls)
            {
                let control = this.registerForm.get(controlKey);
                if (control.invalid && (control.dirty || control.touched))
                {
                    this.registerStatus = 'INVALID';
                    return;
                }
                
            }

            this.registerStatus = 'VALID';
        });
    }

    public async register(): Promise<void>
    {
        let player: IPlayer = this.registerForm.value;
        player.createdAt = new Date();
        let success = await this.authService.register(player, this.password.value);
        if(success)
        {
            this.registerStatus = 'SUCCESS';
            let dialogReference = this.dialog.open(ConfirmationDialogComponent, {
                width: "600px",
                data: { 
                    message: `${this.translationService.get('authentication.registrationSuccess')}. 
                        <br> ${this.translationService.get('signpost.welcome')}`,
                    confirmation: false
                }
            });
    
            dialogReference.afterClosed().subscribe(async result => {
                // result is CONFIRM or CANCEL
               
                //navigate to home page
                this.router.navigate(['']);
            });
        }
        else
        {
            this.alert = this.translationService.get('authentication.emailAlreadyExists');
            this.registerStatus = 'INVALID';
            
            this.translationService.update.subscribe(update => {
                if (environment.production == false)
                    console.log("alert translation subscribed");
                if (this.alert)
                    this.alert = this.translationService.get('authentication.invalidCredentials');       
            });
        }
    }

}
