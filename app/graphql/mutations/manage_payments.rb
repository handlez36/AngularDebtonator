module Mutations
  module ManagePayments
    def handleModelErrors(errors)
      errors.map do |attribute, message|
        path = ['attributes', attribute.to_s.camelize(:lower)]
        { message: message, path: path}
      end
    end

    class CreatePayment < BaseMutation
      argument :input, [Types::PaymentAttributes, null: true], required: true

      field :success, Types::BatchResponseType, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        current_user = context[:current_user]

        payment_inputs = params[:input]
        ids = payment_inputs.map { |p| p[:expenseId] }
        expenses = context[:current_user].expenses.where(id: ids)
        errors = []
        ids_not_found = []
        
        # Business validation checks...
        #   - Do all these expense exist (requested < found)?
        if expenses.count != ids.count
          ids_not_found = ids - expenses.map(&:id)
          errors = [{ message: "Some expenses could not be found or don't belong to this user: #{ids_not_found}" }]
        end
        
        payment_inputs.each do |payment|
          next if ids_not_found.include? payment[:expenseId]

          expense = Expense.find_by_id payment[:expenseId]
          payment_plan = Payment.get_proper_plan(payment[:date], expense.card_id, current_user)
          new_payment = expense.payments.create(
            date: payment[:date], 
            amt_paid: payment[:amtPaid], 
            responsible_party_id: payment[:responsibleParty],
            how_to_pay: payment[:howToPay],
            card_id: expense.card_id,
            payplan_id: payment_plan.id,
            user: current_user
          )
          new_payment.valid? ?
            expense.update_amt_pending(new_payment.amt_paid) :
            errors << handleModelErrors(new_payment.errors)
        end

        success = errors.empty? ? 'success' : 'errors'
        errorResult = errors.empty? ? nil : errors
        { success: success, errors: errorResult}
      end
    end
  end
end