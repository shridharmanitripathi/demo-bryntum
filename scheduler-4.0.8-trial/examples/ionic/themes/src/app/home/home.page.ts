import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulerComponent } from '../scheduler/scheduler.component';
import { HttpClient } from '@angular/common/http';
import { DomHelper } from 'bryntum-scheduler/scheduler.lite.umd.js';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
    @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;
    @ViewChild('headerContainer', {read: ViewContainerRef}) headerContainer;

    // Array of available themes which css be found in build folder
    private themes = ['Stockholm', 'Classic', 'Classic-Light', 'Classic-Dark', 'Material'];
    private themeButtons: Array<ComponentRef<ButtonComponent>> = [];

    // bind properties from the application to the scheduler component
    rowHeight = 50;
    selectedEvent = '';
    events = [];
    resources = [];
    timeRanges = true;
    barMargin = 10;
    startDate = new Date(2018, 1, 7, 8);
    endDate = new Date(2018, 1, 7, 22);
    resourceImagePath = 'assets/users/';

    columns = [
        {type: 'resourceInfo', text: 'Staff', field: 'name'},
        {
            text: 'Type',
            field: 'role',
            width: 130,
            editor: {
                type: 'combo',
                items: ['Sales', 'Developer', 'Marketing', 'Product manager'],
                editable: false,
                pickerWidth: 140
            }
        }
    ];

    eventEdit = {
        // Add extra widgets to the event editor
        items : {
            description : {
                type  : 'text',
                name  : 'desc',
                label : 'Description'
            }
        }
    };

    constructor(private route: ActivatedRoute, private resolver: ComponentFactoryResolver, private http: HttpClient) {
        this.getData();
    }

    // fetch data for the scheduler
    getData() {
        const me = this;
        me.http.get('./assets/data/data.json').subscribe(data => {
            me.resources = data['resources'].rows;
            me.events = data['events'].rows;
            me.timeRanges = data['timeRanges'].rows;
        });
    }

    ngOnInit() {
        const factory: ComponentFactory<ButtonComponent> = this.resolver.resolveComponentFactory(ButtonComponent);

        this.themes.forEach(theme => {
            const button: ComponentRef<ButtonComponent> = this.headerContainer.createComponent(factory);
            button.instance.theme = theme;
            button.instance.action.subscribe((newTheme: string) => this.onSetTheme(newTheme));
            this.themeButtons.push(button);
        });

        this.onSetTheme(this.themes[0]);

        // Get initial theme from theme queryParams
        if (this.route.snapshot.queryParams.theme) {
            this.onSetTheme(this.route.snapshot.queryParams.theme);
        }
    }

    onSetTheme(theme: string) {
        this.themeButtons.forEach(button => {
            button.instance.setSelected(theme);
        });
        DomHelper.setTheme(theme);
    }
}
