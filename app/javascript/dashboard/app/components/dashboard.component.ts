import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-dashboard",
  template: `
    <h4>Expenses for {{ user.email }}</h4>
    <app-expenses></app-expenses>
  `
})
export class DashboardComponent implements OnInit {
  user: object = {};

  constructor() {}

  ngOnInit() {
    this.user = this.getCurrentUser();

    console.log("DashboardComponent.js -- Initializing dashboard component.");
    console.log(" -- Logged in as ", this.user["email"]);
  }

  /**
   * Work around to get current user attribute passed from Rails after login.
   */
  getCurrentUser() {
    const dashboardComponent = document.querySelector("app-dashboard");

    if (dashboardComponent) {
      const attributes = dashboardComponent.getAttribute("data-user");
      return JSON.parse(attributes);
    }

    return {};
  }
}
