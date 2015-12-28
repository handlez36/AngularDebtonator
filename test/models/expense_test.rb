require 'test_helper'

class ExpenseTest < ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "total expenses returns calculated total expenses" do
    user = create(:user)
    
    expense1 = create(:expense, :amt_charged => 100.00, :user => user)
    expense2 = create(:expense, :amt_charged => 350.00, :user => user)
    expense3 = create(:expense, :amt_charged => 25.17, :user => user)
    
    assert_equal 475.17, user.get_total_expense_amt
  end
end
