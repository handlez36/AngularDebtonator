class AlterExpensesAddCardParty < ActiveRecord::Migration
  def change
    add_column :expenses, :card_id, :integer
    add_column :expenses, :party_id, :integer
  end
end
