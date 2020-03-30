class AddHowToPayToPayments < ActiveRecord::Migration[5.2]
  def change
    add_column :payments, :how_to_pay, :string
  end
end
