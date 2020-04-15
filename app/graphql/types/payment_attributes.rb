class Types::PaymentAttributes < Types::BaseInputObject
  description "Attributes for creating a Payment"
  argument :expenseId, ID, required: true
  argument :date, GraphQL::Types::ISO8601DateTime, required: true
  argument :amtPaid, String, required: true
  argument :responsibleParty, String, required: true
  argument :howToPay, String, required: false  
end