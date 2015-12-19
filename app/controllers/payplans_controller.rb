class PayplansController < ApplicationController
  def destroy
    Payplan.find(params[:id]).destroy
    redirect_to expenses_path
  end
end
