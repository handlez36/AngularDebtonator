class AlterExpensesChangePartyColumn < ActiveRecord::Migration[5.2]
  def change
    rename_column :expenses, :party_id, :responsible_party_id
  end
end
