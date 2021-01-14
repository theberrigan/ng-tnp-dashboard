import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import {TermsComponent} from './terms/terms.component';
import {FaqComponent} from './faq/faq.component';
import {ContactUsComponent} from './contact-us/contact-us.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/terms',
        pathMatch: 'full'
    },
    {
        path: 'terms',
        component: TermsComponent,
    },
    {
        path: 'terms/:id',
        component: TermsComponent,
    },
    {
        path: 'faq',
        component: FaqComponent,
    },
    {
        path: 'contact-us',
        component: ContactUsComponent,
    },
    {
        path: 'not-found',
        component: NotFoundComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
