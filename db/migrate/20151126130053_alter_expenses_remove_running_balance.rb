class AlterExpensesRemoveRunningBalance < ActiveRecord::Migration
  def change
    remove_column :expenses, :running_balance, :integer
  end
end
