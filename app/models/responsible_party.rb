class ResponsibleParty < ActiveRecord::Base
  has_many :expenses
  has_many :payments
  belongs_to :user
end
