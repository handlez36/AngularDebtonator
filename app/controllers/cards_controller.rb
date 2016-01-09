class CardsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user!, :only => [:update, :destroy]
  
  def create
    status = current_user.cards.create(card_params)
    
    if !status
      flash[:alert] = "Error while adding card"
    end
    
    redirect_to setup_path
  end
  
  def update
    status = Card.find_by_id(params[:id]).update_attributes(:card_retailer => params[:value])
    
    if !status
      flash[:alert] = "Error while updating card"
      render :json => { status: "error", msg: 'Error updating name' } and return
    else
      render :json => { status: "success", msg: 'Name changed' } and return
    end
    
  end
  
  def destroy
    status = Card.delete(params[:id])
    
    if !status
      flash[:alert] = "Error while deleting card"
    end
    
    render :json => { status: "success" } and return
  end
  
  private
  
  def authorize_user!
  end
  
  def card_params
    params.require(:card).permit(:card_retailer)
  end
  
end
