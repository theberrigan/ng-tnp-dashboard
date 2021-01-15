import {ChangeDetectionStrategy, Component, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {TitleService} from '../../../services/title.service';
import {defer} from '../../../lib/utils';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../services/toast.service';

@Component({
    selector: 'contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: [ './contact-us.component.scss' ],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'contact-us'
    }
})
export class ContactUsComponent implements OnInit {
    isFormValid : boolean = false;

    isSubmitting : boolean = false;

    form : FormGroup;

    constructor (
        private renderer : Renderer2,
        private router : Router,
        private formBuilder : FormBuilder,
        private titleService : TitleService,
        private toastService : ToastService,
    ) {
        window.scroll(0, 0);
        this.resetForm();
    }

    public ngOnInit () {
        this.titleService.setTitle('contact_us.page_title');
        this.titleService.setHeader([ 'contact_us.page_header' ]);
    }

    validate () {
        defer(() => {
            const form = this.form.getRawValue();

            this.isFormValid = !!(
                form.firstName.trim() &&
                form.lastName.trim() &&
                form.email.trim() &&
                form.phone.trim() &&
                form.comment.trim()
            );
        });
    }

    resetForm () {
        if (this.form) {
            this.form.reset({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                comment: '',
            }, { emitEvent: true });
        } else {
            this.form = this.formBuilder.group({
                firstName: [ '' ],
                lastName: [ '' ],
                email: [ '' ],
                phone: [ '' ],
                comment: [ '' ]
            });

            this.validate();
            this.form.valueChanges.subscribe(() => this.validate());
        }
    }

    onSubmit () {
        if (!this.isFormValid || this.isSubmitting) {
            return;
        }

        this.isSubmitting = true;

        setTimeout(() => {
            this.resetForm();
            this.isSubmitting = false;
            const isOk = true;

            if (isOk) {
                this.toastService.create({
                    message: [ 'contact_us.submit.ok' ],
                    timeout: 7000
                });
            } else {
                this.toastService.create({
                    message: [ 'contact_us.submit.error' ],
                    timeout: 7000
                });
            }
        }, 2000);
    }
}
