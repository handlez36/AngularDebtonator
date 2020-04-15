# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_15_024830) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admin_users", id: :serial, force: :cascade do |t|
    t.string "email", limit: 255, default: "", null: false
    t.string "encrypted_password", limit: 255, default: "", null: false
    t.string "reset_password_token", limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "cards", id: :serial, force: :cascade do |t|
    t.string "card_retailer", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_id"
  end

  create_table "expenses", id: :serial, force: :cascade do |t|
    t.datetime "date"
    t.string "retailer", limit: 255
    t.decimal "amt_charged", precision: 10, scale: 2
    t.decimal "amt_paid", precision: 10, scale: 2
    t.boolean "split"
    t.string "how_to_pay", limit: 255
    t.integer "payment_status"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_id"
    t.integer "card_id"
    t.integer "responsible_party_id"
    t.decimal "amt_pending", precision: 10, scale: 2
    t.boolean "archived", default: false
    t.index ["user_id"], name: "index_expenses_on_user_id"
  end

  create_table "payments", id: :serial, force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "expense_id"
    t.integer "payplan_id"
    t.decimal "amt_paid", precision: 10, scale: 2
    t.datetime "date"
    t.integer "card_id"
    t.integer "user_id"
    t.integer "responsible_party_id"
    t.boolean "archived", default: false
    t.string "how_to_pay", limit: 255
  end

  create_table "payplans", id: :serial, force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "date"
    t.integer "card_id"
    t.text "comments"
    t.integer "user_id"
    t.boolean "archived", default: false
  end

  create_table "responsible_parties", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", limit: 255, default: "", null: false
    t.string "encrypted_password", limit: 255, default: "", null: false
    t.string "reset_password_token", limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
