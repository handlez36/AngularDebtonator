module Types
  class BatchResponseType < Types::BaseEnum
    value "success", "All elements of the batch request were processed successfully"
    value "partial", "Some elements of the batch request failed"
  end
end
