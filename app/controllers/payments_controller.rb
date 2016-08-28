class PaymentsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user_for_payment_creation, :only => [:create]
  before_action :authorize_user_for_payment_modification, :only => [:update, :destroy]
  
  # Controller action for creating a new payment. A payment plan is either updated or created based on
  # whether the payment is for an existing payplan (same card and planned pay date)
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
  
  # Controller action for updating a payment (responds to ajax request)
  # Ensure payment update is valid based on the related expense amounts (i.e., you cannot update
  # a payment amount past the current expense amount charged, or any planned payments)
  def update
    id = params[:id]
    params = payment_params_from_inline_edit
    
    params[:value] = current_payment.amt_paid if params[:value].nil?
    if !current_payment.valid_payment?(params[:value].to_f)
      render :json => { status: "error", msg: 'Payment not allowed' } and return
    end
    
    current_payment.remove_from_expense
    updated_payment = current_payment.update(:amt_paid => params[:value].to_f)
    current_payment.update_expense params[:value].to_f
    
    flash[:alert] = "Invalid payment update" unless updated_payment
    render :text => "success", :status => :ok
  end
  
  # Controller action for deleting a payment (responds to ajax request)
  # This will also delete the attached payplan if there are no more payments left
  def destroy
    current_payment.destroy if !current_payment.nil?
    current_payment.payplan.destroy if current_payment.payplan.payments.count == 0
    
    payment_count = current_payment.payplan.payments.count.to_i
    render :json => { status: "success", count: payment_count, plan: current_payment.payplan } and return
  end
  
  private
  
  # Return the current expense for this specific request
  helper_method :current_expense
  def current_expense
    @current_expense ||= Expense.find_by_id(params[:expense_id])
  end
  
  # Return the current payment for this specific request
  helper_method :current_payment
  def current_payment
    @current_payment ||= Payment.find_by_id(params[:id])
  end
  
  # Ensure user creating the payment is the same user that created the expense
  def authorize_user_for_payment_creation
    if current_user != current_expense.user
      flash[:alert] = "Unauthorized User!"
      render :text => "Unauthorized action", :status => :unprocessable_entity
    end
  end
  
  # Ensure user modifying the payment is the same user that created the payment
  def authorize_user_for_payment_modification
    if current_user != current_payment.user
      flash[:alert] = "Unauthorized User!"
      render :text => "Unauthorized action", :status => :unprocessable_entity
    end
  end
  
  # Capture parameters passed in for payment creates
  def payment_params
    params.require('payment').permit(:amt_paid, :date, :card_id, :responsible_party_id, :how_to_pay)
  end
  
  # Capture parameters passed in for payment edits (these capture jQuery/ajax requests)
  def payment_params_from_inline_edit
    p = {}
    p[:value] = params[:value] unless params[:value].nil?
    p[:id] = params[:id] unless params[:id].nil?
    return p
  end
end
