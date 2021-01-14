import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppBarService {
    onTitleChange = new Subject<string>();

    lastTitle = '&nbsp;';

    setTitle (title : string) {
        this.lastTitle = (title || '&nbsp;').trim();
        this.onTitleChange.next(this.lastTitle);
    }

    getLastTitle () {
        return this.lastTitle;
    }
}
