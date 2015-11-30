class AddCardToPayments < ActiveRecord::Migration
  def change
    add_column :payments, :card_id, :integer
  end
end
