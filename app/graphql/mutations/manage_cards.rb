module Mutations
  module ManageCards
    def handleModelErrors(errors)
      errors.map do |attribute, message|
        path = ['attributes', attribute.to_s.camelize(:lower)]
        { message: message, path: path}
      end
    end

    class CreateCard < BaseMutation
      argument :name, String, required: true

      field :success, Boolean, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        user = context[:current_user]
        new_card = user.cards.create( card_retailer: params[:name] )
        errors = []

        if !new_card.valid?
          errors << handleModelErrors(new_card.errors)
        end

        success = errors.empty?
        errorResult = errors.empty? ? nil : errors
        { success: success, errors: errorResult}
      end
    end

    class UpdateCard < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: true

      field :success, Boolean, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        user = context[:current_user]
        # card = user.cards.create( card_retailer: params[:name] )
        card = user.cards.find_by_id(params[:id])
        errors = []

        if card.nil?
          errors << { message: "Card cannot be found." }
          return { success: nil, errors: errors }
        end

        is_successful = card.update_attributes(card_retailer: params[:name])

        if !is_successful
          errors << handleModelErrors(new_card.errors)
        end

        success = errors.empty?
        errorResult = errors.empty? ? nil : errors
        { success: success, errors: errorResult}
      end
    end

    class DeleteCard < BaseMutation
      argument :id, ID, required: true

      field :success, Boolean, null: true
      field :errors, [Types::ModelErrorType], null: true

      def resolve(params)
        user = context[:current_user]
        card = user.cards.find_by_id(params[:id])
        errors = []

        if card.nil?
          errors << { message: "Card cannot be found." }
          return { success: nil, errors: errors }
        end

        is_successful = card.delete

        if !is_successful
          errors << handleModelErrors(new_card.errors)
        end

        success = errors.empty?
        errorResult = errors.empty? ? nil : errors
        { success: success, errors: errorResult}
      end
    end
  end
end