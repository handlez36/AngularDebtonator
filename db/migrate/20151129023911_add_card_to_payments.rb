class AddCardToPayments < ActiveRecord::Migration[5.2]
  def change
    add_column :payments, :card_id, :integer
  end
end
