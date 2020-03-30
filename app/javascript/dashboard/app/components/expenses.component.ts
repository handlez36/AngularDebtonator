import { Component, OnInit } from "@angular/core";
import templateString from "./expenses.component.html";

import { ExpenseService } from "../services/expense.service";

@Component({
  selector: "app-expenses",
  template: templateString
})
export class ExpensesComponent implements OnInit {
  expenseService: ExpenseService;
  expenses: object[] = [];
  apiError: string = null;

  constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
  }

  ngOnInit() {
    console.log("ExpensesComponent.ts -- Initializing expenses component.");
    this.retrieveExpenses();
  }

  async retrieveExpenses() {
    console.log(" -- retrieveExpenses...");
    if (!this.expenseService) {
      this.apiError = "Sorry, the expenses Api cannot be called at the moment";
      return;
    }

    const { data, error } = await this.expenseService.getAllExpenses();
    this.expenses = data;
    this.apiError = error;
  }
}
