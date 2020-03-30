import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { DashboardComponent } from "./components/dashboard.component";
import { ExpensesComponent } from "./components/expenses.component";
import { ExpenseService } from "./services/expense.service";

@NgModule({
  declarations: [DashboardComponent, ExpensesComponent],
  imports: [BrowserModule],
  providers: [ExpenseService],
  bootstrap: [DashboardComponent]
})
export class AppModule {}
