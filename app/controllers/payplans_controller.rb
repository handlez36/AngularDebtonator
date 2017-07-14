class PayplansController < ApplicationController
  before_action :authenticate_user! 
  before_action :authorize_user, :only => [:destroy, :lock]
  
  # Controller action for archived expense/payments requests
  def archived
    unless params[:id].nil?
      puts "ID of payplan: #{params[:id]}"
      @payplan = Payplan.find(params[:id])
    end
  end
  
  # Controller action for destorying a payplan
  def destroy
    @payplan.destroy
    redirect_to expenses_path
  end
  
  # Controller action for locking/archiving in a payplan
  def lock
    lock_status = @payplan.lock
    
    flash[:alert] = "Error locking payplan: #{lock_status.errors}" unless lock_status
    redirect_to expenses_path
  end
  
  private
  
  # Return the current payplan for this specific request
  helper_method :current_payplan
  def current_payplan
    @payplan ||= Payplan.find_by_id(params[:id])
  end
  
  # Return current archived payment plans for the current user
  helper_method :current_plans
  def current_plans
    @payplans ||= current_user.payplans.where(:archived => true)
  end
  
  # Return current expenses for the current user
  helper_method :current_archived_expenses
  def current_archived_expenses(payplan = nil)
    puts "Payplan: #{ payplan.inspect }"
    if payplan.nil?
      #@expenses ||= current_user.expenses.where("archived = ? or amt_paid > ?", true, 0).paginate( :page => params[:page], :per_page => 6 )
      @expenses ||= current_user.payments.paginate( :page => params[:page], :per_page => 9 )
    else
      @expenses ||= payplan.expenses.paginate( :page => params[:page], :per_page => 9 )
      @payments ||= payplan.payments.paginate( :page => params[:page], :per_page => 9 )
    end
  end
  
  # Ensure certain payplan interactions are being performed by the user that created them
  def authorize_user
    if current_user != current_payplan.user
      flash[:alert] = "Unauthorized User!"
      render :text => "Unauthorized action", :status => :unprocessable_entity
    end
  end

end
