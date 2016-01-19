class CardsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user!, :only => [:update, :destroy]
  
  # Controller action for creating a new card
  def create
    status = current_user.cards.create(card_params)
    
    if !status
      flash[:alert] = "Error while adding card"
    end
    
    redirect_to setup_path
  end
  
  # Controller action for updating an existing card
  def update
    status = @card.update_attributes(:card_retailer => params[:value])
    
    if !status
      flash[:alert] = "Error while updating card"
      render :json => { status: "error", msg: 'Error updating name' } and return
    else
      render :json => { status: "success", msg: 'Name changed' } and return
    end
    
  end
  
  # Controller action for deleting a card
  def destroy
    status = @card.destroy
    
    if !status
      flash[:alert] = "Error while deleting card"
    end
    
    render :json => { status: "success" } and return
  end
  
  private
  
  # Returns the current card for this specific request
  helper_method :current_card
  def current_card
    @card ||= Card.find_by_id(params[:id])
  end
  
  # Ensure certain card interactions are being performed by the user that created them
  def authorize_user!
    if current_user != current_card.user
      flash[:alert] = "Unauthorized User!"
      render :text => "Unauthorized action", :status => :unprocessable_entity
    end
  end
  
  # Capture parameters passed in for card creates
  def card_params
    params.require(:card).permit(:card_retailer)
  end
  
end
