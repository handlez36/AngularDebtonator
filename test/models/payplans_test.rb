require 'test_helper'

class PayplansTest < ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods
  
  setup do
    @expense1 = create(:expense)
    @expense2 = create(:expense, :amt_charged => 300.00)
    @expense3 = create(:expense, :amt_pending => 0.00)
    
    @payment1= create(:payment, :expense => @expense1)
    @payment2 = create(:payment, :expense => @expense2, :payplan => @payment1.payplan)
    @payment3 = create(:payment, :expense => @expense3, :amt_paid => 550.00)
    @expense3.amt_pending = 550.00
    @expense3.save
    
    @payplan = @payment1.payplan
    @payplan2 = @payment3.payplan

  end
  
  test "locking a payplan archives the payplan and payments" do    
    @payplan.lock
    
    @payment1.reload
    @payment2.reload
    @expense1.reload
    @expense2.reload
    @payplan.reload
    @payplan2.reload
    
    assert_equal true, @payplan.archived
    assert_equal true, @payment1.archived
    assert_equal true, @payment2.archived
    
    assert_equal 0, @payplan2.payments.select { |p| p.archived == true }.count
    assert_equal 1, @payplan2.payments.select { |p| p.archived == false }.count
    
  end
    
  test "locking a payplan properly adjusts expense amounts" do    
    
    assert_equal 300, @payment2.expense.amt_charged
    
    @payplan.lock
    
    @payment1.reload
    @payment2.reload
    @expense1.reload
    @expense2.reload
    @payplan.reload
    
    assert_equal 300.00, @payment2.expense.amt_charged
    assert_equal 1.00, @payment2.expense.amt_paid
    assert_equal 0.00, @payment2.expense.amt_pending
    
  end
  
  test "locking a payplan removes expense amounts that are fully paid" do    
    
    @payplan2.lock
    
    @payment3.reload
    @expense3.reload
    @payplan2.reload
    
    assert_equal true, @expense3.archived
    
  end
    
end
