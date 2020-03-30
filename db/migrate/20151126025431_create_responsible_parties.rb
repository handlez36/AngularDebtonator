class CreateResponsibleParties < ActiveRecord::Migration[5.2]
  def change
    create_table :responsible_parties do |t|
      
      t.string :name
      
      t.timestamps
    end
  end
end
