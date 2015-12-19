require 'test_helper'

class PayplansTest < ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "get all payees" do
    payment1= create(:payment)
    payment2 = create(:payment, :payplan => payment1.payplan)
  end
    
end
