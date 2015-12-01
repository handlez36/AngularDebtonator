require 'test_helper'

class PaymentsControllerTest < ActionController::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "add a payment (user logged in)" do
    user = create(:user)
    sign_in user
    
    expense = create(:expense, :user => user)
    card = create(:card)
    
    assert_difference "expense.payplan.count" do
      post :create, :expense_id => expense.id, :payment => {
        :date => Date.today,
        :amt_paid => 5.00,
        :card_id => card.id
        }
    end
    
    assert_equal 5.00, Payment.last.amt_paid
    assert_equal Date.today, Payment.last.date 
    assert_equal card.id, Payment.last.card_id 
    
    assert_equal Date.today, Payplan.last.date
    assert_equal card.id, Payplan.last.card_id
    
    expense.reload
    assert_equal 6.00, expense.amt_pending
    assert_redirected_to expenses_path
    
  end
  
  test "add a payment with invalid parameters (user logged in)" do
    user = create(:user)
    sign_in user
    
    expense = create(:expense, :user => user)
    card = create(:card)
    
    assert_no_difference "expense.payplan.count" do
      post "create", :expense_id => expense.id, :payment => {
        :date => Date.today,
        :amt_paid => -3.00,   # negative amount
        :card_id => card.id
        }
    end
    
    assert_response :unprocessable_entity
    
  end
  
  test "update payment with valid amount after previously added" do
    user = create(:user)
    sign_in user
    
    expense = create(:expense, :user => user)
    card = create(:card)
    payment = create(:payment, :expense => expense)
    
    put :update, :id => payment.id, :payment => {
      :date => Date.new(2015, 10, 30),   # Updated date
      :amt_paid => 10.00,       # Updated amt_paid
      :card_id => payment.card.id
      }
    payment.reload
    expense.reload
    
    assert_equal 10.00, payment.amt_paid
    assert_equal 10.00, expense.amt_pending
    assert_equal Date.new(2015, 10, 30), payment.date
    assert_redirected_to expenses_path
  end
  
  test "update payment with invalid amount after previously added" do
    user = create(:user)
    sign_in user
    
    expense = create(:expense, :user => user)
    card = create(:card)
    payment = create(:payment, :expense => expense)
    
    put :update, :id => payment.id, :payment => {
      :date => Date.new(2015, 10, 30),   # Updated date
      :amt_paid => 600.00,       # Updated amt_paid
      :card_id => payment.card.id
      }
    payment.reload
    expense.reload
    
    assert_equal 1.00, payment.amt_paid
    assert_equal 1.00, expense.amt_pending
    assert_equal Date.today, payment.date
    assert_redirected_to expenses_path
  end
  
  test "update payment with no amount included after previously added" do
    user = create(:user)
    sign_in user
    
    expense = create(:expense, :user => user)
    card = create(:card)
    payment = create(:payment, :expense => expense)
    
    put :update, :id => payment.id, :payment => {
      :date => Date.new(2015, 10, 30),   # Updated date
      :card_id => payment.card.id
      }
    payment.reload
    expense.reload
    
    assert_equal 1.00, payment.amt_paid
    assert_equal 1.00, expense.amt_pending
    assert_equal Date.new(2015, 10, 30), payment.date
    assert_redirected_to expenses_path
  end
  
  test "delete payment after previously added" do
    user = create(:user)
    sign_in user
    
    expense = create(:expense, :user => user)
    card = create(:card)
    payplan = create(:payplan, :card => card)
    
    post :create, :expense_id => expense.id, :payment => {
      :date => Date.today,
      :amt_paid => 20.00,
      :expense_id => expense.id,
      :card_id => card.id,
      :payplan_id => payplan.id
      }
    
    post :create, :expense_id => expense.id, :payment => {
      :date => Date.today,
      :amt_paid => 50.00,
      :expense_id => expense.id,
      :card_id => card.id,
      :payplan_id => payplan.id
      }
    
    expense.reload
    assert_equal 71.00, expense.amt_pending
    
    id = Payment.where(:amt_paid => 20).first.id
    assert_difference "Payment.count", -1 do
      delete :destroy, :id => id
    end
    
    expense.reload
    assert_nil Payment.find_by_id(id)
    assert_equal 51.00, expense.amt_pending
    
  end

end
