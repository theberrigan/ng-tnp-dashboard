import {ChangeDetectionStrategy, Component, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {TitleService} from '../../../services/title.service';
import {DeviceService, ViewportBreakpoint} from '../../../services/device.service';

@Component({
    selector: 'faq',
    templateUrl: './faq.component.html',
    styleUrls: [ './faq.component.scss' ],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'faq'
    }
})
export class FaqComponent implements OnInit {
    viewportBreakpoint : ViewportBreakpoint;

    readonly items = [
        'what_is_tapnpay',
        'how_does_it_work',
        'will_it_work_on_any_cell_phone',
        'what_cell_phone_carriers_does_this_service_work_with',
        'what_is_the_advantage_to_using_tapnpay',
        'are_the_toll_road_fees_the_same',
        'if_i_participate',
        'will_it_work_on_any',
        'do_i_have_to_have_a_credit',
        'do_i_need_to_have_a_texas_license_plate',
        'is_this_a_type_of_toll_tag',
        'what_if_i_have_a_toll_tag_already',
        'do_i_have_to_register',
        'how_do_i_register',
        'what_does_it_cost_to_register',
        'what_if_i_use_a_pre_paid_phone_plan',
        'what_happens_if_i_sell_my_car',
        'i_have_toll_violation_notices',
        'will_i_still_get_toll_invoices_in_the_mail',
        'can_i_register_multiple_vehicles',
        'we_drive_multiple_vehicles',
        'will_it_work_if_i_drive_a_motorcycle',
        'who_do_i_contact_for_help',
    ];

    activeKey : string = null;

    constructor (
        private renderer : Renderer2,
        private router : Router,
        private titleService : TitleService,
        private deviceService : DeviceService,
    ) {
        window.scroll(0, 0);

        this.viewportBreakpoint = this.deviceService.viewportBreakpoint;
        this.deviceService.onResize.subscribe((message) => {
            if (message.breakpointChange) {
                this.viewportBreakpoint = message.breakpointChange.current;
            }
        });
    }

    public ngOnInit () {
        this.titleService.setTitle('faq.page_title');
        this.titleService.setHeader([ 'faq.page_header' ]);
    }

    public switchItem (key : string) {
        this.activeKey = key === this.activeKey ? null : key;
    }
}
