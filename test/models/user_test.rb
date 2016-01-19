require 'test_helper'

class UserTest < ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods
  
  setup do
    @user = create(:user)
    
    party1 = create(:responsible_party, :name => "Cameron")
    party2 = create(:responsible_party, :name => "Devin")
    party3 = create(:responsible_party, :name => "Jeanine")
    party4 = create(:responsible_party, :name => "BMac")
    
    expense1 = create(:expense, :amt_pending => 100.00, :amt_charged => 400.00, :user_id => @user.id, :responsible_party_id => party1.id)
    expense2 = create(:expense, :amt_pending => 75.00, :amt_charged => 300.00, :amt_paid => 100.00, :user_id => @user.id, :responsible_party_id => party1.id)
    expense3 = create(:expense, :amt_pending => 25.00, :amt_charged => 200.00, :user_id => @user.id, :responsible_party_id => party2.id)
    
    payment1 = create(:payment, :amt_paid => 100.00, :responsible_party_id => party2.id, :expense => expense1, :user_id => @user.id)
    payment2 = create(:payment, :amt_paid => 50.00, :responsible_party_id => party2.id, :expense => expense2, :user_id => @user.id)
    payment4 = create(:payment, :amt_paid => 25.00, :responsible_party_id => party4.id, :expense => expense2, :user_id => @user.id)
    payment3 = create(:payment, :amt_paid => 25.00, :responsible_party_id => party3.id, :expense => expense3, :user_id => @user.id)
    
  end
  
  test '#get_expense_total_by_party with pending' do
    results = @user.get_expense_total_by_party
    sum = results.inject(0) { |sum, result| sum += result[:value] }
    
    cam_total = results.select { |result| result[:label] == "Cameron" }[0][:value]
    devin_total = results.select { |result| result[:label] == "Devin" }[0][:value]
    jeanine_total = results.select { |result| result[:label] == "Jeanine" }[0][:value]
    bmac_total = results.select { |result| result[:label] == "BMac" }[0][:value]
    
    assert_equal 425.00, cam_total
    assert_equal 325.00, devin_total
    assert_equal 25.00, jeanine_total
    assert_equal 25.00, bmac_total
    
  end
  
  test '#get_expense_total_by_party without pending' do
    results = @user.get_expense_total_by_party(false)
    sum = results.inject(0) { |sum, result| sum += result[:value] }
    
    cam_total = results.select { |result| result[:label] == "Cameron" }[0][:value]
    devin_total = results.select { |result| result[:label] == "Devin" }[0][:value]
    
    assert_equal 425.00, cam_total
    assert_equal 175.00, devin_total
    
  end
  
  test "correct card color is returned" do
    user = create(:user)
    card1 = create(:card, :card_retailer => "Card1", :user => user)
    card2 = create(:card, :card_retailer => "Card2", :user => user)
    card3 = create(:card, :card_retailer => "Card3", :user => user)
    card4 = create(:card, :card_retailer => "Card4", :user => user)
    card5 = create(:card, :card_retailer => "Card5", :user => user)
    card6 = create(:card, :card_retailer => "Card6", :user => user)
    card7 = create(:card, :card_retailer => "Card7", :user => user)
    
    assert_equal "orange", user.get_card_color(card1)
    assert_equal "red", user.get_card_color(card2)
    assert_equal "violet", user.get_card_color(card3)
    assert_equal "orange", user.get_card_color(card7)
    
  end

end
