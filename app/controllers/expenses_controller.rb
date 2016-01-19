class ExpensesController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user, :only => [:edit, :update, :destroy]
  
  # Controller action for main expenses/payments index page
  # If user has no cards or responsible parties set up, redirect to setup controller
  def index
    if current_user.cards.count == 0 || current_user.responsible_parties.count == 0
      redirect_to setup_path
    end
    
  end
  
  # Controller action for creating a new expense
  def create    
    params = expense_params
    params[:date] = Date.strptime(params[:date],"%Y-%m-%d")
    @expense = current_user.expenses.create(params)
    
    unless @expense.valid?
      flash[:alert] = "Validation error!"  
    end
    
    redirect_to expenses_path
  end
  
  # Controller action for processing expense updates
  def update
    if !current_expense.valid_expense_change?(expense_params[:amt_charged].to_f) && expense_params[:amt_charged].to_f >= 0.00
      flash[:alert] = "Please delete pending payment first"
      redirect_to expenses_path and return
    end
    
    current_expense.update_attributes(expense_params.merge(:user => current_user))
    
    flash[:alert] = "Validation errors with expense update" unless current_expense.valid?
    
    redirect_to expenses_path
  end
  
  # Controller action for destroying an expense, and any connected payments
  def destroy
    if !current_expense.nil?
      current_expense.remove_planned_payments
      current_expense.destroy
    end
    
    redirect_to expenses_path
  end
  
  # Controller action for setting up a list of cards and/or responsible parties
  # This is required prior to being able to add expenses or payments
  def setup
  end
    
  private
  
  # Return current expenses for the current user
  helper_method :current_expenses
  def current_expenses
    @expenses ||= current_user.expenses
  end
  
  # Return the current expense for this specific request
  helper_method :current_expense
  def current_expense
    @expense ||= Expense.find_by_id(params[:id])
  end
  
  # Return current unarchived payment plans for the current user
  helper_method :current_plans
  def current_plans
    @plans ||= current_user.payplans.where(:archived => false)
  end
  
  # Ensure certain expense interactions are being performed by the user that created them
  def authorize_user
    if current_user != current_expense.user
      flash[:alert] = "Unauthorized User!"
      render :text => "Unauthorized action", :status => :unprocessable_entity
    end
  end
  
  # Capture parameters passed in for expense creates or updates
  def expense_params
    params.require('expense').permit(:date, :retailer, :amt_charged, :amt_paid, :split, :how_to_pay, :payment_status, :card_id, "responsible_party_id")
  end
end

