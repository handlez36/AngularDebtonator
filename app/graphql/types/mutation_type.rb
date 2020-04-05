module Types
  class MutationType < Types::BaseObject
    field :create_expense, mutation: Mutations::CreateExpense
    field :update_expense, mutation: Mutations::UpdateExpense
    field :delete_expense, mutation: Mutations::DeleteExpense
  end
end
