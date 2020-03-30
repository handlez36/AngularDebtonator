class AddArchivedForPayment < ActiveRecord::Migration[5.2]
  def change
    add_column :payments, :archived, :boolean, :default => false
  end
end
