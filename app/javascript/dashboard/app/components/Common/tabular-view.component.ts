import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
	ITdDataTableColumn,
	TdDataTableSortingOrder,
	TdDataTableService,
	ITdDataTableSortChangeEvent,
	ITdDataTableSelectEvent,
} from '@covalent/core/data-table';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService, LoadingType, LoadingMode } from '@covalent/core/loading';
import { IPageChangeEvent, TdPagingBarComponent } from '@covalent/core/paging';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';

import { ExpenseForm } from '../Forms/expense-form.component';
import { PaymentForm } from '../Forms/payment-form.component';
import { ExpenseService } from '../../services/expense.service';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';
import { TABLE_MODE } from '../../utils/constants';
import templateStr from './tabular-view.component.html';
import './tabular-view.component.scss';

const COLUMN_WIDTHS: object = {
	xs: 80,
	sm: 100,
	md: 125,
	lg: 200,
};

@Component({
	selector: 'app-tabular-view',
	template: templateStr,
})
export class TabularView implements OnInit {
	@ViewChild(TdPagingBarComponent, { static: true }) pagingBar: TdPagingBarComponent;
	@Input() data: any[];
	@Input() error: string;
	@Input() filterable: string[];
	@Input() columnLabels: string[];
	@Output() expensesUpdated: EventEmitter<any> = new EventEmitter();

	public TABLE_MODE = TABLE_MODE;
	public isLoading: boolean = true;
	public formattedData: any[] = null;
	public unPaginatedData: object[] = [];
	public columns: ITdDataTableColumn[] = [];
	public sortBy: string = 'date';
	public sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
	public filterTerm: string = '';
	public selectedRows: any[] = [];
	public fromRow: any = 1;
	public currentPage: any = 1;
	public pageSize: any = 10;
	public range: string = '';
	public mode: TABLE_MODE = this.TABLE_MODE.VIEW;
	public cards: string[] = [];
	public payees: string[] = [];
	public cardFilter: string[] = [];
	public payeeFilter: string[] = [];
	public showFilters: boolean = false;

	constructor(
		private currencyPipe: CurrencyPipe,
		private _dataTableService: TdDataTableService,
		public dialog: MatDialog,
		private _loadingService: TdLoadingService,
		private _dialogService: TdDialogService,
		private expenseService: ExpenseService,
		private paymentService: PaymentService,
		private userService: UserService,
	) {}

	ngOnInit() {
		console.log('TabularViewComponent.ts#ngOnInit()');
		this.setDataAttributes();
	}

	ngOnChanges(props) {
		console.log('TabularViewComponent.ts#ngOnChanges()');
		this.setDataAttributes();
	}

	setDataAttributes() {
		// Only populate the data variable if it has not yet been populated
		// if (!this.formattedData && this.data && this.data.length > 0) {
		if (this.data && this.data.length > 0) {
			this.formattedData = this.data;
			this.columns = this.formatColumns(this.data);
			this.refreshTable();
			this.payees = this.formattedData
				? this.extractUniqueValues(this.formattedData, 'responsibleParty')
				: [];
			this.cards = this.formattedData ? this.extractUniqueValues(this.formattedData, 'card') : [];
			this.isLoading = false;
		} else if (!this.data && !this.error) {
			this.isLoading = true;
		}
	}

	formatColumns(data: any[]): any[] {
		if (!data || data.length < 1 || !this.columnLabels) return [];

		return Object.keys(this.columnLabels).map(columnId => ({
			name: columnId,
			label: this.columnLabels[columnId].label,
			format: this.columnLabels[columnId].format,
			width: COLUMN_WIDTHS[this.columnLabels[columnId].width],
			sortable: true,
		}));
	}

	onSort(sortEvent: ITdDataTableSortChangeEvent): void {
		console.log('TabularView#sort');
		this.sortBy = sortEvent.name;
		this.sortOrder = sortEvent.order;
		this.refreshTable();
	}

	filter(filterTerm: string): void {
		console.log('TabularView#filter');
		this.filterTerm = filterTerm;
		this.pagingBar.navigateToPage(1);
		this.refreshTable();
	}

	page(pagingEvent: IPageChangeEvent): void {
		console.log('TabularView#refreshTable');
		this.fromRow = pagingEvent.fromRow;
		this.currentPage = pagingEvent.page;
		this.pageSize = pagingEvent.pageSize;
		this.refreshTable();
	}

