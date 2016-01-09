require 'test_helper'

class PayplansControllerTest < ActionController::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "deleting payplan deletes related payments" do
    user = create(:user)
    sign_in user
    
    card = create(:card)
    expense = create(:expense, :amt_pending => 130.00, :user => user)
    payplan = create(:payplan, :card => card, :user => user)
    payment1 = create(:payment, :amt_paid => 30.00, :card => card, :payplan => payplan, :expense => expense, :user => user)
    payment2 = create(:payment, :amt_paid => 100.00, :card => card, :payplan => payplan, :expense => expense, :user => user)
    
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
  
  test "locking a payplan reloads the expense page" do
    user = create(:user)
    sign_in user
    
    expense1 = create(:expense, :user => user)
    expense2 = create(:expense, :amt_charged => 300.00, :user => user)
    
    payment1= create(:payment, :expense => expense1, :user => user)
    payment2 = create(:payment, :expense => expense2, :payplan => payment1.payplan, :user => user)
    
    payplan = payment1.payplan
    payplan.user = user
    payplan.save
    
    assert_difference "payplan.payments.where(:archived => true).count", +2 do
      put :lock, :id => payplan.id
    end
    
    assert_redirected_to expenses_path
    
  end
  
  test "user cannot lock another user's payplan" do
    user = create(:user)
    user2 = create(:user)
    sign_in user
    
    expense1 = create(:expense, :user => user2)
    expense2 = create(:expense, :amt_charged => 300.00, :user => user2)
    
    payment1= create(:payment, :expense => expense1, :user => user2)
    payment2 = create(:payment, :expense => expense2, :payplan => payment1.payplan, :user => user2)
    
    payplan = payment1.payplan
    
    assert_no_difference "payplan.payments.where(:archived => true).count" do
      put :lock, :id => payplan.id
    end
    
    assert_response :unprocessable_entity
    
  end
    
  test "user can access the archived payments page" do
    user = create(:user)
    sign_in user
    
    expense = create(:expense)
    payment = create(:payment, :expense => expense)
    payplan = payment.payplan
    
    get :archived
    
    assert_response :ok
    
  end

end