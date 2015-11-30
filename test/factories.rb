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
    association :user
    association :card
  end
end

# FactoryGirl instance for a responsible_party
FactoryGirl.define do
  factory :responsible_party do
    name "Brandon"
  end
end

FactoryGirl.define do
  factory :payplan do
    date Date.today
    comments "Test comment"
    association :card
  end
end

FactoryGirl.define do
  factory :payment do
    amt_paid 1.00
    date Date.today
    association :expense
    association :payplan
    association :card
  end
end