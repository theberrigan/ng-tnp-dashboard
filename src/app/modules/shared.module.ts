import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {TooltipModule} from 'ng2-tooltip-directive';
import {CheckboxComponent} from './app/_widgets/checkbox/checkbox.component';
import {ButtonComponent} from './app/_widgets/button/button.component';
import {ToastComponent} from './app/_widgets/toast/toast.component';
import {ToastManagerComponent} from './app/_widgets/toast/toast-manager.component';
import {LoaderComponent} from './app/_widgets/loader/loader.component';


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
        CheckboxComponent,
        ButtonComponent,
        ToastComponent,
        ToastManagerComponent,
        LoaderComponent,

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
        CheckboxComponent,
        ButtonComponent,
        ToastComponent,
        ToastManagerComponent,
        LoaderComponent,

        // Directives

        // Pipes
    ],
    entryComponents: [

    ],
    providers: []
})
export class SharedModule {}
