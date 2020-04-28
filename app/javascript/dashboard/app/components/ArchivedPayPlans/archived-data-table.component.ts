import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import {
	ITdDataTableColumn,
	TdDataTableSortingOrder,
	TdDataTableService,
	ITdDataTableSortChangeEvent,
	ITdDataTableRowClickEvent,
} from '@covalent/core/data-table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IPageChangeEvent, TdPagingBarComponent } from '@covalent/core/paging';

import { ArchivedPlanDetail } from './archived-plan-detail.component';
import { PlanService } from './../../services/plans.service';
import templateString from './archived-data-table.component.html';
import './archived-data-table.component.scss';

const COLUMN_WIDTHS: object = {
	xs: 80,
	sm: 100,
	md: 125,
	lg: 200,
};

@Component({
	selector: 'app-archived-data-table',
	template: templateString,
})
export class ArchivedDataTable {
	@ViewChild(TdPagingBarComponent, { static: true }) pagingBar: TdPagingBarComponent;
	@Input() plans: any[] = null;
	@Input() columnLabels;

	public planData: any[] = null;
	public columns: ITdDataTableColumn[] = [];
	public sortBy: string = 'date';
	public sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
	public filterTerm: string = '';
	public selectedRows: any[] = [];
	public fromRow: any = 1;
	public currentPage: any = 1;
	public pageSize: any = 10;
	public focusedPlan: any;

	constructor(
		private _dataTableService: TdDataTableService,
		private planService: PlanService,
		public dialog: MatDialog,
	) {}

	ngOnInit() {
		this.planService.focusedPlan.subscribe(
			info => (this.focusedPlan = info),
			err => console.log(`Error retreiving focused plan update: ${err}`),
		);
	}

	ngOnChanges() {
		this.setDataAttributes();
	}

	setDataAttributes() {
		if (!this.planData && this.plans) {
			this.planData = this.plans;
			this.columns = this.formatColumns(this.planData);
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
		this.sortBy = sortEvent.name;
		this.sortOrder = sortEvent.order;
		this.refreshTable();
	}

	filter(filterTerm: string): void {
		this.filterTerm = filterTerm;
		this.pagingBar.navigateToPage(1);
		this.refreshTable();
	}

	page(pagingEvent: IPageChangeEvent): void {
		this.fromRow = pagingEvent.fromRow;
		this.currentPage = pagingEvent.page;
		this.pageSize = pagingEvent.pageSize;
		this.refreshTable();
	}

	onPlanSelected(plan: ITdDataTableRowClickEvent) {
		this.planService.setFocusedPlan(plan.row['id']);
		// const dialogRef = this.dialog.open(ArchivedPlanDetail, {
		// 	width: '400px',
		// 	data: { id: plan.row['id'] },
		// });
	}

	refreshTable(): void {
		let newData: any[] = this.plans;

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

		newData = this._dataTableService.pageData(
			newData,
			this.fromRow,
			this.currentPage * this.pageSize,
		);

		this.planData = newData;
		this.selectedRows = [];
	}
}
