module Mutations
  module ManagePayplans
    class LockPlan < BaseMutation
      argument :id, ID, required: true

      field :success, Boolean, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        user = context[:current_user]
        plan = user.payplans.current.find_by_id(params[:id])
        errors = []

        if plan.nil?
          errors << { message: "Pay plan cannot be found." }
          return { success: nil, errors: errors } 
        end

        plan_locked_successfully = plan.lock

        if !plan_locked_successfully
          errors << handleModelErrors(plan.errors)
        end

        success = errors.empty?
        errorResult = errors.empty? ? nil : errors
        { success: success, errors: errorResult}
      end
    end
  end
end