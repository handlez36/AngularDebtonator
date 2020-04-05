module Types
  class QueryType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # Expense endpoint
    field :expenses, [Types::ExpenseType], null: false, description: "Expense field" do
      argument :id, ID, required: true
      argument :archived, Boolean, required: false, default_value: false
    end
    
    def expenses(id:, archived:)
      all_expenses = User.find(1).expenses
      archived ? all_expenses.archived : all_expenses.current
    end

    # Plans endpoint
    field :pay_plans, [Types::PayplanType], null: false, description: "Plan field" do
      argument :id, ID, required: true
      argument :archived, Boolean, required: false, default_value: false
    end
    
    def pay_plans(id:, archived:)
      all_plans = User.find(1).payplans
      archived ? all_plans.archived : all_plans.current
    end
  end
end
