module Types
  class PayplanType < Types::BaseObject
    field :id, ID, null: false
    field :date, GraphQL::Types::ISO8601DateTime, null: false
    field :comments, String, null: true
    field :card, Types::CardType, null: false
    field :archived, Boolean, null: false
    field :payments, [Types::PaymentType], null: true
  end
end
