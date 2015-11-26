class ExpensesController < ApplicationController
  before_action :authenticate_user!
  
  def index
  end
  
  def create
    @expense = current_user.expenses.create(expense_params)
    
    if @expense.valid?
      redirect_to expenses_path
    else
      flash[alert] = "Validation error!"
      render :new, :status => :unprocessable_entity
    end
  end
  
  def new
    @expense = Expense.new
  end
  
  def edit
  end
  
  def update
    updated_expense = current_expense
    current_expense.update_attributes(expense_params)
    
    if current_expense.valid?
      #puts "This is a valid update"
      redirect_to expenses_path
    else
      #puts "This is not a valid update"
      redirect_to edit_expense_path(updated_expense)
    end
  end
  
  def destroy
    @expense = current_expense
    @expense.destroy

    redirect_to expenses_path
  end
    
  private
  
  helper_method :current_expenses
  def current_expenses
    @expenses ||= Expense.all
  end
  
  helper_method :current_expense
  def current_expense
    @expense ||= Expense.find_by_id(params[:id])
  end
  
  def expense_params
    params.require('expense').permit(:date, :retailer, :amt_charged, :amt_paid, :split, :how_to_pay, :payment_status)
  end
end

