class ChangeExpenses < ActiveRecord::Migration
  def change
    change_column :expenses, :amt_charged, :decimal
    change_column :expenses, :amt_paid, :decimal
    change_column :expenses, :amt_pending, :decimal
  end
end
