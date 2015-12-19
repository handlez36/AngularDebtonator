class Payment < ActiveRecord::Base
  before_destroy :refactor_expenses
  
  include ActiveModel::Validations
  
  belongs_to :expense
  belongs_to :payplan
  belongs_to :card
  belongs_to :user
  belongs_to :responsible_party
  
  validates :amt_paid, :date, :card_id, :presence => true
  validate :amt_valid
  
  # Validator for the amt_paid field
  def amt_valid
    unless self.amt_paid <= expense.amt_remaining && self.amt_paid > 0
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
    plan = Payplan.where(:date => date, :user => user, :card => Card.find_by_id(card_id)).first
    return (plan.nil?) ? Payplan.create(:date => date, :card_id => card_id, :user => user) : plan
  end
  
  # Determine if the change in payment details is allowed based on the expense
  # i.e., if the payment is increased over the remaining balance of the expense,
  # do not allow payment
  def valid_payment?(updated_payment, id)
    expense = self.expense

    old_payment_amt = expense.amt_pending - Payment.find(id).amt_paid
    
    if expense.amt_charged - expense.amt_paid - old_payment_amt - updated_payment < 0
      return false
    end
    
    return true    
  end
    
  def remove_from_expense
    expense = self.expense
    expense.amt_pending -= self.amt_paid
    expense.save
  end

  def update_expense(new_payment)
    expense = self.expense
    expense.amt_pending += new_payment
    expense.save
  end
end