class AlterPaymentsAddResponsibleParty < ActiveRecord::Migration
  def change
    add_column :payments, :responsible_party_id, :integer
  end
end
