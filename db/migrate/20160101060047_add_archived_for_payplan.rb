class AddArchivedForPayplan < ActiveRecord::Migration[5.2]
  def change
    add_column :payplans, :archived, :boolean, :default => false
  end
end
