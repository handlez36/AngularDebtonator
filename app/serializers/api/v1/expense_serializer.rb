class ExpenseSerializer < ActiveModel::Serializer
  attributes :id, :date, :retailer, :amt_charged, :amt_pending, :amt_paid, :how_to_pay
  belongs_to :card
  belongs_to :responsible_party
end
