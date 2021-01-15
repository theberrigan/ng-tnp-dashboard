import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    initUser () : Promise<void> {
        return Promise.resolve();
    }

    getCurrentLangCode () {
        return window.localStorage.getItem('lang') || 'en';
    }
}
