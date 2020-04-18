class Payplan < ActiveRecord::Base
  belongs_to :card
  belongs_to :user
  has_many :payments, :dependent => :destroy
  has_many :expenses, through: :payments

  scope :current, -> { where(:archived => false)}
  scope :archived, -> { where(:archived => true)}
  
  # Return the total amount to be paid for all payments attached to this payment plan
  def get_plan_total
    self.payments.inject(0) { |sum, payment| sum += payment.amt_paid }
  end
  
  # Return the total amount to be paid for all payments attached to this payment plan, for the specific payee
  def get_payee_amt(payee)
    self.payments.inject(0) { |sum, payment| (payment.responsible_party.name == payee) ? sum += payment.amt_paid : sum }    
  end
  
  # Return a distinct list of responsible parties for all pending payments
  def get_payees
    self.payments.map { |payment| payment.responsible_party.name }.uniq
  end
  
  # Return the payments of this payplan attributed to a specific payee
  def get_payments_for_payee(payee)
    self.payments.select {|payment| payment.responsible_party.name == payee }
  end
  
  # Lock the payplan. This includes...
  # - Archiving each payment of the payplan
  # - If that's successful, adjust the associated expenses to reflect a paid (confirmed) amount
  # - Archive the expense if it is all paid up
  # - Archive the payplan
  def lock
    self.payments.each do |payment|
      # Archive all payments of this payplan
      payment.archived = true
      payment_archive_successful = payment.save
      
      if payment_archive_successful
        # Adjust the expense amt_charged, amt_pending, and amt_paid
        payment.expense.adjust_charge(payment.amt_paid)

        if payment.expense.amt_charged - payment.expense.amt_paid == 0.00
          payment.expense.archived = true
          payment.expense.save
        end
      else
        return false
      end
    end
  
    # Archive the payplan
    self.archived = true
    self.save
  end
    
end
