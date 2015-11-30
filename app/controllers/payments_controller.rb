class PaymentsController < ApplicationController
  before_action :authenticate_user!
  
  def create
    params = payment_params
    params[:date] = Date.strptime(params[:date],"%Y-%m-%d")
    
    payment_plan = Payment.get_proper_plan(params[:date], params[:card_id])

    new_payment = current_expense.payments.create( params.merge(:payplan_id => payment_plan.id))
    
    if new_payment.valid?
      redirect_to expenses_path
    else
      return render :text => "Entry invalid", :status => :unprocessable_entity
    end
    
  end
  
  def update
    params = payment_params
    params[:date] = Date.strptime(params[:date],"%Y-%m-%d")
    
    if !current_payment.valid_expense?
      flash[:alert] = "Payment is not allowed for this expense"
      redirect_to expenses_path
    end
    
    current_payment.update_expense
    updated_payment = current_payment.update_attributes(params)
    
    if !updated_payment.valid?
      flash[:alert] = "Invalid payment update"
    end
    
    redirect_to expenses_path
  end
  
  private
  
  helper_method :current_expense
  def current_expense
    @current_expense ||= Expense.find_by_id(params[:expense_id])
  end
  
  helper_method :current_payment
  def current_payment
    @current_payment ||= Payment.find_by_id(params[:id])
  end
  
  def payment_params
    params.require('payment').permit(:amt_paid, :date, :card_id)
  end
end
