class ChangeAmtChargedOnExpenses < ActiveRecord::Migration[5.2]
  def change
    change_column :expenses, :amt_paid, :decimal, :precision => 10, :scale => 2
    change_column :expenses, :amt_charged, :decimal, :precision => 10, :scale => 2
    change_column :expenses, :amt_pending, :decimal, :precision => 10, :scale => 2
  end
end
