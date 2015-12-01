require 'test_helper'

class PaymentsTest < ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "updated payment with valid and invalid amount" do
    expense = create(:expense)
    payplan = create(:payplan)
    
    payment = create(:payment, :expense => expense, :payplan => payplan)
    
    assert_equal true, payment.valid_payment?(549)
    assert_equal false, payment.valid_payment?(551)
  end
  
end
