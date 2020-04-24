module Types
  class PaymentType < Types::BaseObject
    field :id, ID, null: false
    field :expense, Types::ExpenseType, null: true
    field :payplan, Types::PayplanType, null: false
    field :amt_paid, String, null: false
    field :date, GraphQL::Types::ISO8601DateTime, null: false
    field :card, Types::CardType, null: false
    field :responsible_party, Types::ResponsiblePartyType, null: false
    field :archived, Boolean, null: false
    field :how_to_pay, String, null: true
  end
end
