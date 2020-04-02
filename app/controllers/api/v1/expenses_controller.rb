class Api::V1::ExpensesController < ApplicationController
  def index
    render json: current_expenses
  end

  # Return current expenses for the current user
  helper_method :current_expenses
  def current_expenses
    rp_filter = if params["rp_filter"]
      ResponsibleParty.find_by(name: params["rp_filter"]).id
    else
      ResponsibleParty.all.map(&:id)
    end
    
    @expenses ||= current_user.expenses
      .where( :archived => false )
      .where( :responsible_party_id => rp_filter )
      .order('date DESC, id DESC')
  end
end
