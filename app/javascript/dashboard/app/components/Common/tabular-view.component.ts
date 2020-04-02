import { Component, ViewChild, Input, OnInit } from '@angular/core';
import {
	ITdDataTableColumn,
	TdDataTableSortingOrder,
	TdDataTableService,
	ITdDataTableSortChangeEvent,
} from '@covalent/core/data-table';
import { IPageChangeEvent, TdPagingBarComponent } from '@covalent/core/paging';

import templateStr from './tabular-view.component.html';
import './tabular-view.component.scss';

@Component({
	selector: 'app-tabular-view',
	template: templateStr,
})
export class TabularView implements OnInit {
	@ViewChild(TdPagingBarComponent, { static: true }) pagingBar: TdPagingBarComponent;
	@Input() data: any[];
	@Input() filterable: string[];
	@Input() columnLabels: string[];

	public formattedData: any[] = null;
	public unPaginatedData: object[] = [];
	public columns: ITdDataTableColumn[] = [];
	public sortBy: string = null;
	public sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
	public filterTerm: string = '';
	public selectedRows: number = 0;
	public fromRow: any = 1;
	public currentPage: any = 1;
	public pageSize: any = 10;
	public range: string = '';

	constructor(private _dataTableService: TdDataTableService) {}

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
			console.log('Data: ', this.data);
			this.formattedData = this.data;
			this.columns = this.formatColumns(this.data);
			this.refreshTable();
		}
	}

	formatColumns(data: any[]): any[] {
		if (!data || data.length < 1 || !this.columnLabels) return [];

		return Object.keys(this.columnLabels).map(columnId => ({
			name: columnId,
			label: this.columnLabels[columnId].label,
			format: this.columnLabels[columnId].format,
			width: columnId === 'amt_paid' ? 180 : null,
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

	getTotalUnpaginatedExpenses() {
		return this.unPaginatedData.reduce((total, item) => {
			total +=
				parseFloat(item['amt_charged']) -
				parseFloat(item['amt_paid']) +
				parseFloat(item['amt_pending']);
			return total;
		}, 0.0);
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
			amt_charged: item.amt_charged,
			amt_pending: item.amt_pending,
			amt_paid: item.amt_paid,
		}));

		newData = this._dataTableService.pageData(
			newData,
			this.fromRow,
			this.currentPage * this.pageSize,
		);

		this.formattedData = newData;
	}
}
