import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import {TranslateModule, TranslateLoader, TranslateCompiler} from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }     from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SharedModule } from '../shared.module';
import {UserService} from '../../services/user.service';
import {DEFAULT_LANG, LangService} from '../../services/lang.service';
import { CONFIG } from '../../../../config/app/dev';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Observable} from 'rxjs';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {TermsComponent} from './terms/terms.component';
import {FaqComponent} from './faq/faq.component';
import {ContactUsComponent} from './contact-us/contact-us.component';

export class LocaleHttpLoader implements TranslateLoader {
    private readonly hashes = LOCALES_HASHES;

    constructor (
        private http : HttpClient
    ) {}

    public getTranslation (lang : string) : Observable<Object> {
        const hash = (
            this.hashes[ lang.toLowerCase() ] || APP_VERSION ||
            new Date().toISOString().match(/^\d+-\d+-\d+/)[0]
        );

        return this.http.get(`/assets/locale/${ lang }.json?${ hash }`);
    }
}

export function initApp (
    userService : UserService,
    langService : LangService
) {
    return () : Promise<any> => {
        return new Promise((resolve) => {
            langService.setDefaultLang(DEFAULT_LANG.code);
            userService.initUser().then(() => {
                return langService.use(userService.getCurrentLangCode()).toPromise()
            }).then(() => resolve());
        });
    }
}

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent,
        TermsComponent,
        FaqComponent,
        ContactUsComponent
    ],
    imports: [
        BrowserAnimationsModule,
        // BrowserModule,
        SharedModule,
        HttpClientModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: LocaleHttpLoader,
                deps: [ HttpClient ]
            },
            compiler: {
                provide: TranslateCompiler,
                useClass: TranslateMessageFormatCompiler
            }
        })
    ],
    exports: [
        TermsComponent,
        FaqComponent,
        ContactUsComponent
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initApp,
            deps: [
                UserService,
                LangService
            ],
            multi: true
        },
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
