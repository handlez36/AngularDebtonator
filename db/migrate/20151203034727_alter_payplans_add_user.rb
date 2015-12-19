class AlterPayplansAddUser < ActiveRecord::Migration
  def change
    add_column :payplans, :user_id, :integer
  end
end
