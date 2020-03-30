class AlterExpensesAddCardParty < ActiveRecord::Migration[5.2]
  def change
    add_column :expenses, :card_id, :integer
    add_column :expenses, :party_id, :integer
  end
end
