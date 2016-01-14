class ResponsiblePartiesController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user!, :only => [:update, :destroy]
  
  # Controller action for creating a new responsible party
  def create
    status = current_user.responsible_parties.create(party_params)
    
    if !status
      flash[:alert] = "Error while adding party"
    end
    
    redirect_to setup_path
  end
  
  # Controller action for updating an existing responsible party
  def update
    status = @party.update_attributes(:name => params[:value])
    
    if !status
      flash[:alert] = "Error while updating party name"
      render :json => { status: "error", msg: 'Error updating name' } and return
    else
      render :json => { status: "success", msg: 'Name changed' } and return
    end
  end
  
  # Controller action for destroying an existing responsible party
  def destroy
    status = @party.destroy
    
    if !status
      flash[:alert] = "Error while deleting party"
    end
    
    render :json => { status: "success" } and return
  end
  
  private
  
  # Returns the current party for this specific request
  helper_method :current_party
  def current_party
    @party ||= ResponsibleParty.find_by_id(params[:id])
  end
  
  # Ensure certain party interactions are being performed by the user that created them
  def authorize_user!
    if current_user != current_party.user
      flash[:alert] = "Unauthorized User!"
      render :text => "Unauthorized action", :status => :unprocessable_entity
    end
  end
  
  # Capture parameters passed in for party creates
  def party_params
    params.require(:responsible_party).permit(:name)
  end
end
