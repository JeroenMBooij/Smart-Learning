import { Injectable } from '@angular/core';
import "firebase/auth";
import { AngularFireAuth } from '@angular/fire/auth';
import { AccountRegistration, AuthenticationClient, Credentials } from './authentication-client.generated';
import { environment } from 'src/environments/environment';
import * as lsKeys from 'src/app/common/constants/localstorage.constants';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from '../translation/translation.service';
import { ServiceMessage } from 'src/app/models/ServiceMessage.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { PLAYER_COLLECTION } from 'src/app/common/constants/collection.constants';
import { IPlayer } from 'src/app/models/collections/teams/player.interface';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService 
{
    public userId: BehaviorSubject<string> = new BehaviorSubject("");
    public userEmail: BehaviorSubject<string> = new BehaviorSubject("");
    public username: BehaviorSubject<string> = new BehaviorSubject("");

    private user: any = null;

    constructor(
        private authClient: AuthenticationClient, 
        private fireAuth: AngularFireAuth,
        private afStore: AngularFirestore,
        private translationService: TranslationService) 
    {
        this.fireAuth.authState.subscribe(user => {
            
            if(environment.production == false)
                console.log("authentication state subscribed.");

            if (user) 
            {
                this.userId.next(user.uid);
                this.userEmail.next(user.email);
                this.username.next(user.displayName);
                this.user = user;
            }
            else 
            {
                this.userId.next("");
                this.userEmail.next("");
                this.username.next("");
                this.user = null;
            }
        });
    }

    public async register(player: IPlayer, password: string): Promise<boolean>
    {
        return await this.basicRegistration(player, password);
    }

    public async login(email: string, password: string): Promise<boolean>
    {
        return await this.basicLogin(email, password);
    }

    public async logout(): Promise<void>
    {
        await this.basicLogout();
    }

    public async manageAccount(oldPassword: string, newPassword: string): Promise<ServiceMessage>
    {
        return await this.basicManageAccount(oldPassword, newPassword);
    }
    
    public async recoverPassword(email: string): Promise<boolean>
    {
        return await this.basicRecoverPassword(email);
    }

    public async deleteAccount(password: string, email: string = ""): Promise<boolean>
    {
        if(email == "")
            email = this.user.email;

        return await this.basicDeleteAccount(password, email);
    }

    private async basicRegistration(player: IPlayer, password: string): Promise<boolean>
    {
        delete (player as any).password;
        try
        {
            await this.afStore.firestore.runTransaction(() => {
                const promise = Promise.all([
                    this.createFirebaseAuthUser(player, password),
                    this.afStore.collection(PLAYER_COLLECTION).add(player)
                ]);
    
                return promise;
            });
            
            this.username.next(player.username);

            return true;
        }
        catch(error)
        {
            if(environment.production == false)
                console.log(error);

            return false;
        }
    }

    private async createFirebaseAuthUser(player: IPlayer, password: string)
    {
        var userCredential = await this.fireAuth.createUserWithEmailAndPassword(player.email, password);

        await userCredential.user.updateProfile({displayName: player.username});
    }

    private async basicLogin(email: string, password: string): Promise<boolean>
    {
        try
        {
            var userCredential = await this.fireAuth.signInWithEmailAndPassword(email, password);

            return true;
        }
        catch(error)
        {
            if(environment.production == false)
                console.log(error);

            return false;
        }
    }

    private async basicLogout(): Promise<void>
    {
        await this.fireAuth.signOut();
    }

    public async basicManageAccount(oldPassword: string, newPassword: string): Promise<ServiceMessage>
    {
        try
        {
            let correctOldPassword = await this.basicLogin(this.user.email, oldPassword);
            if (correctOldPassword == false)
                return new ServiceMessage(false, this.translationService.get('authentication.invalidCredentials'));

            await this.user.updatePassword(newPassword);

            let successMessage = this.translationService.get('authentication.passwordUpdated').replace('{email}', this.userEmail.value);
            return new ServiceMessage(true, successMessage);
        }
        catch(error)
        {
            if(environment.production == false)
                console.log(error);

                return new ServiceMessage(false, this.translationService.get('authentication.validPassword'));
        }
    }

    private async basicRecoverPassword(email: string): Promise<boolean>
    {
        try
        {
            await this.fireAuth.sendPasswordResetEmail(email);

            return true;
        }
        catch(error)
        {
            if(environment.production == false)
                console.log(error);

            return false;
        }
    }

    public async basicDeleteAccount(password: string, email: string): Promise<boolean>
    {
        let correctPassword = await this.basicLogin(email, password);
            if (correctPassword == false)
                return false;
        try
        {
            await this.user.delete();

            return true;
        }
        catch(error)
        {
            if(environment.production == false)
                console.log(error);

            return false;
        }
    }

    private async customRegistration(email: string, password): Promise<boolean>
    {
        try
        {
            let jwtToken = await new Promise<string>((resolve, reject) =>
            {  
                this.authClient.register(new AccountRegistration())
            });
        }
        catch(error)
        {
            if(environment.production == false)
                console.log(error);

            return false;
        }
    }

    private async customLogin(email: string, password: string): Promise<boolean>
    {
        try
        {
            let jwtToken = await new Promise<string>((resolve, reject) =>
            {  
                this.authClient.login(new Credentials({email: email, password: password}))
                        .subscribe(token =>  {
                            if(environment.production == false)
                                console.log("authentication client subscribed."); 

                            resolve(token);
                        },
                            error => reject(error)
                        );
            });

            localStorage.setItem(lsKeys.jwtTokenKey, jwtToken);
            
            var userCredential = await this.fireAuth.signInWithCustomToken(jwtToken);

            return true;
        }
        catch(error)
        {
            if(environment.production == false)
                console.log(error);

            return false;
        }
    }
    
    private async customLogout(): Promise<void>
    {
        await this.fireAuth.signOut();

        localStorage.removeItem(lsKeys.jwtTokenKey);
    }


}