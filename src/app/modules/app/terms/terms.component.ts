import {ChangeDetectionStrategy, Component, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {TitleService} from '../../../services/title.service';

@Component({
    templateUrl: './terms.component.html',
    styleUrls: [ './terms.component.scss' ],
    changeDetection: ChangeDetectionStrategy.Default
})
export class TermsComponent implements OnInit {
    constructor (
        private renderer : Renderer2,
        private router : Router,
        private titleService : TitleService,
    ) {}

    public ngOnInit () {
        this.titleService.setRawTitle('Terms', false);
    }
}
