class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  
  has_many :expenses
  has_many :payments
  has_many :payplans
  has_many :cards
  has_many :responsible_parties
  
  # Return cards created by this user
  def get_available_cards
    self.cards.to_a
  end
  
  # Return responsible parties created by this user
  def get_available_parties
    self.responsible_parties.to_a
  end
  
  # Return total amt remaining to pay on all expenses
  # If a party's name is passed in, get the total for only that party
  def get_total_expense_amt(name = nil)
    self.expenses.where(:archived => false).inject(0) do |sum, expense|
      name.nil? ? sum += expense.amt_remaining_to_pay : ((expense.responsible_party.name == name) ? sum += expense.amt_remaining_to_pay : sum)
    end
  end
  
  # Return total amt pending on all expenses
  # If a party's name is passed in, get the total for only that party
  def get_total_pending_expense_amt(name = nil)
    self.expenses.where(:archived => false).inject(0) do |sum, expense|
      name.nil? ? sum += expense.amt_pending : ((expense.responsible_party.name == name) ? sum += expense.amt_pending : sum)
    end
  end
  
  # Return percentage of total expense amount that is in one or more pending payments
  def get_pending_expense_percentage(name = nil)
    ((self.get_total_pending_expense_amt(name) / self.get_total_expense_amt(name)) * 100).to_f
  end
  
  # Return a distinct list of this user's responsible parties for unarchived expenses
  def get_expense_responsible_parties
    self.expenses.where(:archived => false).map { |expense| expense.responsible_party.name }.uniq
  end
  
  # Get a list of all archived expenses
  def get_archived_expenses
    self.expenses.where(:archived => true)
  end
    
  # Return a hash that contains amt remaining for each user's expense, per card
  # This will exclude the pending payments depending on the 'exclude_pending' parameter passed in
  def get_expense_total_by_card(exclude_pending = true)
    
    colors = ["#F7464A", "#46BFBD", "#FDB45C", "blue"]
    highlights = ["#FF5A5E", "#5AD3D1", "#FFC870", "#BC3421"]
    data = []
    
    self.expenses.where(:archived => false).each_with_index do |expense, index|
      if data.select { |hash| hash[:label] == expense.card.card_retailer  }.count == 0
        data_hash = Hash.new
        data_hash[:label] = expense.card.card_retailer
        data_hash[:value] = (exclude_pending) ? expense.amt_remaining_to_pay : expense.amt_remaining
        data_hash[:highlight] = highlights[data.count % 4]
        data_hash[:color] = colors[data.count]
        data << data_hash
      else
        data.select { |hash| hash[:label] == expense.card.card_retailer }.first[:value] += 
          exclude_pending ? expense.amt_remaining_to_pay : expense.amt_remaining
      end
    end
    
    return data
  end
  
  # Return a hash that contains amt remaining for each user's expense, per party responsible
  # This will include or exclude any pending payments depending on the 'include_pending' parameter passed in  
  def get_expense_total_by_party(include_pending = true)
    
    colors = ["#F7464A", "#46BFBD", "#FDB45C", "blue"]
    highlights = ["#FF5A5E", "#5AD3D1", "#FFC870", "#BC3421"]
    data = []
    
    get_payment_and_party_hash(include_pending).each_with_index do |payment, index|
      if data.select { |hash| hash[:label] == payment[0]  }.count == 0
        data_hash = Hash.new
        data_hash[:label] = payment[0]
        data_hash[:value] = payment[1]
        data_hash[:highlight] = highlights[data.count % 4]
        data_hash[:color] = colors[data.count % 4]
        data << data_hash
      else
        data.select { |hash| hash[:label] == payment[0] }.first[:value] += payment[1]
      end
    end
    
    return data
  end
  
  def get_card_color(card)
    colors = ["skyblue", "crimson", "orange", "violet", "green", "yellow"]
    
    mycards = self.cards.order('id ASC').to_a
    return colors[ mycards.find_index(card) % 6 ]
  end
  
  private 
  
  # Return a hash of how much each party owes for the user's expenses and planned payments
  # This will include or exclude any pending payments depending on the 'include_pending' parameter passed in
  def get_payment_and_party_hash(include_pending = false)
    data = Hash.new
    
    self.expenses.where(:archived => false).each do |expense|
      if data.has_key? expense.responsible_party.name
        data[expense.responsible_party.name] += expense.amt_remaining
      else
        data[expense.responsible_party.name] = expense.amt_remaining
      end
    end
    
    if include_pending
      self.payments.where(:archived => false).each do |payment|
        if data.has_key? payment.responsible_party.name
          data[payment.responsible_party.name] += payment.amt_paid
        else
          data[payment.responsible_party.name] = payment.amt_paid
        end
      end
    end
    
    data
    
  end
  
end
