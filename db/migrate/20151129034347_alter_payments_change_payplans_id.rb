class AlterPaymentsChangePayplansId < ActiveRecord::Migration[5.2]
  def change
    rename_column :payments, :payplans_id, :payplan_id
  end
end
