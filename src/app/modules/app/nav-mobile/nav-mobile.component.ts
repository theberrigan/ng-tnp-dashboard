import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input, OnDestroy,
    OnInit,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {defer} from '../../../lib/utils';
import {LANGS, LangService} from '../../../services/lang.service';
import {TermsService, TermsSession} from '../../../services/terms.service';

type Layout = 'nav' | 'langs';

@Component({
    selector: 'nav-mobile',
    templateUrl: './nav-mobile.component.html',
    styleUrls: [ './nav-mobile.component.scss' ],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'nav-mobile'
    }
})
export class NavMobileComponent implements OnInit, OnDestroy {
    readonly langs = LANGS;

    @HostBinding('class.nav-mobile_open')
    isActive : boolean = false;

    activeLayout : Layout = 'nav';

    @Input()
    navSubject : Subject<void>;

    subs : Subscription[] = [];

    currentLang : string = null;

    hasTermsDot : boolean = false;

    termsLink : string = '/terms';

    constructor (
        private renderer : Renderer2,
        private router : Router,
        private langService : LangService,
        private termsService : TermsService
    ) {
        this.currentLang = this.langService.getCurrentLangCode();
    }

    public ngOnInit () {
        this.subs.push(
            this.navSubject.subscribe(() => {
                defer(() => {
                    this.isActive = !this.isActive;
                });
            })
        );

        this.subs.push(this.langService.onLangChange(() => {
            this.currentLang = this.langService.getCurrentLangCode();
        }));

        this.setTermsState(this.termsService.getTermsSession());
        this.subs.push(this.termsService.onTermsSessionChange.subscribe(session => {
            defer(() => this.setTermsState(session));
        }));
    }

    public ngOnDestroy () : void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    setTermsState ({ isAcceptable, termsId } : TermsSession) {
        this.termsLink = termsId === null ? '/terms' : `/terms/${ termsId }`;
        this.hasTermsDot = isAcceptable;
    }

    onOverlayClick () {
        this.isActive = false;
    }

    onClose () {
        this.isActive = false;
    }

    onSwitchLayout (layout : Layout) {
        this.activeLayout = layout;
    }

    onSwitchLang (langCode : string) {
        this.currentLang = langCode;
        this.langService.use(langCode);
        this.onSwitchLayout('nav');
        this.isActive = false;
    }
}
