module Types
  class MutationType < Types::BaseObject
    field :create_expense, mutation: Mutations::CreateExpense
    field :update_expense, mutation: Mutations::UpdateExpense
  end
end
