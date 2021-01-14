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
import {AppBarService} from '../../../services/app-bar.service';
import {TermsService} from '../../../services/terms.service';
import {defer} from '../../../lib/utils';

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
        private appBarService : AppBarService,
        private termsService : TermsService
    ) {}

    public ngOnInit () {
        this.title = this.appBarService.getLastTitle();
        this.hasTermsDot = this.termsService.hasTermsSession();

        this.subs.push(this.appBarService.onTitleChange.subscribe(title => {
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
