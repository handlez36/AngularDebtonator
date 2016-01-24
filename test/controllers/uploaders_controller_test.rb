require 'test_helper'

class UploadersControllerTest < ActionController::TestCase

  test "can read expense spreadsheet" do
    get :index
    
    assert_equal "Savannah trip (8/3)", flash[:alert]
  end
  
end
