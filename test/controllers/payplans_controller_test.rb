require 'test_helper'

class PayplansControllerTest < ActionController::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "deleting payplan deletes related payments" do
    user = create(:user)
    sign_in user
    
    card = create(:card)
    expense = create(:expense, :amt_pending => 130.00)
    payplan = create(:payplan, :card => card)
    payment1 = create(:payment, :amt_paid => 30.00, :card => card, :payplan => payplan, :expense => expense)
    payment2 = create(:payment, :amt_paid => 100.00, :card => card, :payplan => payplan, :expense => expense)
    
    assert_difference "Payplan.count", -1 do
      delete :destroy, :id => payplan.id
    end

    expense.reload
    
    assert_nil Payplan.find_by_id(payplan.id)
    assert_nil Payment.find_by_id(payment1.id)
    assert_nil Payment.find_by_id(payment2.id)
    assert_equal 0.00, expense.amt_pending
    assert_redirected_to expenses_path
  end

end