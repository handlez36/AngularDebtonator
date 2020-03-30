class UpdateAmtPaidOnPayments < ActiveRecord::Migration[5.2]
  def change
    change_column :payments, :amt_paid, :decimal, :precision => 10, :scale => 2
  end
end
