class ChangeAmtPaidOnPayments < ActiveRecord::Migration[5.2]
  def change
    change_column :payments, :amt_paid, :decimal
  end
end
