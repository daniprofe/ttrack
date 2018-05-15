import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';

@Injectable()
export class UserProvider {

    public loggedIn: boolean = false;

}
