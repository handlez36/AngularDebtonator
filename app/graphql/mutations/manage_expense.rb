module Mutations
  module ManageExpense
    def handleModelErrors(errors)
      errors.map do |attribute, message|
        path = ['attributes', attribute.to_s.camelize(:lower)]
        { message: message, path: path}
      end
    end

    class CreateExpense < BaseMutation
      # arguments passed to the `resolve` method
      argument :mode, String, required: false
      argument :date, GraphQL::Types::ISO8601DateTime, required: true
      argument :retailer, String, required: true
      argument :amtCharged, String, required: true
      argument :responsibleParty, String, required: true
      argument :card, String, required: true
      argument :howToPay, String, required: false

      # return type from the mutation
      field :id, ID, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        new_expense = context[:current_user].expenses.create(
          date: params[:date], 
          retailer: params[:retailer], 
          amt_charged: params[:amtCharged], 
          responsible_party_id: params[:responsibleParty],
          card_id: params[:card], 
          how_to_pay: params[:howToPay]
        )

        if new_expense.valid?
          { id: new_expense.id, errors: nil}
        else
          errors = new_expense.errors.map do |attribute, message|
            path = ['attributes', attribute.to_s.camelize(:lower)]
            { message: message, path: path}
          end
          { id: nil, errors: errors}
        end
      end
    end

    class UpdateExpense < BaseMutation
      argument :expenseId, ID, required: true
      argument :mode, String, required: false
      argument :date, GraphQL::Types::ISO8601DateTime, required: true
      argument :retailer, String, required: true
      argument :amtCharged, String, required: true
      argument :responsibleParty, String, required: true
      argument :card, String, required: true
      argument :howToPay, String, required: false

      # return type from the mutation
      field :id, ID, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        user = context[:current_user]
        expense = Expense.find_by_id params[:expenseId]

        # Business validation checks...
        #   - Does the expense exist?
        #   - Is this a valid expense change?
        #   - Ensure this expense belongs to the current user
        if !expense
          return { id: nil, errors: [{ message: "Expense cannot be found" }]}
        elsif expense.user_id.to_s != user.id.to_s
          return { id: nil, errors: [{ message: "Cannot update this user's expense" }]}
        elsif !expense.valid_expense_change?(params[:amtCharged].to_f)
          return { id: nil, errors: [{ message: "Please delete pending payment first" }]}
        end

        # Update expense
        is_valid = expense.update_attributes(
          date: params[:date], 
          retailer: params[:retailer], 
          amt_charged: params[:amtCharged], 
          responsible_party_id: params[:responsibleParty],
          card_id: params[:card], 
          how_to_pay: params[:howToPay]
        )
        is_valid ? 
          { id: expense.id, errors: nil } : 
          { id: nil, errors: handleModelErrors(expense.errors)}
        
      end
    end

    class DeleteExpense < BaseMutation
      argument :expenseId, [ID], required: true

      # return type from the mutation
      field :success, Types::BatchResponseType, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        puts "manage_expense#resolve"
        expenses = context[:current_user].expenses.where(id: params[:expenseId])
        success_status = 'success'
        errors = nil

        # Business validation checks...
        #   - Do all these expense exist (requested < found)?
        if expenses.count != params[:expenseId].count
          puts "You asked for more expenses than were found."
          ids_not_found = params[:expenseId] - expenses.map(&:id)
          success_status = 'partial'
          errors = [{ message: "Some retailers could not be found or don't belong to this user: #{ids_not_found}" }]
        end

        puts "Planning to remove exoenses"
        # Removed any planned payments and destroy expense
        expenses.each do |expense|
          expense.remove_planned_payments
          expense.destroy
        end

        puts "Success Status: #{success_status}"
        puts "Errors: #{errors}"
        { success: success_status, errors: errors } 
      end
    end
  end
end