import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    private mode: string = 'login';
    private neverSubmitted: boolean = true;
    private loginForm: FormGroup;
    private repeatPassword: FormControl;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder) {

        this.loginForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required])]
        });

        this.repeatPassword = new FormControl('', Validators.required);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    modeSwitch() {

        console.log('Actual mode:[' + this.mode + ']');

        if (this.mode == 'register') {
            this.loginForm.addControl('repeatPassword', this.repeatPassword);
            this.loginForm.setValidators(this.passwordRepeatValidator);
        } else {
            this.loginForm.clearValidators();
            this.loginForm.removeControl('repeatPassword');
        }
    }

    /**
     * [passwordRepeatValidator description]
     *
     * @see https://stackoverflow.com/a/35642259
     * @param group FormGroup containing form controls with names 'password'
     *              and 'passwordRepeat', we will check if they are equal
     * @return null or { 'no-match': true }
     */

    passwordRepeatValidator(group: FormGroup): ValidationErrors | null {

        if (group.controls.password.value != '' && group.controls.repeatPassword.value != '' &&
            group.controls.password.value != group.controls.repeatPassword.value) {
            group.controls.repeatPassword.setErrors({'noMatch': true});
            return null;
        }

    }



    showEmailValidationErrors() {
        console.error(this.loginForm);
    }

    actionButtonClicked() {

        this.neverSubmitted = false;

        if (this.loginForm.valid) {
            console.log("Form is OK!")
            // console.log(this.loginForm.value);
        } else {
            console.error("Form is not valid!")
        }

    }

    /*



    }
    */

}