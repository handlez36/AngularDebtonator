class Payment < ActiveRecord::Base
  include ActiveModel::Validations
  
  belongs_to :expense
  belongs_to :payplan
  belongs_to :card
  
  validates :amt_paid, :date, :card_id, :presence => true
  validate :amt_valid
  
  # Validator for the amt_paid field
  def amt_valid
    unless self.amt_paid <= expense.amt_remaining && self.amt_paid > 0
      errors.add(:amt, "You cannot pay over the expense's remaining balance")
    end
  end
  
  # For a payment creation, return whether this belongs to a new payplan (new date/card),
  # or an existing payplan (existing date/card)
  def self.get_proper_plan(date, card_id)
    plans = Payplan.where(:date => date, :card => Card.find_by_id(card_id)).first
    return (plans.nil?) ? Payplan.create(:date => date, :card_id => card_id) : plans
  end
  
  # Determine if the change in payment details is allowed based on the expense
  # i.e., if the payment is increased over the remaining balance of the expense,
  # do not allow payment
  def valid_expense?
    # TO DO
  end

end