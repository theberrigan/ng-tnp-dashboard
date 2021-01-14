import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnInit,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {defer} from '../../../lib/utils';
import {LANGS, LangService} from '../../../services/lang.service';

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
export class NavMobileComponent implements OnInit {
    readonly langs = LANGS;

    @HostBinding('class.nav-mobile_open')
    isActive : boolean = false;

    activeLayout : Layout = 'nav';

    @Input()
    navSubject : Subject<void>;

    subs : Subscription[] = [];

    currentLang : string = null;

    constructor (
        private renderer : Renderer2,
        private router : Router,
        private langService : LangService
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

        this.langService.onLangChange(() => {
            this.currentLang = this.langService.getCurrentLangCode();
        });
    }

    onOverlayClick () {
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
