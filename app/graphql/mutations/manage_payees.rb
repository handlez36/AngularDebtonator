module Mutations
  module ManagePayees
    def handleModelErrors(errors)
      errors.map do |attribute, message|
        path = ['attributes', attribute.to_s.camelize(:lower)]
        { message: message, path: path}
      end
    end

    class CreatePayee < BaseMutation
      argument :name, String, required: true

      field :success, Boolean, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        user = context[:current_user]
        new_payee = user.responsible_parties.create( name: params[:name] )
        errors = []

        if !new_payee.valid?
          errors << handleModelErrors(new_payee.errors)
        end

        success = errors.empty?
        errorResult = errors.empty? ? nil : errors
        { success: success, errors: errorResult}
      end
    end

    class UpdatePayee < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: true

      field :success, Boolean, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        user = context[:current_user]
        payee = user.responsible_parties.find_by_id(params[:id])
        errors = []

        if payee.nil?
          errors << { message: "Responsible party cannot be found." }
          return { success: nil, errors: errors }
        end

        is_successful = payee.update_attributes(name: params[:name])

        if !is_successful
          errors << handleModelErrors(payee.errors)
        end

        success = errors.empty?
        errorResult = errors.empty? ? nil : errors
        { success: success, errors: errorResult}
      end
    end

    class DeletePayee < BaseMutation
      argument :id, ID, required: true

      field :success, Boolean, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        user = context[:current_user]
        payee = user.responsible_parties.find_by_id(params[:id])
        errors = []

        if payee.nil?
          errors << { message: "Responsible party cannot be found." }
          return { success: nil, errors: errors }
        end

        is_successful = payee.delete

        if !is_successful
          errors << handleModelErrors(payee.errors)
        end

        success = errors.empty?
        errorResult = errors.empty? ? nil : errors
        { success: success, errors: errorResult}
      end
    end

  end
end