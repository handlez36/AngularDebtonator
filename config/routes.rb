Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get "payplans/destroy"
  get "payplan/destroy"
  devise_for :users
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  root 'static_pages#index'
  put 'payplans/:id/lock', to: 'payplans#lock', as: 'lock_payment'
  get 'payplans/:id', to: 'payplans#archived', as: 'show_payment'
  get 'payplans/', to: 'payplans#archived', as: 'archived_payments'
  get 'setup/', to: 'expenses#setup', as: 'setup'
  
  resources :uploaders, :only => [:index]
  resources :cards
  resources :responsible_parties
  resources :setups
  resources :payments, :only => [:edit, :update]
  resources :payments, as: 'delete_payment', :only => [:destroy]
  resources :expenses, :only => [:new, :edit, :create, :index, :show] do
    resource :payments, :only => [:create]
  end
  resources :expenses, as: 'destroy_expense', :only => [:destroy]
  resources :expenses, as: 'update_expense', :only => [:update]
  resources :payplans, :only => [:destroy]

  # 2002 Angular routes
  get 'v2/', to: 'v2/dashboards#index', as: 'v2'
  get 'v2/:page', to: 'v2/dashboards#index', as: 'v2page'

  # 2020 Api routes
  get '/api/expenses', to: 'api/v1/expenses#index'
end
