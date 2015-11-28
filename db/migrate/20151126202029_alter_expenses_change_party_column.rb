class AlterExpensesChangePartyColumn < ActiveRecord::Migration
  def change
    rename_column :expenses, :party_id, :responsible_party_id
  end
end
