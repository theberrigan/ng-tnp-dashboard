import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {TermsService} from '../../../services/terms.service';
import {defer} from '../../../lib/utils';
import {TitleService} from '../../../services/title.service';

@Component({
    selector: 'app-bar',
    templateUrl: './app-bar.component.html',
    styleUrls: [ './app-bar.component.scss' ],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'app-bar'
    }
})
export class AppBarComponent implements OnInit, OnDestroy {
    @Input()
    navSubject : Subject<void>;

    subs : Subscription[] = [];

    title : string = '&nbsp;';

    hasTermsDot : boolean = false;

    constructor (
        private renderer : Renderer2,
        private router : Router,
        private titleService : TitleService,
        private termsService : TermsService
    ) {}

    public ngOnInit () {
        this.title = this.titleService.getLastHeader();
        this.hasTermsDot = this.termsService.hasTermsSession();

        this.subs.push(this.titleService.onHeaderChange.subscribe(title => {
            defer(() => this.title = title);
        }));

        this.subs.push(this.termsService.onTermsSessionChange.subscribe(({ isAcceptable })  => {
            defer(() => this.hasTermsDot = isAcceptable);
        }));
    }

    public ngOnDestroy () {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onTriggerClick () {
        this.navSubject.next();
    }
}
