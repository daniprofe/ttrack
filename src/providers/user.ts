import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Events } from 'ionic-angular';

// import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw'
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';



import PouchDB from 'pouchdb';

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

    private baseUrl = 'https://ttrack-couchdb-server-daniprofe.c9users.io/auth/';

    /**
     * Default HttpClient request options (to be used on every request)
     */
    private defaultRequestOptions = {};

    public loggedIn: boolean = false;
    public email: string|null = null;

    private superLoginAuth;

    constructor(
        private events: Events,
        private http: HttpClient) {
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
                    this.superLoginAuth = data;
                    console.log(this.superLoginAuth);
                    this.loggedIn = true;
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
