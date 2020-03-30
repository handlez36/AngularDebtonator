class AlterExpensesAddAmtPending < ActiveRecord::Migration[5.2]
  def change
    add_column :expenses, :amt_pending, :float
  end
end
