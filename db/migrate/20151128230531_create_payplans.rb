class CreatePayplans < ActiveRecord::Migration
  def change
    create_table :payplans do |t|

      t.timestamps
    end
  end
end
