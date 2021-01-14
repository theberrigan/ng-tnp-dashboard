import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {catchError, map, retry, take} from 'rxjs/operators';
import {Observable, Subject, throwError} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

export interface TermsSession {
    isAcceptable : boolean,
    termsId : string
}

@Injectable({
    providedIn: 'root'
})
export class TermsService {
    termsCache : any = {};

    readonly emptyTermsSession : TermsSession = {
        isAcceptable: false,
        termsId: null
    };

    termsSession : TermsSession;

    termsSessionTimeout : any = null;

    onTermsSessionChange = new Subject<{
        isAcceptable : boolean,
        termsId : string
    }>();

    constructor (
        private http : HttpService,
        private sanitizer : DomSanitizer
    ) {
        this.termsSession = this.emptyTermsSession;
        this.restoreTermsSession();
    }

    restoreTermsSession () {
        const termsExp : {
            expireTs : number,
            termsId : string
        } = JSON.parse(window.localStorage.getItem('termsSession'));

        if (termsExp && termsExp.expireTs > Date.now()) {
            this.setTermsSession(termsExp.expireTs, {
                isAcceptable: true,
                termsId: termsExp.termsId
            });
        } else {
            window.localStorage.removeItem('termsSession');
            this.setTermsSession(null);
        }
    }

    setTermsSession (expireTs : number, session? : TermsSession) {
        if (this.termsSessionTimeout !== null) {
            clearTimeout(this.termsSessionTimeout);
            this.termsSessionTimeout = null;
        }

        if (expireTs === null) {
            this.termsSession = this.emptyTermsSession;
            this.termsSessionTimeout = null;
        } else {
            this.termsSession = session;
            this.termsSessionTimeout = setTimeout(() => {
                window.localStorage.removeItem('termsSession');
                this.termsSession = this.emptyTermsSession;
                this.termsSessionTimeout = null;
                this.notifyTermsSessionChange();
            }, expireTs - Date.now());
        }

        this.notifyTermsSessionChange();
    }

    notifyTermsSessionChange () {
        this.onTermsSessionChange.next(this.termsSession || this.emptyTermsSession);
    }

    fetchTerms (lang : string) {
        if (this.termsCache[lang]) {
            return new Observable(subscriber => {
                subscriber.next(this.termsCache[lang]);
            });
        }

        return this.http.get(`/assets/locale/${ lang }.terms.html`, {
            responseType: 'text'
        }).pipe(
            retry(1),
            take(1),
            map((html : any) => {
                html = this.sanitizer.bypassSecurityTrustHtml(html);
                this.termsCache[lang] = html;
                return html;
            }),
            catchError(error => {
                console.warn('fetchTerms error:', error);
                return throwError(error);
            })
        );
    }

    checkTermsSession (termsId : string) {
        return new Observable(subscriber => {
            const response = Date.now() + 72 * 60 * 60 * 1000;
            // ---------------------------------
            const expireTs = response - 5 * 60 * 1000;

            if (expireTs > Date.now()) {
                window.localStorage.setItem('termsSession', JSON.stringify({ expireTs, termsId }));
                this.setTermsSession(expireTs, {
                    isAcceptable: true,
                    termsId
                });
                subscriber.next(true);
            } else {
                window.localStorage.removeItem('termsSession');
                this.setTermsSession(null);
                subscriber.next(false);
            }
        });
    }

    hasTermsSession () {
        return this.termsSessionTimeout !== null;
    }

    getTermsSession () : TermsSession {
        return this.termsSession;
    }

    acceptTerms (termsId : string) {
        window.localStorage.removeItem('termsSession');
        this.setTermsSession(null);
    }
}
