class PaymentsController < ApplicationController
  before_action :authenticate_user!
  
  def create
    params = payment_params
    params[:date] = Date.strptime(params[:date],"%Y-%m-%d")
    
    payment_plan = Payment.get_proper_plan(params[:date], params[:card_id], current_user)

    new_payment = current_expense.payments.create( params.merge(:payplan_id => payment_plan.id, :user => current_user))
    
    if new_payment.valid?
      current_expense.update_amt_pending(new_payment.amt_paid)
      redirect_to expenses_path
    else
      return render :text => "Entry invalid", :status => :unprocessable_entity
    end
    
  end
  
  def update
    id = params[:id]
    params = payment_params_from_inline_edit
    #params[:date] = Date.strptime(params[:date],"%Y-%m-%d")
    #puts "Params: #{params}"
    
    params[:value] = current_payment.amt_paid if params[:value].nil?     # used to be params[:amt_paid]
    if !current_payment.valid_payment?(params[:value].to_f, id)
      #flash[:alert] = "Payment is not allowed for this expense"
      #redirect_to expenses_path and return
      #response :text => "payment not allowed", :status => :unprocessable_entity
      render :json => { status: "error", msg: 'Payment not allowed' } and return
    end
    
    current_payment.remove_from_expense
    updated_payment = current_payment.update(:amt_paid => params[:value].to_f)
    current_payment.update_expense params[:value].to_f
    
    if !updated_payment
      flash[:alert] = "Invalid payment update"
    end
    
    render :text => "success", :status => :ok
  end
  
  def destroy
    current_payment.destroy if !current_payment.nil?
    current_payment.payplan.destroy if current_payment.payplan.payments.count == 0
    
    puts "Payment count: #{current_payment.payplan.payments.count}"
    payment_count = current_payment.payplan.payments.count.to_i
    render :json => { status: "success", count: payment_count, plan: current_payment.payplan } and return
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
    params.require('payment').permit(:amt_paid, :date, :card_id, :responsible_party_id)
  end
  
  def payment_params_from_inline_edit
    p = {}
    p[:date] = params[:date] if !params[:date].nil?
    p[:value] = params[:value] if !params[:value].nil?
    p[:id] = params[:id] if !params[:id].nil?
    return p
  end
end