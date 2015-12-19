class ResponsibleParty < ActiveRecord::Base
  has_many :expenses
  has_many :payments
end
