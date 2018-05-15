import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ComponentsModule } from '../components/components.module';

import { TTracker } from './app.component';

import { LoginPage } from '../pages/login/login';
import { TaskListPage } from '../pages/task-list/task-list';

import { MomentUtilsProvider } from '../providers/moment-utils';
import { PdbProvider } from '../providers/pdb';
import { UserProvider } from '../providers/user';

@NgModule({
    declarations: [
        TTracker,
        LoginPage,
        TaskListPage
    ],
    imports: [
        BrowserModule,

        ComponentsModule,

        IonicModule.forRoot(TTracker)
    ],
    bootstrap: [
        IonicApp
    ],
    entryComponents: [
        TTracker,

        LoginPage,
        TaskListPage
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        MomentUtilsProvider,
        PdbProvider,
        UserProvider
    ]
})
export class AppModule {}
