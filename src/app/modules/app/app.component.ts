import {ChangeDetectionStrategy, Component, OnInit, Renderer2} from '@angular/core';
import {forIn} from 'lodash';
import {NavigationEnd, Router} from '@angular/router';
import {DeviceService} from '../../services/device.service';
import {TitleService} from '../../services/title.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
    constructor (
        private renderer : Renderer2,
        private router : Router,
        private deviceService : DeviceService,
        private titleService : TitleService
    ) {
        this.titleService.setRawTitle('tapNpay', false);

        // When very first route loaded, hide app screen
        const routerSub = router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                routerSub.unsubscribe();
                this.hideAppScreen();
            }
        });
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

    public hideAppScreen () : void {
        const appScreen = document.querySelector('.app-screen');
        this.renderer.listen(appScreen, 'transitionend', () => this.renderer.removeChild(appScreen.parentNode, appScreen));
        this.renderer.addClass(appScreen, 'app-screen_fade-out');
    }
}
