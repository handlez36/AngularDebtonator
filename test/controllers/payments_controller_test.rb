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
    
    put :update, :payment_id => payment.id, :payment => {
      :date => Date.new(2015, 10, 30),   # Updated date
      :amt_paid => 10.00,       # Updated amt_paid
      :card_id => payment.card.id
      }
    
    assert_equal 10.00, payment.amt_paid
    assert_equal 10.00, expense.amt_paid
    assert_redirected_to expenses_path
  end
end
