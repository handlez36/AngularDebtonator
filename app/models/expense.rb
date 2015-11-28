class Expense < ActiveRecord::Base
  before_save :set_defaults
  
  belongs_to :card
  belongs_to :responsible_party
  belongs_to :user
  has_many :payments
  has_many :payplans, through: :payments
  
  validates :retailer, :amt_charged, :date, :card, :presence => true
  validates :retailer, :length => { :maximum => 50}
  validates :amt_charged, :numericality => {:greater_than_or_equal_to => 0}
  
  def set_defaults
    self.amt_paid ||= 0.00
    self.split ||= false
    self.how_to_pay ||= "Not sure"
    self.payment_status ||= 0
    self.responsible_party ||= ResponsibleParty.find_by(:name => "Brandon")
  end
  
  def amt_remaining
    self.amt_charged - self.amt_paid
  end
  
  def date_to_string
    self.date.strftime('%b %d, %Y')
  end
  
  def amt_two_decimal_places
    number_with_precision( self.amt_charged, precision: 2 )
  end
  
end
