class AddArchivedForPayment < ActiveRecord::Migration
  def change
    add_column :payments, :archived, :boolean, :default => false
  end
end
