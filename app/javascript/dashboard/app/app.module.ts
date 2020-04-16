import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { CovalentTabSelectModule } from '@covalent/core/tab-select';
import { CovalentPagingModule } from '@covalent/core/paging';
import { CovalentSearchModule } from '@covalent/core/search';
import { CovalentMessageModule } from '@covalent/core/message';
import { CovalentDialogsModule, TdConfirmDialogComponent } from '@covalent/core/dialogs';
import {
	CovalentDynamicFormsModule,
	TdDynamicDatepickerComponent,
	TdDynamicInputComponent,
	TdDynamicSelectComponent,
	TdDynamicTextareaComponent,
} from '@covalent/dynamic-forms';
import { CovalentSidesheetModule } from '@covalent/core/sidesheet';
import { CovalentLoadingModule, TdLoadingComponent } from '@covalent/core/loading';
import { CovalentBaseEchartsModule } from '@covalent/echarts/base';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

/** Pages */
import { App } from './components/app.component';
import { DashboardPage } from './components/dashboard.component';
import { SetupPage } from './components/setup-page.component';

/** Components */
import { ExpensesComponent } from './components/expenses.component';
import { PayPlanSection } from './components/PayPlans/pay-plan-section';
import { PayPlan } from './components/PayPlans/pay-plan.component';
import { TabularView } from './components/Common/tabular-view.component';
import { ExpenseSummary } from './components/Expenses/expense-summary.component';
import { PendingPaidField } from './components/Expenses/pending-paid-field.component';
import { CardPayeeField } from './components/Expenses/card-payee-field.component';
import { DateField } from './components/Expenses/date-field.component';
import { PayPlanPayeeSummary } from './components/PayPlans/pay-plan-payee-summary.component';
import { PayPlanPayeeDetail } from './components/PayPlans/pay-plan-payee-detail.component';
import { PayPlanNotesFilter } from './components/PayPlans/pay-plan-notes-filter.component';
import { SetupManagementCard } from './components/Setup/setup-management-card.component';
import { SetupManageFooter } from './components/Setup/setup-manage-footer.component';
import { SetupManageContent } from './components/Setup/setup-manage-content.component';

/** Forms */
import { ExpenseForm } from './components/Forms/expense-form.component';
import { PaymentForm } from './components/Forms/payment-form.component';

/** Services */
import { ExpenseService } from './services/expense.service';
import { PaymentService } from './services/payment.service';
import { PlanService } from './services/plans.service';
import { UserService } from './services/user.service';
import { CardService } from './services/card.service';
import { Utils, ApiUtils } from './services/utils.service';
import { Currency } from './services/currency';

// Set CSRF-Token param on GraphQL http link
export function getFactoryParams(httpLink) {
	const metaTagEl = document.querySelector("head meta[name='csrf-token']");
	let token = '';
	if (metaTagEl) {
		token = metaTagEl.getAttribute('content');
	}

	const httpOptions = {
		headers: new HttpHeaders({
			'X-CSRF-Token': token,
			// withCredentials: 'true',
		}),
	};
	const link = httpLink.create({
		uri: 'http://localhost:5000/graphql',
		...httpOptions,
	});
	const cache = new InMemoryCache();

	return { cache, link };
}

const appRoutes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'v2', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardPage },
	{ path: 'setup', component: SetupPage },
	// { path: '**', component: PageNotFoundComponent }
];

@NgModule({
	declarations: [
		App,
		DashboardPage,
		SetupPage,
		ExpensesComponent,
		TabularView,
		PendingPaidField,
		CardPayeeField,
		DateField,
		ExpenseForm,
		PaymentForm,
		ExpenseSummary,
		PayPlanSection,
		PayPlan,
		PayPlanPayeeSummary,
		PayPlanPayeeDetail,
		PayPlanNotesFilter,
		SetupManagementCard,
		SetupManageContent,
		SetupManageFooter,
	],
	imports: [
		RouterModule.forRoot(appRoutes, { enableTracing: false }),
		BrowserModule,
		HttpClientModule,
		CovalentLayoutModule,
		CovalentDynamicFormsModule,
		CovalentDataTableModule,
		CovalentBaseEchartsModule,
		CovalentSearchModule,
		CovalentPagingModule,
		CovalentMessageModule,
		CovalentDialogsModule,
		CovalentSidesheetModule,
		CovalentTabSelectModule,
		BrowserAnimationsModule,
		FormsModule,
		MatIconModule,
		MatCardModule,
		MatSelectModule,
		MatDialogModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatMomentDateModule,
		MatToolbarModule,
		MatSidenavModule,
		MatInputModule,
		MatListModule,
		CovalentLoadingModule,
		ApolloModule,
		HttpLinkModule,
	],
	entryComponents: [
		ExpenseForm,
		PaymentForm,
		TdDynamicDatepickerComponent,
		TdDynamicInputComponent,
		TdDynamicSelectComponent,
		TdDynamicTextareaComponent,
		TdLoadingComponent,
		TdConfirmDialogComponent,
	],
	providers: [
		ExpenseService,
		PaymentService,
		UserService,
		PlanService,
		CardService,
		Utils,
		ApiUtils,
		Currency,
		CurrencyPipe,
		{
			provide: APOLLO_OPTIONS,
			useFactory: (httpLink: HttpLink) => getFactoryParams(httpLink),
			deps: [HttpLink],
		},
	],
	bootstrap: [App],
})
export class AppModule {}
