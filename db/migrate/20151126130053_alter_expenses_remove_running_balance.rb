class AlterExpensesRemoveRunningBalance < ActiveRecord::Migration[5.2]
  def change
    remove_column :expenses, :running_balance, :integer
  end
end
