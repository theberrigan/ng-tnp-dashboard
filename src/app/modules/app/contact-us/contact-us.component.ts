import {ChangeDetectionStrategy, Component, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {TitleService} from '../../../services/title.service';

@Component({
    templateUrl: './contact-us.component.html',
    styleUrls: [ './contact-us.component.scss' ],
    changeDetection: ChangeDetectionStrategy.Default
})
export class ContactUsComponent implements OnInit {
    constructor (
        private renderer : Renderer2,
        private router : Router,
        private titleService : TitleService,
    ) {}

    public ngOnInit () {
        this.titleService.setRawTitle('FAQ', false);
    }
}
