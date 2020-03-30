class CreateExpenses < ActiveRecord::Migration[5.2]
  def change
    create_table :expenses do |t|
      
      t.date :date
      t.string :retailer
      t.float :amt_charged
      t.float :amt_paid
      t.float :running_balance
      t.boolean :split
      t.string :how_to_pay
      t.integer :payment_status
      
      t.timestamps
    end
  end
end