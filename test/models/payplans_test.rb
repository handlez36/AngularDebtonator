require 'test_helper'

class PayplansTest < ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "get all payees" do
    expense1 = create(:expense)
    expense2 = create(:expense, :amt_charged => 300.00)
    expense3 = create(:expense)
    
    payment1= create(:payment, :expense => expense1)
    payment2 = create(:payment, :expense => expense2, :payplan => payment1.payplan)
    payment3 = create(:payment, :expense => expense3)
    
    @payplan = payment1.payplan
    @payplan2 = payment3.payplan
    
    @payplan.lock
    
    assert_equal true, @payplan.archived
    assert_equal true, payment1.archived
    assert_equal true, payment2.archived
    
    assert_equal 2, @payplan.payments.select { |p| p.archived == true }
    assert_equal 0, @payplan.payments.select { |p| p.archived == false }
    
    assert_equal 0, @payplan2.payments.select { |p| p.archived == true }
    assert_equal 1, @payplan2.payments.select { |p| p.archived == false }
    
  end
    
end
