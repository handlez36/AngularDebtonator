class AlterPayplansAddDateCard < ActiveRecord::Migration
  def change
    add_column :payplans, :date, :date
    add_column :payplans, :card_id, :integer
    add_column :payplans, :comments, :text
  end
end
