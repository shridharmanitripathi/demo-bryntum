import {Input, Component, EventEmitter, Output, ElementRef} from '@angular/core';

@Component({
    selector: 'theme-button',
    template: `<button (click)="handleClick()">{{theme}}</button>`,
    styleUrls: ['button.component.scss']
})

export class ButtonComponent {
    @Input() theme = '';
    @Output() action = new EventEmitter<string>();

    constructor(private elementRef: ElementRef) {  }

    public setSelected(selectedTheme: string) {
        const isSelected: boolean = this.theme.toLowerCase() === selectedTheme.toLowerCase()
        this.elementRef.nativeElement.classList[isSelected ? 'add' : 'remove']('selected');
    }

    handleClick() {
        this.action.emit(this.theme);
    }
}
