import { Injectable } from '@angular/core';
import "firebase/auth";
import { AngularFireAuth } from '@angular/fire/auth';
import { AccountConfirmation, AccountRegistration, Application, AuthenticationClient, ClaimConfig, Credentials, DomainName, JwtTenantConfig, Ticket } from './authentication-client.generated';
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
                if(user.email)
                {
                    this.userEmail.next(user.email);
                    this.username.next(user.displayName);
                }
                else
                {
                    // TODO: customUser.email
                    // TODO: customUser.displayName
                    var authCookie = this.authClient.getAuthCookie();
                    if(authCookie != null)
                    {
                        this.userEmail.next("test@gmail.com");
                        this.username.next("test@gmail.com");
                    }
                }
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

    public async register(player: IPlayer, password: string): Promise<ServiceMessage>
    {
        return await this.customRegistration(player, password);
    }

    public async login(email: string, password: string): Promise<boolean>
    {
        return await this.customLogin(email, password);
    }

    public async logout(): Promise<void>
    {
        await this.customLogout();
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

    public async customAdminRegistration(email: string, password: string): Promise<ServiceMessage>
    {
        let accountConfirmation = await new Promise<AccountConfirmation>((resolve, reject) =>
        {  
            let account = new AccountRegistration();
            account.email = email;
            account.authenticationRole = "Admin";
            account.password = password;
            account.adminId = environment.authenticationClient.adminId;

            this.authClient.register(account).subscribe(message => 
            {
                resolve(message);
            },
            error => 
            {

                if(environment.production == false)
                    console.log(error);

                return new ServiceMessage(false, "Unexpected Error");
            })
        });

        await this.customLogin(email, password, false);
        

        return new ServiceMessage(true, accountConfirmation.message);
    }

    public async applicationRegistration(): Promise<ServiceMessage>
    {
        try
        {
            let registrationMessage = await new Promise<string>((resolve, reject) =>
            {  
                let app = new Application();
                app.id = environment.authenticationClient.appId;
                app.name = "Teacher Didac";

                app.domains = [];
                let domain = new DomainName();
                domain.name = "localhost";
                domain.url = "http://localhost:4200";
                app.domains.push(domain);

                app.jwtTenantConfigurations = []
                let jwtTenantConfigurations = new JwtTenantConfig();

                // development key
                jwtTenantConfigurations.secretKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2do8EAkClQlkX\n9NqbF6KA64xvtCfyA+cAZlM/6StvxEs0J8KXJu0ygX31Wr0hLbBkS5i8SPPqGioE\nuTxXXx8Gv2FOduY6/EG5dJPbx5T10ry6k3bf+PDyOw9Bp14F8RpvrDPvGqWT9EIY\njTZsXGHLc4CQTc+rdg3NjXVou6qW5NzyGCINfhc0ftH3itcPdQNRWkuuQTNYe4ys\nJokSG+Xr1qVBlHS4hAkvWAQILzUXu4ofrlKzfx6kjJCC014Y6y8pHPuDGN9qYTMN\noPN1Uk5DX4u1fMTOERh9ylALpdO8ks4CH9oe1v8vZ9cYJh0itBRGL9a4PFKv4jWz\ntF1XhG3VAgMBAAECggEAAWM9RbQdrpQRWORgvZFhspYird53zPhOILDmh6573oBR\nQRmJ+jvOeICccbSptQ+jpIj1pahEC0mn0abgqFpzF4pLkLzzQHYW1Yn8g41M8Eyq\nE5zXqIQ8aDSI8msghNjh+6uag9eW9Efahn9xGe8JmFztw0swMzc1NipnVESpxgwp\nZrP2DU3KdpFHREU6aZXeT9xDfVXAEqkxvWhuVrDyTwxcnlNQwY3xcwbJapWj/Cg7\nJ8mDGpPhLu5qGAxXL4TOLBReri1mFoDOTTtViCCMMET+5j3cFYgiqrj9Ze6T5pge\nRyIm8ffyMOXS/9+w18Z1hzrnEgDPAOJEUwnrD7aU+QKBgQDscn4T+YNEQFOUVKal\nfmnYu+ZHRgL/MCf0CTLPoD3W56inPgjpZNg79/b1BXFH5/D1hYbEjvnEiurtmugR\nmO4NchvYGhzFr+DeGLATkJewNPbGgWzyYTFuv+RgonfzVI8t3snzxBXJ1ia/JLNc\n4F3eDauUWwE1bjYJVazZ2vNXeQKBgQDFjT2kei/C+cfEnAC7/8HQMkjSPDRoFFQ/\nFajoa/FR1U8p9g206WtW7TXFq8gI8NjCOE7nVtJu3uY8Ph0WCs0NZm3ZzxH28Bn2\nr9+/K3C1AbAe1nLew+f+OH0i20JsBj6AYL/3U+tfShgvQxdMwOBOm0EIrCJ/5wHM\nlxaoL6nGPQKBgQDaylr12sVni2qLcAVAUAhboAtG2nb9ca8WtshIrYtrZ7N9Bf8z\nELiyTRI8ygt3sR0b47HAAlkGUFFxCg1B81QcJwGy5v7Gwqd+fDO59usWBvxu1OZe\nJieaxn/qF4yNIirXFDellEVhHgN+jdRW1dqmFdo2DjvBGDlyS9AFSwAvaQKBgQCF\nfNb2WQoE+bsfAzsLzdos0I2cYcoXugTjS8OCqc26uiRv+i9w23kIl+kJ1PWp9PTC\n6EGI2IYBHOT+OAp3Zn0AXQJFd0JwVfV1V4odJ0FVTfqwG8Aq/r24bntAHmBXljCN\nltKgUThufyawaOlJl9r5wrbDIW1+d54jnMRWiT5zEQKBgF7t83NT6+Tg6rGlY+Nh\naKlxT8xs9PP+nyHPts2EndGnwrs3oWEvnsfWG+MVFTLQhGD/3aA9X+Q/ZGqVGYUF\nUkjSeQdlAFuT4EAmx9hJpmPpLbvtDg0E4ImxaWUVQod6w+LuOpAejhjPX3vBqm17\n5s2bJHmw7Psk3VTEoQlHctG0\n-----END PRIVATE KEY-----\n"
                
                jwtTenantConfigurations.expireMinutes = 60;
                jwtTenantConfigurations.refreshExpireMinutes = 7200;
                jwtTenantConfigurations.algorithm = "RsaSha256";

                jwtTenantConfigurations.claims = [];

                let issclaim = new ClaimConfig();
                issclaim.jwtName = "iss";
                issclaim.type = "HardData";
                issclaim.data = "firebase-adminsdk-ytpr4@teacher-didac.iam.gserviceaccount.com";
                jwtTenantConfigurations.claims.push(issclaim);

                let subclaim = new ClaimConfig();
                subclaim.jwtName = "sub";
                subclaim.type = "HardData";
                subclaim.data = "firebase-adminsdk-ytpr4@teacher-didac.iam.gserviceaccount.com";
                jwtTenantConfigurations.claims.push(subclaim);

                let audclaim = new ClaimConfig();
                audclaim.jwtName = "aud";
                audclaim.type = "HardData";
                audclaim.data = "https:\/\/identitytoolkit.googleapis.com\/google.identity.identitytoolkit.v1.IdentityToolkit";
                jwtTenantConfigurations.claims.push(audclaim);

                let iatclaim = new ClaimConfig();
                iatclaim.jwtName = "iat";
                iatclaim.type = "JWTIat";
                jwtTenantConfigurations.claims.push(iatclaim);

                let expclaim = new ClaimConfig();
                expclaim.jwtName = "exp";
                expclaim.type = "JWTExp";
                jwtTenantConfigurations.claims.push(expclaim);

                app.jwtTenantConfigurations.push(jwtTenantConfigurations);

                this.authClient.applications2(app).subscribe(message => 
                {
                    resolve(message);
                })
            });

            this.customLogout();

            return new ServiceMessage(true, registrationMessage);
        }
        catch(error)
        {
            if(environment.production == false)
                console.log(error);

            return new ServiceMessage(false, "Unexpected Error");
        }
    }

    private async customRegistration(player: IPlayer, password): Promise<ServiceMessage>
    {
        try
        {
            let accountConfirmation = await new Promise<AccountConfirmation>((resolve, reject) =>
            {  
                let account = new AccountRegistration();
                account.email = player.email;
                account.authenticationRole = "Tenant";
                account.password = password;
                account.applicationId = environment.authenticationClient.appId;
                account.adminId = environment.authenticationClient.adminId;

                this.authClient.register(account).subscribe(accountConfirmation => 
                {
                    resolve(accountConfirmation);
                },
                error =>
                {
                    if(environment.production == false)
                        console.error(error);
                    reject(error);
                });
            });

            await this.afStore.collection(PLAYER_COLLECTION).doc(accountConfirmation.id).set(player)
            .catch((error) => {
                if(environment.production == false)
                    console.error("Error writing document: ", error);
            });

            return new ServiceMessage(true, accountConfirmation.message);
        }
        catch(error)
        {
            if(environment.production == false)
                console.log(error);

            return new ServiceMessage(false, "Unexpected Error");
        }
    }

    private async customLogin(email: string, password: string, firebase: boolean = true): Promise<boolean>
    {
        try
        {
            let ticket = await new Promise<Ticket>((resolve, reject) =>
            {  
                let credentials = new Credentials(
                {
                    email: email, 
                    password: password, 
                    applicationId: environment.authenticationClient.appId,
                    adminId: environment.authenticationClient.adminId
                });

                this.authClient.login(credentials)
                        .subscribe(ticket =>  {
                            if(environment.production == false)
                                console.log("authentication client subscribed."); 

                            resolve(ticket);
                        },
                            error => reject(error)
                        );
            });
            
            if (firebase == true)
            {
                var userCredential = await this.fireAuth.signInWithCustomToken(ticket.registeredJWT);
                
                //TODO this is supposed to be done by the server but ofcourse it doesn't fucking work like everyting always fuck!!!!
                document.cookie = `authorization=${JSON.stringify(ticket)}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`
            }
            else
                localStorage.setItem(lsKeys.jwtTokenKey, ticket.registeredJWT);

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

        document.cookie = "authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }


}