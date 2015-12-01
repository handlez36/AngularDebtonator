class AlterExpensesAddAmtPending < ActiveRecord::Migration
  def change
    add_column :expenses, :amt_pending, :float
  end
end
