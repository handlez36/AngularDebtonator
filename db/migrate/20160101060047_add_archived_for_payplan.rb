class AddArchivedForPayplan < ActiveRecord::Migration
  def change
    add_column :payplans, :archived, :boolean, :default => false
  end
end