	toggleFilters() {
		this.showFilters = !this.showFilters;
	}

	splitDollarsAndCents(value, which) {
		let result = 0;

		try {
			const currency = this.currencyPipe.transform(value);
			const index = which === 'd' ? 0 : 1;
			return currency.split('.')[index];
		} catch (e) {
			return result;
		}
	}

	getSelectedAmount() {
		return this.selectedRows.reduce((total, row) => {
			total += parseFloat(row.amtRemaining);
			return total;
		}, 0.0);
	}

	getTotalUnpaginatedExpenses() {
		return this.unPaginatedData.reduce((total, item) => {
			total +=
				parseFloat(item['amtCharged']) -
				parseFloat(item['amtPaid']) +
				parseFloat(item['amtPending']);
			return total;
		}, 0.0);
	}

	extractUniqueValues(data, param): any[] {
		const set = new Set(data.map(item => item[param]['id']));
		const arr: object[] = Array.from(set).map(val => {
			return { ...data.find(d => d[param]['id'] === val)[param] };
		});
		return arr;
	}

	onFilterUpdate(event) {
		this.cardFilter = event.cardFilter;
		this.payeeFilter = event.payeeFilter;
		this.refreshTable();
	}

	onPay() {
		let data = { cards: this.cards, payees: this.payees, expenses: this.selectedRows };
		const dialogRef = this.dialog.open(PaymentForm, {
			width: '400px',
			data,
		});
	}

	onManage(mode, row = null) {
		console.log('TabularView#add');
		this.mode = mode;

		let data = { cards: this.cards, payees: this.payees, ...row, mode };
		const dialogRef = this.dialog.open(ExpenseForm, {
			width: '400px',
			data,
		});
	}

	onConfirm() {
		const id = this.userService.getUserId();
		this._dialogService
			.openConfirm({
				message: 'Are you sure?',
				title: 'Confirm',
				cancelButton: 'Nope',
				acceptButton: 'Yep',
			})
			.afterClosed()
			.subscribe((accept: boolean) => {
				if (accept) {
					const expenseIds = this.selectedRows.map(row => row.id);
					this.expenseService.deleteExpenses(id, expenseIds);
				} else {
					this._dialogService.closeAll();
				}
			});
	}

	addTest() {
		this.mode = this.TABLE_MODE.ADD;
		const payees = this.formattedData
			? this.extractUniqueValues(this.formattedData, 'responsibleParty')
			: [];
		const cards = this.formattedData ? this.extractUniqueValues(this.formattedData, 'card') : [];
		const dialogRef = this.dialog.open(ExpenseForm, {
			width: '400px',
			data: {
				mode: 'EDIT',
				date: '2020-04-01',
				retailer: 'Walmart',
				howToPay: 'TEST',
				amtCharged: '10.00',
				cards,
				payees,
			},
		});
	}

	refreshTable(): void {
		console.log('TabularView#refreshTable');

		let newData: any[] = this.data;
		if (this.cardFilter.length > 0) {
			newData = newData.filter(data => this.cardFilter.includes(data.card.name));
		}
		if (this.payeeFilter.length > 0) {
			newData = newData.filter(
				data =>
					this.payeeFilter.length > 0 && this.payeeFilter.includes(data.responsibleParty.name),
			);
		}

		newData = this._dataTableService.filterData(newData, this.filterTerm, true);
		if (this.sortBy === 'date') {
			newData.sort((a: any, b: any) => {
				if (this.sortOrder === TdDataTableSortingOrder.Ascending) {
					if (a[this.sortBy] > b[this.sortBy]) return 1;
					if (b[this.sortBy] > a[this.sortBy]) return -1;
				} else {
					if (a[this.sortBy] < b[this.sortBy]) return 1;
					if (b[this.sortBy] < a[this.sortBy]) return -1;
				}

				return 0;
			});
		} else {
			newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
		}
		this.unPaginatedData = newData.map(item => ({
			amtCharged: item.amtCharged,
			amtPending: item.amtPending,
			amtPaid: item.amtPaid,
		}));

		newData = this._dataTableService.pageData(
			newData,
			this.fromRow,
			this.currentPage * this.pageSize,
		);

		this.formattedData = newData;
		this.selectedRows = [];
	}
}
