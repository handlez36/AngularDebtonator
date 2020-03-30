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

    if (response && response["status"] === 200) {
      const { data: { expenses = [] } = {}, error = null } = response;

      this.expenses = expenses;
      return { data: expenses, error };
    } else {
      return { data: null, error: "Error retrieving expense data" };
    }
  }
}
