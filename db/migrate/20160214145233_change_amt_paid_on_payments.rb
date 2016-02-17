class ChangeAmtPaidOnPayments < ActiveRecord::Migration
  def change
    change_column :payments, :amt_paid, :decimal
  end
end
