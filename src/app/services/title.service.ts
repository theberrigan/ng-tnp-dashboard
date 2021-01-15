import { Injectable }  from '@angular/core';
import { Title }       from '@angular/platform-browser';
import { LangService } from './lang.service';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TitleService {
    lastHeader : string = '&nbsp;';

    onHeaderChange = new Subject<string>();

    constructor (
        private title : Title,
        private langService : LangService
    ) {}

    public setRawTitle (title : string, concatTNP : boolean = false) : void {
        this.title.setTitle(title + (concatTNP ? ' | tapNpay' : ''));
    }

    public setTitle (titleKey : string, titleData? : any, concatTNP : boolean = false) : void {
        this.langService
            .translateAsync(titleKey, titleData)
            .subscribe(title => this.title.setTitle(title + (concatTNP ? ' | tapNpay' : '')));
    }

    public setRawHeader (header : string) : void {
        this.lastHeader = (header || '&nbsp;').trim();
        this.onHeaderChange.next(this.lastHeader);
    }

    public setHeader (headerKey : string, headerData? : any) : void {
        this.langService
            .translateAsync(headerKey, headerData)
            .subscribe(header => this.setRawHeader(header));
    }

    public getLastHeader () {
        return this.lastHeader;
    }
}
