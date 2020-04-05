class ChangePayplanDateToDatetime < ActiveRecord::Migration[6.0]
  def change
    change_column :payplans, :date, :datetime
  end
end
