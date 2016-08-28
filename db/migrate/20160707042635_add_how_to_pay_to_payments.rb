class AddHowToPayToPayments < ActiveRecord::Migration
  def change
    add_column :payments, :how_to_pay, :string
  end
end
