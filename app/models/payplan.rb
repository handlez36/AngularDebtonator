class Payplan < ActiveRecord::Base
  belongs_to :card
  has_many :payments
  has_many :expenses, through: :payments
  
  def amt_for(party)
    self.payments.inject(0) { |sum, payment| sum += payment.amt_paid if payment.expense.responsible_party == party }
  end
  
  def total_payment
    self.payments.inject(0) { |sum, payment| sum += payment.amt_paid }
  end
end
