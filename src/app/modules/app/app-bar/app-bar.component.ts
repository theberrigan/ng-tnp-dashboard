import {ChangeDetectionStrategy, Component, Input, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

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
export class AppBarComponent implements OnInit {
    @Input()
    navSubject : Subject<void>;

    constructor (
        private renderer : Renderer2,
        private router : Router,
    ) {}

    public ngOnInit () {


    }

    onTriggerClick () {
        this.navSubject.next();
    }
}
