module Mutations
  # class BaseMutation < GraphQL::Schema::RelayClassicMutation
  #   argument_class Types::BaseArgument
  #   field_class Types::BaseField
  #   input_object_class Types::BaseInputObject
  #   object_class Types::BaseObject
  # end

  def handleModelErrors(errors)
    errors.map do |attribute, message|
      path = ['attributes', attribute.to_s.camelize(:lower)]
      { message: message, path: path}
    end
  end

  class BaseMutation < GraphQL::Schema::Mutation
    null false
  end
end
