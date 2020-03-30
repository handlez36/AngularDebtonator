class AddDateToPayments < ActiveRecord::Migration[5.2]
  def change
    add_column :payments, :date, :date
  end
end
