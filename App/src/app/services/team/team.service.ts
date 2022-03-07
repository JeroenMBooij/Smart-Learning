import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TEAM_COLLECTION } from 'src/app/common/constants/collection.constants';
import { ITeam } from 'src/app/models/collections/teams/team.interface';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  

    constructor(
        private afStore: AngularFirestore,
        private authService: AuthenticationService) { }

    public getPlayerTeams(): Observable<ITeam[]>
    {
        return this.afStore.collection<ITeam>(TEAM_COLLECTION, ref => ref
            .where("userId", "==", this.authService.userId.value))
            .valueChanges({ idField: 'id'});
    }
}
