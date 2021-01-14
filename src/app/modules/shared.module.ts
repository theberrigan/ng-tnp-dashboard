import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {TooltipModule} from 'ng2-tooltip-directive';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        TranslateModule,
        TooltipModule,
    ],
    declarations: [

        // Directives

        // Pipes
    ],
    exports: [
        // Modules
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        TranslateModule,
        TooltipModule,

        // Components

        // Directives

        // Pipes
    ],
    entryComponents: [

    ],
    providers: []
})
export class SharedModule {}
