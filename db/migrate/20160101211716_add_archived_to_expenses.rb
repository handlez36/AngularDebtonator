class AddArchivedToExpenses < ActiveRecord::Migration
  def change
    add_column :expenses, :archived, :boolean, :default => false
  end
end
