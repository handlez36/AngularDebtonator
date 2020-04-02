import { Injectable } from "@angular/core";
import axios from "axios";

@Injectable({
  providedIn: "root"
})
export class ExpenseService {
  private expenses: object[] = [];

  constructor() {
    console.log("ExpenseService.ts -- Expense Service being initiated");
  }

  async getAllExpenses(filters: object = null) {
    const url = "/api/expenses";

    const response: object = await axios.get(url);

    if (response && response["data"] && response["status"] === 200) {
      let expenses = [];
      if (response["data"] && response["data"]["expenses"]) {
        expenses = response["data"]["expenses"];
      }

      this.expenses = expenses;
      return { data: expenses, error: null };
    } else {
      return { data: null, error: "Error retrieving expense data" };
    }
  }
}
