class Expense < ActiveRecord::Base
  before_save :set_defaults
  
  belongs_to :card
  belongs_to :responsible_party
  belongs_to :user
  has_many :payments
  has_many :payplan, through: :payments
  
  validates :retailer, :amt_charged, :date, :card, :presence => true
  validates :retailer, :length => { :maximum => 50}
  validates :amt_charged, :numericality => {:greater_than_or_equal_to => 0}
  
  # Set defaults for newly added expenses, if not provided explicitly
  def set_defaults
    self.amt_paid ||= 0.00
    self.amt_pending ||= 0.00
    self.split ||= false
    self.how_to_pay ||= "Not sure"
    self.payment_status ||= 0
    self.responsible_party ||= ResponsibleParty.where(:user_id => self.user.id).first
  end
  
  # Calculate amt_remaining, inclusive of amt_pending
  # amt_charged - amt_paid - amt_pending
  def amt_remaining
    self.amt_charged - self.amt_paid - self.amt_pending
  end
  
  # Calculate amt_remaining, excluding amt_pending
  # amt_charged - amt_paid
  def amt_remaining_to_pay
    self.amt_charged - self.amt_paid
  end
  
  # Add amount to this expense's amt_pending
  def update_amt_pending(add_amt)
    self.amt_pending += add_amt
    self.save
  end
  
  # Return string formatted date
  def date_to_string
    self.date.strftime('%b %d, %Y')
  end
  
  # Show amt_charged with two decimal places
  def amt_two_decimal_places
    number_with_precision( self.amt_charged, precision: 2 )
  end
  
  # When a pending payment has been locked/confirmed, transfer this amount to the
  # amt_paid
  def transfer_pending_to_paid(paid)
    self.amt_paid += paid
    return false if self.amt_pending - paid < 0
    self.amt_pending -= paid
  end
  
  # Determine if an expense amt_charged change can be made based on pending payments
  # If initial charge is $20 with a planned payment of $15, you cannot reduce amt_charged
  # to anything below $15
  def valid_expense_change?(new_amt)
    total_payments_planned = self.payments.inject(0) { |sum, payment| sum += payment.amt_paid }
    return (new_amt >= total_payments_planned) ? true : false
  end
  
  # Remove payments connected to this expense
  def remove_planned_payments
    self.payments.each { |payment| payment.destroy }
  end
  
  # Adjust expense amounts after payment is locked
  def adjust_charge(amt_pending)
    self.amt_pending -= amt_pending
    self.amt_paid += amt_pending
    self.save
  end
  
  # Print expense data to the console
  def print_expense_stats
    puts "Expense: #{self.id}"
    puts " -- amt charged: #{self.amt_charged}"
    puts " -- amt paid: #{self.amt_paid}"
    puts " -- amt pending: #{self.amt_pending}"
    puts " -- amt remaining: #{self.amt_remaining}"
    puts " -- amt remaining without pending: #{self.amt_remaining_to_pay}"
  end
  
end
