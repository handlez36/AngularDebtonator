class AlterPaymentsAddResponsibleParty < ActiveRecord::Migration[5.2]
  def change
    add_column :payments, :responsible_party_id, :integer
  end
end
