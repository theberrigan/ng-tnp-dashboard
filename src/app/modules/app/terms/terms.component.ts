import {
    ChangeDetectionStrategy,
    Component, ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location} from '@angular/common';
import {TitleService} from '../../../services/title.service';
import {LangService} from '../../../services/lang.service';
import {fromEvent, Subscription, zip} from 'rxjs';
import {TermsService} from '../../../services/terms.service';
import {SafeHtml} from '@angular/platform-browser';
import {AppBarService} from '../../../services/app-bar.service';
import {DeviceService, ViewportBreakpoint} from '../../../services/device.service';
import {defer} from '../../../lib/utils';
import {ToastService} from '../../../services/toast.service';

@Component({
    selector: 'terms',
    templateUrl: './terms.component.html',
    styleUrls: [ './terms.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    host: {
        'class': 'terms'
    }
})
export class TermsComponent implements OnInit, OnDestroy {
    public isReady : boolean = false;

    public isAcceptable : boolean = false;

    public content : string | SafeHtml = '';

    public subs : Subscription[] = [];

    public termsId : string = null;

    @ViewChild('contentEl')
    contentEl : ElementRef;

    @ViewChild('panelEl')
    panelEl : ElementRef;

    viewportBreakpoint : ViewportBreakpoint;

    panelBottom : number = 0;

    contentBottomPadding : number = 0;

    isPanelSticky : boolean = false;

    isChecked : boolean = false;

    isSubmitting : boolean = false;

    constructor (
        private renderer : Renderer2,
        private router : Router,
        private route : ActivatedRoute,
        private location : Location,
        private titleService : TitleService,
        private langService : LangService,
        private termsService : TermsService,
        private appBarService : AppBarService,
        private deviceService : DeviceService,
        private toastService : ToastService,
    ) {
        this.viewportBreakpoint = this.deviceService.viewportBreakpoint;
        window.scroll(0, 0);
    }

    public ngOnInit () {
        this.titleService.setRawTitle('Terms & Conditions', false);
        this.appBarService.setTitle('Terms & Conditions');

        this.termsId = this.route.snapshot.params['id'] || null;
        this.isReady = false;
        const langCode = this.langService.getCurrentLangCode();

        if (this.termsId) {
            this.subs.push(zip(
                this.termsService.checkTermsSession(this.termsId),
                this.termsService.fetchTerms(langCode)
            ).subscribe(([ isAcceptable, termsHtml ] : [ boolean, string | SafeHtml ]) => {
                this.isAcceptable = isAcceptable;
                this.content = termsHtml;
                this.isReady = true;
                defer(() => this.redraw());
            }));
        } else {
            this.isAcceptable = false;
            this.subs.push(this.termsService.fetchTerms(langCode).subscribe(html => {
                this.content = html;
                this.isReady = true;
                defer(() => this.redraw());
            }));
        }

        this.subs.push(this.langService.onLangChange(() => {
            this.loadTerms();
        }));

        this.subs.push(this.termsService.onTermsSessionChange.subscribe(({ isAcceptable, termsId }) => {
            this.isAcceptable = this.termsId === termsId && isAcceptable;
        }));

        this.subs.push(fromEvent(window, 'scroll').subscribe(() => this.redraw()));
        this.subs.push(fromEvent(window, 'resize').subscribe(() => this.redraw()));

        this.deviceService.onResize.subscribe(message => {
            if (message.breakpointChange) {
                this.viewportBreakpoint = this.deviceService.viewportBreakpoint;
                defer(() => this.redraw());
            }
        });
    }

    public ngOnDestroy () {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public loadTerms () {
        this.isReady = false;
        const langCode = this.langService.getCurrentLangCode();

        this.termsService.fetchTerms(langCode).subscribe((html) => {
            this.content = html;
            this.isReady = true;
            defer(() => this.redraw());
        });
    }

    public redraw () {
        if (!this.isAcceptable || !this.contentEl || !this.panelEl) {
            return;
        }

        this.panelBottom = Math.max(0, window.innerHeight - Math.round(this.contentEl.nativeElement.getBoundingClientRect().bottom));
        this.contentBottomPadding = Math.round(this.panelEl.nativeElement.getBoundingClientRect().height) + 30;
        this.isPanelSticky = this.panelBottom > 1;
    }

    public onSubmit () {
        if (!this.isChecked || !this.termsId) {
            return;
        }

        this.isSubmitting = true;

        const onDone = isOk => {
            if (isOk) {
                this.location.replaceState('/terms');

                this.toastService.create({
                    message: [ 'terms.accept.ok' ],
                    timeout: 6000
                });
            } else {
                this.toastService.create({
                    message: [ 'terms.accept.error' ],
                    timeout: 7000
                });
            }

            this.isSubmitting = false;
        };

        // TEST-PH-7755026
        this.subs.push(this.termsService.acceptTerms(this.termsId).subscribe(
            isOk => onDone(isOk),
            () => onDone(false)
        ));
    }
}
