module Types
  class MutationType < Types::BaseObject
    field :create_expense, mutation: Mutations::ManageExpense::CreateExpense
    field :update_expense, mutation: Mutations::ManageExpense::UpdateExpense
    field :delete_expense, mutation: Mutations::ManageExpense::DeleteExpense

    # field :create_expense, mutation: Mutations::CreateExpense, property: :manage_expense
    # field :update_expense, mutation: Mutations::UpdateExpense
    # field :delete_expense, mutation: Mutations::DeleteExpense
  end
end
