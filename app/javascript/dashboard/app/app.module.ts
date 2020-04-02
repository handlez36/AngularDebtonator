import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';

import { DashboardComponent } from './components/dashboard.component';
import { ExpensesComponent } from './components/expenses.component';
import { TabularView } from './components/Common/tabular-view.component';
import { ExpenseService } from './services/expense.service';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { CovalentPagingModule } from '@covalent/core/paging';
import { CovalentSearchModule } from '@covalent/core/search';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';
import { CovalentBaseEchartsModule } from '@covalent/echarts/base';

@NgModule({
	declarations: [DashboardComponent, ExpensesComponent, TabularView],
	imports: [
		BrowserModule,
		CovalentLayoutModule,
		CovalentDynamicFormsModule,
		CovalentDataTableModule,
		CovalentBaseEchartsModule,
		CovalentSearchModule,
		CovalentPagingModule,
		BrowserAnimationsModule,
		FormsModule,
		MatIconModule,
		MatCardModule,
		MatSelectModule,
	],
	providers: [ExpenseService, CurrencyPipe],
	bootstrap: [DashboardComponent],
})
export class AppModule {}
