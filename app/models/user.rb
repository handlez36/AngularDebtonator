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
  
end
