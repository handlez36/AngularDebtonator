# app/inputs/currency_input.rb
class CurrencyInput < SimpleForm::Inputs::Base

  def input
    input_html_classes.unshift("string currency")
    input_html_options[:type] ||= input_type if html5?

    template.content_tag(:span, "$", class: "add-on") +
      @builder.text_field(attribute_name, input_html_options)
  end
end