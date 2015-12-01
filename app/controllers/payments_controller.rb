class PaymentsController < ApplicationController
  before_action :authenticate_user!
  
  def create
    params = payment_params
    params[:date] = Date.strptime(params[:date],"%Y-%m-%d")
    
    payment_plan = Payment.get_proper_plan(params[:date], params[:card_id])

    new_payment = current_expense.payments.create( params.merge(:payplan_id => payment_plan.id))
    
    if new_payment.valid?
      current_expense.amt_pending += new_payment.amt_paid
      current_expense.save
      redirect_to expenses_path
    else
      return render :text => "Entry invalid", :status => :unprocessable_entity
    end
    
  end
  
  def update
    params = payment_params
    params[:date] = Date.strptime(params[:date],"%Y-%m-%d")
    
    params[:amt_paid] = current_payment.amt_paid if params[:amt_paid].nil?
    if !current_payment.valid_payment?(params[:amt_paid].to_f)
      flash[:alert] = "Payment is not allowed for this expense"
      redirect_to expenses_path and return
    end
    
    current_payment.update_expense(params[:amt_paid].to_f)
    updated_payment = current_payment.update_attributes(params)
    
    if !updated_payment
      flash[:alert] = "Invalid payment update"
    end
    
    redirect_to expenses_path
  end
  
  def destroy
    if !current_payment.nil?
      current_payment.update_expense(0)
      current_payment.destroy
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
