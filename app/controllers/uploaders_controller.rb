class UploadersController < ApplicationController
  require "simple-spreadsheet"
  
  before_action :authenticate_user!
  before_action :authorize_for_admin!
  
  def index
    s = SimpleSpreadsheet::Workbook.read("#{Rails.root}/app/assets/spreadsheets/cc.csv")
#    
    count = 0
    # "2015-11-30"
    s.first_row.upto(s.last_row) do |line|
      if !s.cell(line, 2).nil? && s.cell(line,2) != "Description"
        count += 1
        
        tmp_date = s.cell(line, 2)[/\((.*)\)/, 1]
        mo = tmp_date[/(\d+)\//, 1]
        day = tmp_date[/\d+\/(\d+)/, 1]        
        date = (mo == 1) ? Date.strptime("#{mo}/#{day}","%m/%d") : Date.strptime("2015/#{mo}/#{day}","%Y/%m/%d")
        
        retailer = s.cell(line, 2).sub(/\(.*\)/, '')
        amt_charged = s.cell(line, 3).sub(/[\$\s]/, '').to_f
        amt_paid = 0.00
        amt_pending = 0.00
        how_to_pay = (s.cell(line, 8)) || "TBD"
        card = s.cell(line, 6)
        party = s.cell(line, 7)
        
        add_expense(date, retailer, amt_charged, amt_paid, amt_pending, how_to_pay, card, party)
      end
    end
    
    render :text => "Successful", :status => :ok
  end
  
  def add_expense(date, retailer, amt_charged, amt_paid, amt_pending, how_to_pay, card, party)
    current_user.expenses.create(
      :date => date,
      :retailer => retailer,
      :amt_charged => amt_charged,
      :amt_paid => amt_paid,
      :amt_pending => amt_pending,
      :how_to_pay => how_to_pay,
      :card_id => Card.find_by(:card_retailer => card).id,
      :responsible_party_id => party.nil? ? current_user.responsible_parties.first.id : current_user.responsible_parties.where(:name => party).count > 0 ? current_user.responsible_parties.where(:name => party).first.id : current_user.responsible_parties.first.id
    )    
  end
  
  def authorize_for_admin!
    unless current_user.email == "handlez36@gmail.com"
      flash[:alert] = "Unauthorized access!"
      redirect_to root_path
    end
  end
  
end
