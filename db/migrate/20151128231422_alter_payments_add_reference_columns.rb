class AlterPaymentsAddReferenceColumns < ActiveRecord::Migration[5.2]
  def change
    add_column :payments, :expense_id, :integer
    add_column :payments, :payplans_id, :integer
    add_column :payments, :amt_paid, :float
  end
end
