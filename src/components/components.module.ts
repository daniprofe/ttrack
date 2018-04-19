import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { TrackerComponent } from './tracker/tracker';

@NgModule({
	declarations: [
		TrackerComponent
	],
	imports: [
        IonicModule
	],
	exports: [
		TrackerComponent
	]
})

export class ComponentsModule {}
