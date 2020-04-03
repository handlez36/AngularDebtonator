import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { DashboardComponent } from './components/dashboard.component';
import { ExpensesComponent } from './components/expenses.component';
import { TabularView } from './components/Common/tabular-view.component';
import { PendingPaidField } from './components/Expenses/pending-paid-field.component';
import { CardPayeeField } from './components/Expenses/card-payee-field.component';
import { DateField } from './components/Expenses/date-field.component';
import { ExpenseForm } from './components/Forms/expense-form.component';
import { ExpenseService } from './services/expense.service';
import { UserService } from './services/user.service';
import { Utils } from './services/utils.service';

import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
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
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export function getFactoryParams(httpLink) {
	const metaTagEl = document.querySelector("head meta[name='csrf-token']");
	let token = '';
	if (metaTagEl) {
		token = metaTagEl.getAttribute('content');
	}

	const httpOptions = {
		headers: new HttpHeaders({
			'X-CSRF-Token': token,
		}),
	};
	const link = httpLink.create({
		uri: 'http://localhost:5000/graphql',
		...httpOptions,
	});
	const cache = new InMemoryCache();

	return { cache, link };
}

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
		HttpClientModule,
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
		MatButtonModule,
		MatDatepickerModule,
		MatMomentDateModule,
		CovalentLoadingModule,
		ApolloModule,
		HttpLinkModule,
	],
	entryComponents: [
		ExpenseForm,
		TdDynamicDatepickerComponent,
		TdDynamicInputComponent,
		TdDynamicSelectComponent,
		TdDynamicTextareaComponent,
		TdLoadingComponent,
	],
	providers: [
		ExpenseService,
		UserService,
		Utils,
		CurrencyPipe,
		{
			provide: APOLLO_OPTIONS,
			useFactory: (httpLink: HttpLink) => getFactoryParams(httpLink),
			deps: [HttpLink],
		},
	],
	bootstrap: [DashboardComponent],
})
export class AppModule {}
