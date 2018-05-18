import { Component, ViewChild } from '@angular/core';
import { TrackerInterval } from '../models/tracker-interval';
import { Content, Events, Nav } from 'ionic-angular';

import { TaskListPage } from '../pages/task-list/task-list';
import { LoginPage } from '../pages/login/login';

import { UserProvider } from '../providers/user';

@Component({
  templateUrl: 'app.html'
})

export class TTracker {

    @ViewChild(Content) content: Content;
    @ViewChild(Nav) nav: Nav;

    rootPage: any = TaskListPage;

    constructor(
        private events: Events,
        private user: UserProvider) {

            this.events.subscribe('auth:login', () => {
                this.content.resize();
                this.nav.setRoot(TaskListPage);
                console.error('logged in!!!!');
            });
    }

    goToLoginPage() {
        this.nav.push(LoginPage);
    }
}
