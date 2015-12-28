class PayplansController < ApplicationController
  before_action :authenticate_user! 
  before_action :authorize_user, :only => [:destroy]
  
  def destroy
    Payplan.find(params[:id]).destroy
    redirect_to expenses_path
  end
  
  private
  
  helper_method :current_payplan
  def current_payplan
    @payplan ||= Payplan.find_by_id(params[:id])
  end
  
  def authorize_user
    if current_user != current_payplan.user
      flash[:alert] = "Unauthorized User!"
      render :text => "Unauthorized action", :status => :unprocessable_entity
    end
  end
  
end
