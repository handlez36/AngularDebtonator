require 'test_helper'

class CardsControllerTest < ActionController::TestCase
  include FactoryGirl::Syntax::Methods
  
  test "user can add new card if signed in" do
    user = create(:user)
    sign_in user
    
    assert_difference "Card.count" do
      post :create, :card => {
        :card_retailer => "NewCard"
      }
    end
    
    assert_equal 1, user.cards.count
    assert_redirected_to setup_path
  end
  
  test "user cannot add new card if not signed in" do
    
    assert_no_difference "Card.count" do
      post :create, :card => {
        :card_retailer => "NewCard"
      }
    end
    
    assert_redirected_to new_user_session_path
  end
  
  test "user can edit a card" do
    user = create(:user)
    sign_in user
    
    card = create(:card, :user => user)
    id = card.id
    
    put :update, :id => id, :value => "UpdatedCard"  
    
    card.reload
    assert_equal "UpdatedCard", card.card_retailer
    assert_response :ok
    
  end
  
  test "user can delete a card" do
    user = create(:user)
    sign_in user
    
    card = create(:card, :user => user)
    id = card.id
    
    delete :destroy, :id => id
    
    assert_nil Card.find_by_id(id)
    assert_response :ok
    
  end
  
end
