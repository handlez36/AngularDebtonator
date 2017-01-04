module PayplansHelper
  def expense_summary(condition)
    summary_str = "<table class='expense-summary-table'><th>Expense</th><th>Before</th><th>After</th>"
    
    if condition == "party"
      expenses_before_payment = current_user.get_expense_total_by_party
      expenses_after_payment = current_user.get_expense_total_by_party(false)
    else
      expenses_before_payment = current_user.get_expense_total_by_card
      expenses_after_payment = current_user.get_expense_total_by_card(false)
    end
    
#    puts "Expenses Before: #{expenses_before_payment.inspect}"
#    puts "Expenses After: #{expenses_after_payment.inspect}"
    expenses_before_payment.each do |expense|
      summary_str += "<tr>"
      current_party = expense[:label]
      remaining_expense = expenses_after_payment.select do |e|
#        puts "Expenses after payment for #{e[:label]}"
#        e[:label] == current_party
      end.first[:value] || 0
      summary_str += "<td>#{current_party}</td><td>#{number_to_currency(expense[:value])}</td><td>#{number_to_currency(remaining_expense)}</td>"
      summary_str += "</tr>"
    end
    
    summary_str += "</table>"
    summary_str.html_safe
  end
end