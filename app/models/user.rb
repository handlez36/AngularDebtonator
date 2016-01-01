class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  
  has_many :expenses
  has_many :payments
  has_many :payplans
  
  def get_total_expense_amt(name = nil)
    self.expenses.inject(0) do |sum, expense|
      name.nil? ? sum += expense.amt_charged : ((expense.responsible_party.name == name) ? sum += expense.amt_charged : sum)
    end
  end
  
  def get_total_pending_expense_amt(name = nil)
    self.expenses.inject(0) do |sum, expense|
      name.nil? ? sum += expense.amt_pending : ((expense.responsible_party.name == name) ? sum += expense.amt_pending : sum)
    end
  end
  
  def get_pending_expense_percentage(name = nil)
    puts "Total for #{name} - #{self.get_total_expense_amt(name)}"
    ((self.get_total_pending_expense_amt(name) / self.get_total_expense_amt(name)) * 100).to_f
  end
  
  def get_expense_responsible_parties
    self.expenses.map { |expense| expense.responsible_party.name }.uniq
  end
  
  def get_expense_total_by_card
    
    colors = ["#F7464A", "#46BFBD", "#FDB45C", "blue"]
    highlights = ["#FF5A5E", "#5AD3D1", "#FFC870", "#BC3421"]
    data = []
    
    self.expenses.group(:card).sum(:amt_charged).each_with_index do |ring, index|
      data_hash = Hash.new
      data_hash[:value] = ring[1].round(2)
      data_hash[:color] = colors[index]
      data_hash[:highlight] = highlights[index]
      data_hash[:label] = ring[0].card_retailer
      data.push data_hash
    end
    
    return data
  end
  
  def get_expense_total_by_card(exclude_pending = true)
    
    colors = ["#F7464A", "#46BFBD", "#FDB45C", "blue"]
    highlights = ["#FF5A5E", "#5AD3D1", "#FFC870", "#BC3421"]
    data = []
    
    self.expenses.each_with_index do |expense, index|
      if data.select { |hash| hash[:label] == expense.card.card_retailer  }.count == 0
        data_hash = Hash.new
        data_hash[:label] = expense.card.card_retailer
        data_hash[:value] = (exclude_pending) ? expense.amt_charged : expense.amt_charged - expense.amt_pending
        data_hash[:highlight] = highlights[data.count]
        data_hash[:color] = colors[data.count]
        data << data_hash
      else
        data.select { |hash| hash[:label] == expense.card.card_retailer }.first[:value] += (expense.amt_charged - expense.amt_pending)
      end
    end
    
    return data
  end
  
  def get_expense_total_by_party(exclude_pending = true)
    
    colors = ["#F7464A", "#46BFBD", "#FDB45C", "blue"]
    highlights = ["#FF5A5E", "#5AD3D1", "#FFC870", "#BC3421"]
    data = []
    
    self.expenses.each_with_index do |expense, index|
      if data.select { |hash| hash[:label] == expense.responsible_party.name  }.count == 0
        data_hash = Hash.new
        data_hash[:label] = expense.responsible_party.name
        data_hash[:value] = (exclude_pending) ? expense.amt_charged : expense.amt_charged - expense.amt_pending
        data_hash[:highlight] = highlights[data.count]
        data_hash[:color] = colors[data.count]
        data << data_hash
      else
        data.select { |hash| hash[:label] == expense.responsible_party.name }.first[:value] += (expense.amt_charged - expense.amt_pending)
      end
    end
    
    return data
  end

#  def get_expense_total_by_party(exclude_pending = true)
#    
#    colors = ["red", "orange", "green", "blue"]
#    highlights = ["#FF5A5E", "#5AD3D1", "#FFC870", "#BC3421"]
#    data = []
#    
#    self.expenses.group(:responsible_party).sum(:amt_charged).each_with_index do |ring, index|
#      data_hash = Hash.new
#      data_hash[:value] = ring[1].round(2)
#      data_hash[:color] = colors[index]
#      data_hash[:highlight] = highlights[index]
#      data_hash[:label] = ring[0].name
#      data.push data_hash
#    end
#    
#    return data
#  end

  
end
