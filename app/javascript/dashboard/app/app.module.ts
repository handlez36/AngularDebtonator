import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';

import { DashboardComponent } from './components/dashboard.component';
import { ExpensesComponent } from './components/expenses.component';
import { TabularView } from './components/Common/tabular-view.component';
import { PendingPaidField } from './components/Expenses/pending-paid-field.component';
import { CardPayeeField } from './components/Expenses/card-payee-field.component';
import { DateField } from './components/Expenses/date-field.component';
import { ExpenseForm } from './components/Forms/expense-form.component';
import { ExpenseService } from './services/expense.service';

import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { CovalentPagingModule } from '@covalent/core/paging';
import { CovalentSearchModule } from '@covalent/core/search';
import {
	CovalentDynamicFormsModule,
	TdDynamicDatepickerComponent,
	TdDynamicInputComponent,
	TdDynamicSelectComponent,
	TdDynamicTextareaComponent,
} from '@covalent/dynamic-forms';
import { CovalentLoadingModule, TdLoadingComponent } from '@covalent/core/loading';
import { CovalentBaseEchartsModule } from '@covalent/echarts/base';

@NgModule({
	declarations: [
		DashboardComponent,
		ExpensesComponent,
		TabularView,
		PendingPaidField,
		CardPayeeField,
		DateField,
		ExpenseForm,
	],
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
		MatDialogModule,
		MatDatepickerModule,
		MatMomentDateModule,
		CovalentLoadingModule,
	],
	entryComponents: [
		ExpenseForm,
		TdDynamicDatepickerComponent,
		TdDynamicInputComponent,
		TdDynamicSelectComponent,
		TdDynamicTextareaComponent,
		TdLoadingComponent,
	],
	providers: [ExpenseService, CurrencyPipe],
	bootstrap: [DashboardComponent],
})
export class AppModule {}
