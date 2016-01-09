class AddUserToCardAndResponsibleParty < ActiveRecord::Migration
  def change
    add_column :cards, :user_id, :integer
    add_column :responsible_parties, :user_id, :integer
  end
end
