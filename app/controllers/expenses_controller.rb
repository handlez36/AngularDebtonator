class ExpensesController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user, :only => [:edit, :update, :destroy]
  
  def index
    if current_user.cards.count == 0 || current_user.responsible_parties.count == 0
      redirect_to setup_path
    end
    
  end
  
  def create    
    params = expense_params
    params[:date] = Date.strptime(params[:date],"%Y-%m-%d")
    @expense = current_user.expenses.create(params)
    
    if @expense.valid?
      redirect_to expenses_path
    else
      flash[:alert] = "Validation error!"
      render :new, :status => :unprocessable_entity
    end
  end
  
  def new
    @expense = Expense.new
  end
  
  def edit
  end
  
  def update
    if !current_expense.valid_expense_change?(expense_params[:amt_charged].to_f) && expense_params[:amt_charged].to_f >= 0.00
      flash[:alert] = "Please delete pending payment first"
      redirect_to expenses_path and return
    end
    
    current_expense.update_attributes(expense_params.merge(:user => current_user))
    
    flash[:alert] = "Validation errors with expense update" unless current_expense.valid?
    
    redirect_to expenses_path
  end
  
  def destroy
    if !current_expense.nil?
      current_expense.remove_planned_payments
      current_expense.destroy
    end
    
    redirect_to expenses_path
  end
  
  def setup
  end
    
  private
  
  helper_method :current_expenses
  def current_expenses
    @expenses ||= current_user.expenses
  end
  
  helper_method :current_expense
  def current_expense
    @expense ||= Expense.find_by_id(params[:id])
  end
  
  helper_method :current_plans
  def current_plans
    @plans ||= current_user.payplans.where(:archived => false)
  end
  
  def authorize_user
    if current_user != current_expense.user
      flash[:alert] = "Unauthorized User!"
      render :text => "Unauthorized action", :status => :unprocessable_entity
    end
  end
  
  def expense_params
    params.require('expense').permit(:date, :retailer, :amt_charged, :amt_paid, :split, :how_to_pay, :payment_status, :card_id, "responsible_party_id")
  end
end

