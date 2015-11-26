# FactoryGirl instance for a user
FactoryGirl.define do
  factory :user do
    sequence :email do |n|
      "testemail#{n}@test.com"
    end
    password "randompassword"
    password_confirmation "randompassword"
  end
end

# FactoryGirl instance for a card
FactoryGirl.define do
  factory :card do
    card_retailer "AmEx"
  end
end

# FactoryGirl instance for an expense
FactoryGirl.define do
  factory :expense do
    date Date.today
    sequence :retailer do |n|
      "Retailer#{n}"
    end
    amt_charged 550
    amt_paid 0
    how_to_pay "TBD"
    payment_status 0
  end
end

