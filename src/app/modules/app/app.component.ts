import {ChangeDetectionStrategy, Component, HostListener, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {forIn} from 'lodash';
import {NavigationEnd, Router} from '@angular/router';
import {DeviceService, ViewportBreakpoint} from '../../services/device.service';
import {TitleService} from '../../services/title.service';
import {Subject, Subscription} from 'rxjs';
import {TermsService, TermsSession} from '../../services/terms.service';
import {ILang, LANGS, LangService} from '../../services/lang.service';
import {DomService} from '../../services/dom.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    readonly langs = LANGS;

    currentLang : ILang;

    public viewportBreakpoint : ViewportBreakpoint;

    public mobileNavSubject = new Subject();

    hasTermsDot : boolean = false;

    termsLink : string = '/terms';

    isLangMenuActive : boolean = false;

    constructor (
        private renderer : Renderer2,
        private router : Router,
        private deviceService : DeviceService,
        private titleService : TitleService,
        private termsService : TermsService,
        private langService : LangService,
        private domService : DomService,
    ) {
        this.titleService.setRawTitle('tapNpay', false);

        // When very first route loaded, hide app screen
        const routerSub = router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                routerSub.unsubscribe();
                this.hideAppScreen();
            }
        });

        this.viewportBreakpoint = this.deviceService.viewportBreakpoint;
        this.deviceService.onResize.subscribe((message) => {
            if (message.breakpointChange) {
                this.viewportBreakpoint = message.breakpointChange.current;
            }
        });

        this.setTermsState(this.termsService.getTermsSession());
        this.termsService.onTermsSessionChange.subscribe(session => this.setTermsState(session));

        this.updateCurrentLang();
        this.langService.onLangChange(() => this.updateCurrentLang());
    }

    public updateCurrentLang () {
        const currentLangCode = this.langService.getCurrentLangCode();
        this.currentLang = this.langs.find(lang => lang.code === currentLangCode);
    }

    public ngOnInit () {
        this.setDeviceClasses();
        this.setViewportObserver();
    }

    public setDeviceClasses () : void {
        const params = {
            browser: this.deviceService.browser,
            os:      this.deviceService.os,
            device:  this.deviceService.device,
        };

        forIn(params, (paramSection : any, paramSectionKey : string) => {
            forIn(paramSection, (paramValue : any, paramKey : string) => {
                if (paramValue === true) {
                    this.renderer.addClass(document.documentElement, `${ paramSectionKey }_${ paramKey }`);
                }
            });
        });

        document.documentElement.dataset.browserVersion = this.deviceService.browser.version;
    }

    public setViewportObserver () : void {
        this.renderer.addClass(document.documentElement, `viewport_${ this.deviceService.viewportBreakpoint }`);

        this.deviceService.onResize.subscribe(message => {
            if (message.breakpointChange) {
                const { last, current } = message.breakpointChange;

                this.renderer.removeClass(document.documentElement, `viewport_${ last }`);
                this.renderer.addClass(document.documentElement, `viewport_${ current }`);
            }
        });
    }

    setTermsState ({ isAcceptable, termsId } : TermsSession) {
        this.termsLink = termsId === null ? '/terms' : `/terms/${ termsId }`;
        this.hasTermsDot = isAcceptable;
    }

    public hideAppScreen () : void {
        const appScreen = document.querySelector('.app-screen');
        this.renderer.listen(appScreen, 'transitionend', () => this.renderer.removeChild(appScreen.parentNode, appScreen));
        this.renderer.addClass(appScreen, 'app-screen_fade-out');
    }

    onLangItemClick (lang : ILang, e : any) {
        this.currentLang = lang;
        this.langService.use(lang.code);
        this.domService.markEvent(e, 'langItemClick');
    }

    onLangMenuClick (e : any) {
        this.domService.markEvent(e, 'langMenuClick');
    }

    onLangTriggerClick (e : any) {
        this.domService.markEvent(e, 'langTriggerClick');
    }

    @HostListener('document:click', [ '$event' ])
    onDocClick (e : any) {
        if (this.domService.hasEventMark(e, 'langTriggerClick')) {
            this.isLangMenuActive = !this.isLangMenuActive;
        } else if (!this.domService.hasEventMark(e, 'langMenuClick') || this.domService.hasEventMark(e, 'langItemClick')) {
            this.isLangMenuActive = false;
        }
    }
}
