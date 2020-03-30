class AlterPayplansAddUser < ActiveRecord::Migration[5.2]
  def change
    add_column :payplans, :user_id, :integer
  end
end
