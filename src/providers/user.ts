import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Events } from 'ionic-angular';

// import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw'
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { PdbProvider } from './pdb';

import PouchDB from 'pouchdb';
import moment from 'moment';

/*
{
    "issued": 1526653954637,
    "expires": 1526740354637,
    "provider": "local",
    "ip": "::ffff:10.240.0.88",
    "token": "Jziuex_qQFCb6LS6wU-dGQ",
    "password": "BW-utCBXRBSBlynvoW19UQ", // 'probando'
    "user_id": "daniprofe@gmail.com",
    "roles": ["user"],
    "userDBs": {
        "ttrack": "http://Jziuex_qQFCb6LS6wU-dGQ:BW-utCBXRBSBlynvoW19UQ@localhost:5984/ttrack$daniprofe(40)gmail(2e)com"
    }
}
 */

interface superLoginAuthInt {
    issued: number,
    expires: number,
    ip: string,
    provider: string,
    token: string,
    password: string,
    user_id: string,
    roles: Array<string>,
    userDBs: object
}

@Injectable()
export class UserProvider {

    private baseUrl = 'https://ttrack-couchdb-server-daniprofe.c9users.io:8081/auth/';

    /**
     * Default HttpClient request options (to be used on every request)
     */
    private defaultRequestOptions = {};

    public loggedIn: boolean = false;

    private loggedUser: any = {
        '_id': '_local/loggedUser'
    };

    private superLoginAuth;

    constructor(
        private events: Events,
        private http: HttpClient,
        private pdb: PdbProvider) {

        this.loadLocalUserInfo();
    }

    private loadLocalUserInfo() {
        this.pdb.pdb.local.get(this.loggedUser._id).then((data) => {
            this.loggedUser = data;
            if (typeof this.loggedUser.superLoginAuth !== 'undefined') {
                console.log('---- User logged in ----');
                console.log('Issued: ' + moment(this.loggedUser.superLoginAuth.issued).format('DD/MM/YYYY HH:mm:ss'));
                console.log('Expires: ' + moment(this.loggedUser.superLoginAuth.expires).format('DD/MM/YYYY HH:mm:ss'));
                this.loggedIn = true;
                this.events.publish('auth:login', {});
                this.startRemoteSync();
            }
        }).catch((error) => {
            if (typeof error !== 'undefined' && typeof error.status === 'number' && error.status === 404) {
                this.pdb.pdb.local.put(this.loggedUser);
            }
        });
    }

    private startRemoteSync() {

        if (typeof this.loggedUser.superLoginAuth !== 'undefined' &&
            typeof this.loggedUser.superLoginAuth.userDBs !== 'undefined' &&
            typeof this.loggedUser.superLoginAuth.userDBs.ttrack === 'string') {

            /* Start local <-> remote live sync
             * @see https://pouchdb.com/guides/replication.html
             */

            this.pdb.pdb.remote = new PouchDB(this.loggedUser.superLoginAuth.userDBs.ttrack);

            this.pdb.pdb.local.sync(this.pdb.pdb.remote, {
              live: true,
              retry: true
            }).on('change', function (change) {
              console.log('SYNC - change:');
              console.log(change);
            }).on('paused', function (info) {
                console.log('SYNC - paused:');
                console.log(info);
            }).on('active', function (info) {
                console.log('SYNC - active:');
                console.log(info);
            }).on('error', function (err) {
                console.log('SYNC - err:');
                console.log(err);
            });

        }

    }

    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
        console.error(error.error);
      }
      // return an observable with a user-facing error message
      // return _throw('Something bad happened; please try again later.');
      return of(error);

    };

    public registerNewUser(email: string, password:string) {

        let data = {
            'email': email,
            'password': password,
            'confirmPassword': password
        };

        /*
          {
              error: 'Validation failed',
              validationErrors: { email: [ 'Email already in use' ] },
              status: 400
          }

          {"success":"User created."}
         */

        /* Merge options for this request with default request options
         * using Typescript's spread (similar to jQuerys extend):
         * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#object-spread-and-rest
         */

        let requestOptions = {};
        requestOptions = { ...this.defaultRequestOptions, ...requestOptions };

        return this.http.post(this.baseUrl + 'register', data, requestOptions)
            .pipe( catchError(this.handleError) );

    }

    public login(email: string, password:string) {

        let dataToSend = {
            'username': email,
            'password': password
        };

        /* Merge options for this request with default request options
         * using Typescript's spread (similar to jQuerys extend):
         * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#object-spread-and-rest
         */

        // {"error":"Unauthorized","message":"Invalid username or password"}
        /*
        {
        	"issued": 1526653954637,
        	"expires": 1526740354637,
        	"provider": "local",
        	"ip": "::ffff:10.240.0.88",
        	"token": "Jziuex_qQFCb6LS6wU-dGQ",
        	"password": "BW-utCBXRBSBlynvoW19UQ",
        	"user_id": "daniprofe@gmail.com",
        	"roles": ["user"],
        	"userDBs": {
        		"ttrack": "http://Jziuex_qQFCb6LS6wU-dGQ:BW-utCBXRBSBlynvoW19UQ@localhost:5984/ttrack$daniprofe(40)gmail(2e)com"
        	}
        }
         */

        let requestOptions = {};
        requestOptions = { ...this.defaultRequestOptions, ...requestOptions };

        return this.http.post(this.baseUrl + 'login', dataToSend, requestOptions).pipe(
            tap(data => {
                if (data && typeof data['token'] == 'string') {
                    this.loggedUser['superLoginAuth'] = data;
                    this.pdb.pdb.local.put(this.loggedUser);
                    console.log(this.superLoginAuth);
                    this.loggedIn = true;
                    this.startRemoteSync();
                    this.events.publish('auth:login', {});
                }
            }, error => {
                // You can do some fancy stuff here with errors if you like
                // Below we are just returning the error object to the outer stream
                return this.handleError(error);
            })
        );

    }

}
