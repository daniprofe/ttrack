import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ComponentsModule } from '../components/components.module';

import { TTracker } from './app.component';

import { TaskListPage } from '../pages/task-list/task-list';

@NgModule({
    declarations: [
        TTracker,
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
        TaskListPage
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        }
    ]
})
export class AppModule {}
