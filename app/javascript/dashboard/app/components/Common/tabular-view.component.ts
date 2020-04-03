import { Component, ViewChild, Input, OnInit } from '@angular/core';
import {
	ITdDataTableColumn,
	TdDataTableSortingOrder,
	TdDataTableService,
	ITdDataTableSortChangeEvent,
} from '@covalent/core/data-table';
import { TdLoadingService, LoadingType, LoadingMode } from '@covalent/core/loading';
import { IPageChangeEvent, TdPagingBarComponent } from '@covalent/core/paging';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';

import { ExpenseForm } from '../Forms/expense-form.component';
import templateStr from './tabular-view.component.html';
import './tabular-view.component.scss';

enum MODE_ENUM {
	VIEW,
	ADD,
	EDIT,
}
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

	public TABLE_MODE = MODE_ENUM;
	public isLoading: boolean = true;
	public formattedData: any[] = null;
	public unPaginatedData: object[] = [];
	public columns: ITdDataTableColumn[] = [];
	public sortBy: string = 'date';
	public sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
	public filterTerm: string = '';
	public selectedRows: number = 0;
	public fromRow: any = 1;
	public currentPage: any = 1;
	public pageSize: any = 10;
	public range: string = '';
	public mode: MODE_ENUM = this.TABLE_MODE.VIEW;

	constructor(
		private currencyPipe: CurrencyPipe,
		private _dataTableService: TdDataTableService,
		public dialog: MatDialog,
		private _loadingService: TdLoadingService,
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
		if (!this.formattedData && this.data && this.data.length > 0) {
			this.formattedData = this.data;
			this.columns = this.formatColumns(this.data);
			this.refreshTable();
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

	sort(sortEvent: ITdDataTableSortChangeEvent): void {
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

	getTotalUnpaginatedExpenses() {
		return this.unPaginatedData.reduce((total, item) => {
			total +=
				parseFloat(item['amtCharged']) -
				parseFloat(item['amtPaid']) +
				parseFloat(item['amtPending']);
			return total;
		}, 0.0);
	}

	extractUniqueValues(data, param) {
		const set = new Set(data.map(item => item['param']['id']));
		const arr: object = Array.from(set).map(val => {
			return { ...data.find(d => d[param]['id'] === val)[param] };
		});
	}

	getCards(data) {
		return ['AmEx'];
	}

	getPayees(data) {
		return ['Joint', 'Suntrust'];
	}

	add(row = null) {
		console.log('TabularView#add');
		this.mode = this.TABLE_MODE.ADD;

		const cards = this.formattedData ? this.getCards(this.formattedData) : [];
		const payees = this.formattedData ? this.getPayees(this.formattedData) : [];
		const dialogRef = this.dialog.open(ExpenseForm, {
			width: '400px',
			data: { cards, payees },
		});
	}

	refreshTable(): void {
		console.log('TabularView#refreshTable');

		let newData: any[] = this.data;
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
	}
}
