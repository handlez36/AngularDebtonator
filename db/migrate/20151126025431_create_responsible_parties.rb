class CreateResponsibleParties < ActiveRecord::Migration
  def change
    create_table :responsible_parties do |t|
      
      t.string :name
      
      t.timestamps
    end
  end
end
