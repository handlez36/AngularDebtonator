module Types
  class ModelErrorType < Types::BaseObject
    field :message, String, null: false, description: 'Description of execution error condition'
    field :path, [String], null: true, description: 'Input value for the error'
  end
end
