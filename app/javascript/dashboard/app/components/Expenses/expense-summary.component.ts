import { OnInit, Input, Output, Component, EventEmitter } from '@angular/core';

import templateStr from './expense-summary.component.html';
import './expense-summary.component.scss';

@Component({
	selector: 'app-expense-summary',
	template: templateStr,
})
export class ExpenseSummary implements OnInit {
	@Input() cards;
	@Input() payees;
	@Input() data;
	@Output() filterUpdate: EventEmitter<any> = new EventEmitter();

	public cardsSelected: string[] = [];
	public payeesSelected: string[] = [];

	constructor() {}

	ngOnInit() {}

	getTotal(selection, which) {
		return this.data.reduce((total, expense) => {
			if (expense[which]['name'] === selection.name) {
				total += expense.amtRemaining;
			}
			return total;
		}, 0);
	}

	setSelected(event, item, which) {
		const selectedList = which === 'card' ? this.cardsSelected : this.payeesSelected;
		if (event.checked) {
			selectedList.push(item.name);
		} else {
			const index = selectedList.findIndex(listItem => listItem === item.name);
			selectedList.splice(index, 1);
		}
		which === 'card' ? (this.cardsSelected = selectedList) : (this.payeesSelected = selectedList);
		this.filterUpdate.emit({ cardFilter: this.cardsSelected, payeeFilter: this.payeesSelected });
	}
}
