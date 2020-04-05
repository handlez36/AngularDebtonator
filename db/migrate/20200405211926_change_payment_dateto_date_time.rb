class ChangePaymentDatetoDateTime < ActiveRecord::Migration[6.0]
  def change
    change_column :payments, :date, :datetime
  end
end
