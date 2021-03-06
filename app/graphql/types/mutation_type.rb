module Types
  class MutationType < Types::BaseObject
    field :create_expense, mutation: Mutations::ManageExpense::CreateExpense
    field :update_expense, mutation: Mutations::ManageExpense::UpdateExpense
    field :delete_expense, mutation: Mutations::ManageExpense::DeleteExpense

    field :create_payment, mutation: Mutations::ManagePayments::CreatePayment
    # field :update_expense, mutation: Mutations::UpdateExpense
    field :delete_payment, mutation: Mutations::ManagePayments::DeletePayment

    field :lock_plan, mutation: Mutations::ManagePayplans::LockPlan

    field :create_card, mutation: Mutations::ManageCards::CreateCard
    field :update_card, mutation: Mutations::ManageCards::UpdateCard
    field :delete_card, mutation: Mutations::ManageCards::DeleteCard

    field :create_payee, mutation: Mutations::ManageCards::CreateCard
    field :update_payee, mutation: Mutations::ManageCards::UpdateCard
    field :delete_payee, mutation: Mutations::ManageCards::DeleteCard

  end
end
