class ChangeExpenseDateToDateTime < ActiveRecord::Migration[6.0]
  def change
    change_column :expenses, :date, :datetime
  end
end
