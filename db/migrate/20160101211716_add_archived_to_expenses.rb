class AddArchivedToExpenses < ActiveRecord::Migration[5.2]
  def change
    add_column :expenses, :archived, :boolean, :default => false
  end
end
