import {ChangeDetectionStrategy, Component, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {TitleService} from '../../../services/title.service';
import {LangService} from '../../../services/lang.service';
import {Subscription} from 'rxjs';
import {TermsService} from '../../../services/terms.service';
import {SafeHtml} from '@angular/platform-browser';

@Component({
    selector: 'terms',
    templateUrl: './terms.component.html',
    styleUrls: [ './terms.component.scss' ],
    changeDetection: ChangeDetectionStrategy.Default
})
export class TermsComponent implements OnInit {
    public isReady : boolean = false;

    public content : string | SafeHtml = '';

    public subs : Subscription[] = [];

    constructor (
        private renderer : Renderer2,
        private router : Router,
        private titleService : TitleService,
        private langService : LangService,
        private termsService : TermsService,
    ) {}

    public ngOnInit () {
        this.titleService.setRawTitle('Terms & Conditions', false);
        this.subs.push(this.langService.onLangChange(() => {
            this.loadTerms();
        }));

        this.loadTerms();
    }

    public loadTerms () {
        this.isReady = false;
        const langCode = this.langService.getCurrentLangCode();

        this.termsService.fetchTerms(langCode).subscribe((html) => {
            this.content = html;
            console.log(html);
        });
    }
}
