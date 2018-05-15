import { Component, ViewChild } from '@angular/core';
import { TrackerInterval } from '../models/tracker-interval';
import { Events, Nav } from 'ionic-angular';

import { TaskListPage } from '../pages/task-list/task-list';
import { LoginPage } from '../pages/login/login';

import { UserProvider } from '../providers/user';

@Component({
  templateUrl: 'app.html'
})

export class TTracker {

    @ViewChild(Nav) nav: Nav;

    rootPage: any = TaskListPage;

    constructor(
        private user: UserProvider) {
    }

    goToLoginPage() {
        this.nav.push(LoginPage);
        // this.rootPage = LoginPage;
    }
}
