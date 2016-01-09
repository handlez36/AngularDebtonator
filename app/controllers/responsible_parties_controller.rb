class ResponsiblePartiesController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user!, :only => [:update, :destroy]
  
  def create
    status = current_user.responsible_parties.create(party_params)
    
    if !status
      flash[:alert] = "Error while adding party"
    end
    
    redirect_to setup_path
  end
  
  def update
    status = ResponsibleParty.find_by_id(params[:id]).update_attributes(:name => params[:value])
    
    if !status
      flash[:alert] = "Error while updating party name"
      render :json => { status: "error", msg: 'Error updating name' } and return
    else
      render :json => { status: "success", msg: 'Name changed' } and return
    end
  end
  
  def destroy
    status = ResponsibleParty.delete(params[:id])
    
    if !status
      flash[:alert] = "Error while deleting party"
    end
    
    render :json => { status: "success" } and return
    #redirect_to setup_path
  end
  
  private
  
  def authorize_user!
  end
  
  def party_params
    params.require(:responsible_party).permit(:name)
  end
end
