module Types
  class ResponsiblePartyType < Types::BaseObject
    field :id, ID, null: true
    field :name, String, null: false
  end
end
