import { Injectable }  from '@angular/core';
import { Title }       from '@angular/platform-browser';
import { LangService } from './lang.service';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TitleService {
    lastHeader : string | any[] = '&nbsp;';

    onHeaderChange = new Subject<string | any[]>();

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


    public setHeader (header : string | any[]) : void {
        this.lastHeader = Array.isArray(header) ? header : (header || '&nbsp;');
        this.onHeaderChange.next(this.lastHeader);
    }

    /*
    public setHeader (headerKey : string, headerData? : any) : void {
        this.langService
            .translateAsync(headerKey, headerData)
            .subscribe(header => this.setRawHeader(header));
    }*/

    public getLastHeader () {
        return this.lastHeader;
    }
}
