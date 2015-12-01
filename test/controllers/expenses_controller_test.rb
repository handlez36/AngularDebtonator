require 'test_helper'

class ExpensesControllerTest < ActionController::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "go to expense page when user is logged in" do
    user = create(:user)
    sign_in user
    
    get :index
    
    assert_response :success
  end
  
  test "try to show expenses when no user logged in" do
    
    get :index
    
    assert_response :found
  end
  
  # TO DO
  test "show specific expenses for two different users" do
  end
  
  test "add new expenses (user logged in)" do
    user = create(:user)
    sign_in user
    
    card = create(:card)
    
    assert_difference "user.expenses.count" do
      post :create, :expense => {
        :date => Date.today,
        :retailer => "Best Buy",
        :amt_charged => 105.00,
        :amt_paid => 0.00,
        :split => false,
        :how_to_pay => "TBD",
        :payment_status => 0,
        :card_id => card.id,
        :user_id => user.id
        }
    end
    
    assert_response :found
    assert_redirected_to expenses_path
  end

  test "add new expenses (user not logged in)" do
    
    assert_no_difference "Expense.count" do
      post :create, :expense => {
        :date => Date.today,
        :retailer => "Best Buy",
        :amt_charged => 105.00,
        :amt_paid => 0.00,
        :split => false,
        :how_to_pay => "TBD",
        :payment_status => 0
        }
    end
    
    assert_response :found
  end
  
  test "expense defaults set properly" do
    user = create(:user)
    sign_in user
    
    card = create(:card)
    
    post :create, :expense => {
      :date => Date.today,
      :retailer => "Best Buy",
      :amt_charged => 200.00,
      :card_id => card.id,
      :user_id => user.id
      }
    
    new_expense = user.expenses.last

    assert_equal Date.today, new_expense.date
    assert_equal 0.00, new_expense.amt_paid
    assert_equal false, new_expense.split
    assert_equal "Not sure", new_expense.how_to_pay
    assert_equal 0, new_expense.payment_status
    assert_equal user, new_expense.user
  end
  
  test "validations trigger properly for new expense" do
    user = create(:user)
    sign_in user
    
    assert_no_difference "Expense.count" do
      post :create, :expense => {
        :date => Date.today,
        :retailer => "Target",
        }
    end
    
    assert_response :unprocessable_entity
    
  end
  
  test "user can edit an expense" do
    user = create(:user)
    sign_in user
    
    expense = create(:expense, :user => user)
    
    put :update, :id => expense.id, :expense => {
      :retailer => "Chick Fil A"
      }
    
    expense.reload
    assert_equal "Chick Fil A", expense.retailer
    assert_redirected_to expenses_path
  end
  
  test "user cannot edit the amt_charged for a expense below a payment amount" do
    user = create(:user)
    sign_in user
    
    card = create(:card)
    expense = create(:expense, :user => user, :card => card)
    payment = create(:payment, :expense => expense, :card => card, :payplan => create(:payplan, :card => card))
    
    
    put :update, :id => expense.id, :expense => {
      :amt_charged => 0.00
      }
    
    expense.reload
    assert_equal 550.00, expense.amt_charged    # amt_charged remains unchanged due to a pending payment
    assert_redirected_to expenses_path
  end
  
  test "user can delete an expense" do
    user = create(:user)
    sign_in user
    
    card = create(:card)
    
    expense = create(:expense, :user => user, :card => card)
    
#    delete :destroy, :id => expense.id
    
#    assert_nil Expense.find_by_id(expense.id)
#    assert_redirected_to expenses_path
  end
  
  test "deletion of a expense removes any planned payments for that expense" do
    user = create(:user)
    sign_in user
    
    card = create(:card)
    expense = create(:expense, :user => user, :card => card)
    payment1 = create(:payment, :expense => expense, :card => card, :amt_paid => 100.00, :payplan => create(:payplan, :card => card))
    payment2 = create(:payment, :expense => expense, :card => card, :amt_paid => 45.00, :payplan => create(:payplan, :card => card))
    
    total_planned_payments = expense.payments.inject(0) { |sum, payment| sum += payment.amt_paid }
    assert_equal 145.00, total_planned_payments
    
    delete :destroy, :id => expense.id
    
    assert_nil Expense.find_by_id(expense.id)
    assert_nil Payment.find_by_id(payment1.id)
    assert_nil Payment.find_by_id(payment2.id)
  end

end
