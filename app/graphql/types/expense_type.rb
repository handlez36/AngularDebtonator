module Types
  class ExpenseType < Types::BaseObject
    field :id, ID, null: false
    field :date, GraphQL::Types::ISO8601Date, null: false
    field :retailer, String, null: false
    field :amt_charged, String, null: false
    field :amt_paid, String, null: false
    field :amt_pending, String, null: false
    field :how_to_pay, String, null: true
    field :responsible_party, Types::ResponsiblePartyType, null: false
    field :card, Types::CardType, null: false
    field :archived, Boolean, null: false
  end
end
