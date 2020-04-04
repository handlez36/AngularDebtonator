module Types
  class CardType < Types::BaseObject
    field :id, ID, null: true
    field :name, String, null: false, method: :card_retailer
  end
end
