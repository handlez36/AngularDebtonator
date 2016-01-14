class Payment < ActiveRecord::Base
  before_destroy :refactor_expenses
  
  include ActiveModel::Validations
  
  belongs_to :expense
  belongs_to :payplan
  belongs_to :card
  belongs_to :user
  belongs_to :responsible_party
  
  validates :amt_paid, :date, :card_id, :presence => true
  validates :amt_paid, :numericality => {:greater_than_or_equal_to => 0}
  validate :amt_valid
  
  # Validator for the amt_paid field
  def amt_valid    
    unless is_valid_new_payment? || is_valid_payment_update?
      errors.add(:amt, "You cannot pay over the expense's remaining balance")
    end
  end
  
  # After a payment is removed, refactor the amt_pending value
  def refactor_expenses
    self.expense.amt_pending -= self.amt_paid
    self.expense.save
  end
    
  # For a payment creation, return whether this belongs to a new payplan (new date/card),
  # or an existing payplan (existing date/card)
  def self.get_proper_plan(date, card_id, user)
    plan = Payplan.where(:date => date, :user => user, :card => Card.find_by_id(card_id), :archived => false).first
    return (plan.nil?) ? Payplan.create(:date => date, :card_id => card_id, :user => user) : plan
  end
  
  # Determine if the change in payment details is allowed based on the expense
  # i.e., if the payment is increased over the remaining balance of the expense,
  # do not allow payment
  def valid_payment?(updated_payment)
    return false if amt_remaining_after_payment_update(updated_payment) < 0    
    return true    
  end
    
  # When removing a payment, remove the payment's amount from the related expense's pending payment amount
  def remove_from_expense
    expense = self.expense
    expense.amt_pending -= self.amt_paid
    expense.save
  end

  # When updating a payment, add the new payment's amount to the expense's pending payment amount
  # This is called separatey from the method that removes the old payment value
  def update_expense(new_payment)
    expense = self.expense
    expense.amt_pending += new_payment
    expense.save
  end
  
  private
  
  # Return amount leftover from expense charge after
  # - subtracting amount paid so far
  # - subtracting other pending payments on the same expense
  # - subtracting the pending updated payment
  def amt_remaining_after_payment_update(updated_payment)
    old_payment_amt = self.expense.amt_pending - self.amt_paid
    expense.amt_charged - expense.amt_paid - old_payment_amt - updated_payment  
  end
  
  # Return true if the payment amount is less than or equal to the amount remaining to be paid on the expense,
  # including any pending payments, and the payment amount is more than 0
  # This ensures new payments are not more than what is available to pay
  def is_valid_new_payment?
    self.amt_paid <= expense.amt_remaining && self.amt_paid > 0
  end
  
  # For existing payments being updated, ensure the payment amount remains below or equal to the amount still available
  # to be paid, excluding pending payments
  # This check is mainly applicable when changing the archive status of a payment. This check ensures the first validator does not
  # interupt the ability to save the payment.
  def is_valid_payment_update?
    !self.new_record? && self.amt_paid <= expense.amt_remaining_to_pay
  end
end