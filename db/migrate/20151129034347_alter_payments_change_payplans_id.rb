class AlterPaymentsChangePayplansId < ActiveRecord::Migration
  def change
    rename_column :payments, :payplans_id, :payplan_id
  end
end
