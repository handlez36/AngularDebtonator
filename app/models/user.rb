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
  
  def get_available_cards
    Card.where(:user_id => self.id).to_a
  end
  
  def get_available_parties
    ResponsibleParty.where(:user_id => self.id).to_a
  end
  
  def get_total_expense_amt(name = nil)
    self.expenses.where(:archived => false).inject(0) do |sum, expense|
      name.nil? ? sum += expense.amt_remaining_to_pay : ((expense.responsible_party.name == name) ? sum += expense.amt_remaining_to_pay : sum)
    end
  end
  
  def get_total_pending_expense_amt(name = nil)
    self.expenses.where(:archived => false).inject(0) do |sum, expense|
      name.nil? ? sum += expense.amt_pending : ((expense.responsible_party.name == name) ? sum += expense.amt_pending : sum)
    end
  end
  
  def get_pending_expense_percentage(name = nil)
    puts "Total for #{name} - #{self.get_total_expense_amt(name)}"
    ((self.get_total_pending_expense_amt(name) / self.get_total_expense_amt(name)) * 100).to_f
  end
  
  def get_expense_responsible_parties
    self.expenses.where(:archived => false).map { |expense| expense.responsible_party.name }.uniq
  end
  
  def get_archived_expenses
    self.expenses.where(:archived => true)
  end
    
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
  
  def get_expense_total_by_party(exclude_pending = true)
    
    colors = ["#F7464A", "#46BFBD", "#FDB45C", "blue"]
    highlights = ["#FF5A5E", "#5AD3D1", "#FFC870", "#BC3421"]
    data = []
    
    self.expenses.where(:archived => false).each_with_index do |expense, index|
      if data.select { |hash| hash[:label] == expense.responsible_party.name  }.count == 0
        data_hash = Hash.new
        data_hash[:label] = expense.responsible_party.name
        data_hash[:value] = (exclude_pending) ? expense.amt_remaining_to_pay : expense.amt_remaining
        data_hash[:highlight] = highlights[data.count % 4]
        data_hash[:color] = colors[data.count]
        data << data_hash
      else
        data.select { |hash| hash[:label] == expense.responsible_party.name }.first[:value] +=
          exclude_pending ? expense.amt_remaining_to_pay : expense.amt_remaining
      end
    end
    
    return data
  end

  def get_expense_total_by_party2(exclude_pending = true)
    
    colors = ["#F7464A", "#46BFBD", "#FDB45C", "blue"]
    highlights = ["#FF5A5E", "#5AD3D1", "#FFC870", "#BC3421"]
    data = []
    
    get_payment_and_party_hash.each_with_index do |payment, index|
      if data.select { |hash| hash[:label] == payment[0]  }.count == 0
        data_hash = Hash.new
        data_hash[:label] = payment[0]
        data_hash[:value] = payment[1]
        data_hash[:highlight] = highlights[data.count % 4]
        data_hash[:color] = colors[data.count]
        data << data_hash
      else
        data.select { |hash| hash[:label] == payment[0] }.first[:value] += payment[1]
      end
    end
    
    return data
  end

  
  
  def get_payment_and_party_hash
    data = Hash.new
    
    self.expenses.where(:archived => false).each do |expense|
      data[expense.responsible_party.name] = expense.amt_remaining
    end
    puts "Data: #{data}"
    
    self.payments.where(:archived => false).each do |payment|
      if data.has_key? payment.responsible_party.name
        data[payment.responsible_party.name] += payment.amt_paid
      else
        data[payment.responsible_party.name] = payment.amt_paid
      end
    end
    
    puts "Data: #{data}"
    data
    
  end
  
end
