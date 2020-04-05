module Mutations
  class CreateExpense < BaseMutation
    # arguments passed to the `resolve` method
    argument :userId, ID, required: true
    argument :mode, String, required: false
    argument :date, GraphQL::Types::ISO8601Date, required: true
    argument :retailer, String, required: true
    argument :amtCharged, String, required: true
    argument :responsibleParty, String, required: true
    argument :card, String, required: true
    argument :howToPay, String, required: false


    # return type from the mutation
    type Types::ExpenseType

    def resolve(params)
      puts "create_expense.rb#resolve"

      user = User.find_by_id(params[:userId])
      user.expenses.create!(
        date: params[:date], 
        retailer: params[:retailer], 
        amt_charged: params[:amtCharged], 
        responsible_party_id: params[:responsibleParty],
        card_id: params[:card], 
        how_to_pay: params[:howToPay]
      )
      user.expenses.last
    end
  end

  class UpdateExpense < BaseMutation
    argument :userId, ID, required: true
    argument :expenseId, ID, required: true
    argument :mode, String, required: false
    argument :date, GraphQL::Types::ISO8601Date, required: true
    argument :retailer, String, required: true
    argument :amtCharged, String, required: true
    argument :responsibleParty, String, required: true
    argument :card, String, required: true
    argument :howToPay, String, required: false

    # return type from the mutation
    type Types::ExpenseType

    def resolve(params)
      puts "update_expense.rb#resolve"

      expense = Expense.find_by_id params[:expenseId]
      if expense and expense.user_id.to_s == params[:userId].to_s
        expense.update_attributes(
          date: params[:date], 
          retailer: params[:retailer], 
          amt_charged: params[:amtCharged], 
          responsible_party_id: params[:responsibleParty],
          card_id: params[:card], 
          how_to_pay: params[:howToPay]
        )
        expense
      end
    end
  end

  class DeleteExpense < BaseMutation
    argument :userId, ID, required: true
    argument :expenseId, [ID], required: true

    # return type from the mutation
    type Types::ResponseType

    def resolve(params)
      puts "delete_expense.rb#resolve -- p: #{params}"

      if params[:expenseId]
        Expense.where(id: params[:expenseId]).delete_all!
      end

      { success: true }
    end
  end
end