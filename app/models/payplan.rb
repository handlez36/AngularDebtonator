class Payplan < ActiveRecord::Base
  belongs_to :card
  belongs_to :user
  has_many :payments, :dependent => :destroy
  has_many :expenses, through: :payments
  
  
  def total_payment
    self.payments.inject(0) { |sum, payment| sum += payment.amt_paid }
  end
  
  def get_payee_amt(payee)
    payments = self.payments
    payments.inject(0) { |sum, payment| (payment.responsible_party.name == payee) ? sum += payment.amt_paid : sum }    
  end
  
  def get_plan_total
    payments = self.payments
    
    payments.inject(0) { |sum, payment| sum += payment.amt_paid }
  end
  
  def get_payees
    payments = self.payments
    
    payments.map { |payment| payment.responsible_party.name }.uniq
  end
  
  def get_expenses_for_payee(payee)
    self.payments.select {|payment| payment.responsible_party.name == payee }
  end
    
end
