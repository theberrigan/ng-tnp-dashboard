import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {catchError, map, retry, take} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class TermsService {
    termsCache : any = {};

    constructor (
        private http : HttpService,
        private sanitizer : DomSanitizer
    ) {}

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
}
