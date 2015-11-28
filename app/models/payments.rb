class Payments < ActiveRecord::Base
  belongs_to :expense_id
  belongs_to :payplans_id
end
