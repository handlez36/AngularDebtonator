require 'test_helper'

class PaymentsTest < ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "updated payment with valid and invalid amount" do
    expense = create(:expense, :amt_charged => 730.00, :amt_paid => 100.00, :amt_pending => 280.00)
    payplan = create(:payplan)
    
    payment1 = create(:payment, :expense => expense, :payplan => payplan, :amt_paid => 40.00)
    payment2 = create(:payment, :expense => expense, :payplan => payplan, :amt_paid => 100.00)
    payment3 = create(:payment, :expense => expense, :payplan => payplan, :amt_paid => 140.00)
    
    assert_equal true, payment3.valid_payment?(490, payment3.id)
    assert_equal false, payment3.valid_payment?(491, payment3.id)
    #assert_equal true, payment.valid_payment?(590, )
    #assert_equal false, payment.valid_payment?(591, )
  end
  
end
